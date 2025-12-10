// ...existing code...
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { CgSpinner } from 'react-icons/cg'
import Image from 'next/image'
import downloadIcon from '@/public/assets/downloadIcon.png'

type Props = {
  label: string
  description?: string
  value?: string | null
  onChange: (id: string | null) => void
}

type MediaDoc = {
  id: string
  filename: string
  mimeType: string
  filesize: number
  url: string
}

export const CustomUploadField: React.FC<Props> = ({ label, description, value, onChange }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<MediaDoc | null>(null)
  const lastFetchedId = useRef<string | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!value) {
      setUploadedFile(null)
      lastFetchedId.current = null
      return
    }

    if (lastFetchedId.current === value) return
    if (isLoading) return

    setIsLoading(true)
    lastFetchedId.current = value

    fetch(`/api/media/${value}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar archivo')
        return res.json()
      })
      .then((data) => {
        if (data && data.id) {
          setUploadedFile(data)
        } else {
          setUploadedFile(null)
          onChangeRef.current(null)
        }
      })
      .catch((error) => {
        console.error('Error cargando archivo:', error)
        setUploadedFile(null)
        onChangeRef.current(null)
      })
      .finally(() => setIsLoading(false))
  }, [value, isLoading])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error del servidor:', errorText)
        throw new Error('Error al subir archivo')
      }

      const data = await res.json()

      if (data.doc) {
        setUploadedFile(data.doc)
        onChangeRef.current(String(data.doc.id))
        lastFetchedId.current = String(data.doc.id)
      } else {
        console.error('Respuesta inválida del servidor:', data)
      }
    } catch (e) {
      console.error('Error al subir archivo:', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setUploadedFile(null)
    lastFetchedId.current = null
    onChangeRef.current(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    },
  })

  // shared grid class to keep columns aligned
  const gridClass = 'grid grid-cols-[140px_minmax(150px,320px)_auto] gap-4 items-center'

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className={gridClass}>
          <div className="text-gray-800 font-semibold text-base">{label}</div>
          <div className="flex items-center justify-center h-32">
            <CgSpinner className="animate-spin text-purple-500" size={30} />
            <span className="ml-3 text-gray-600">Cargando...</span>
          </div>
          <div className="flex flex-col items-end">{/* espacio para botón / descripción */}</div>
        </div>
      </div>
    )
  }

  // --- ARCHIVO CARGADO ---
  if (uploadedFile) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className={gridClass}>
          <label className="text-gray-800 font-semibold text-base">{label}</label>

          <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200 h-32">
            {uploadedFile.url && uploadedFile.mimeType?.includes('image') && (
              <Image
                src={uploadedFile.url}
                alt={uploadedFile.filename}
                className="w-10 h-10 object-cover rounded"
                width={40}
                height={40}
              />
            )}
            <span className="flex-1 text-gray-700 text-sm ml-3 truncate">
              {uploadedFile.filename}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 font-semibold ml-2 text-sm"
            >
              Quitar
            </button>
          </div>

          <div className="flex flex-col items-end">
            {description && (
              <p className="text-sm text-gray-500 text-right max-w-[180px]">{description}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // --- DROPZONE ---
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className={gridClass}>
        <div className="text-gray-800 font-semibold text-base">{label}</div>

        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-6 h-32 w-full border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
            isDragActive ? 'bg-violet-50 border-violet-600' : 'bg-transparent border-violet-500'
          }`}
        >
          <input {...getInputProps()} />
          <Image src={downloadIcon} alt="Icono de carga" width={24} height={24} className="mb-2" />
          <p className="text-violet-500 text-sm text-center">
            {isDragActive ? '¡Soltá el archivo!' : 'Arrastrá y soltá o seleccioná un archivo'}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            {...getRootProps()}
            className="w-36 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md py-2 transition-colors"
          >
            Subir
          </button>
          {description && (
            <p className="text-xs text-gray-500 text-left items-start">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomUploadField
