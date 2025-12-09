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
  const onChangeRef = useRef(onChange) // ✅ Guardar onChange en ref

  // ✅ Actualizar la ref cuando onChange cambie
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // --- useEffect: Cargar detalles cuando value cambia ---
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
          onChangeRef.current(null) // ✅ Usar ref
        }
      })
      .catch((error) => {
        console.error('Error cargando archivo:', error)
        setUploadedFile(null)
        onChangeRef.current(null) // ✅ Usar ref
      })
      .finally(() => setIsLoading(false))
  }, [value, isLoading])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    console.log('📁 Archivo seleccionado:', file.name)
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('⬆️ Subiendo archivo a /api/media...')
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      console.log('📡 Respuesta del servidor, status:', res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ Error del servidor:', errorText)
        throw new Error('Error al subir archivo')
      }

      const data = await res.json()
      console.log('📦 Data recibida:', data)

      if (data.doc) {
        console.log('✅ Archivo subido exitosamente, ID:', data.doc.id)
        setUploadedFile(data.doc)
        onChangeRef.current(data.doc.id) // ✅ Usar ref en lugar de onChange directamente
        lastFetchedId.current = data.doc.id
        console.log('🔄 onChange llamado con ID:', data.doc.id)
      } else {
        console.error('⚠️ Respuesta inválida del servidor (falta data.doc):', data)
      }
    } catch (e) {
      console.error('💥 Error al subir archivo:', e)
    } finally {
      setIsLoading(false)
    }
  }, []) // ✅ Sin dependencias porque usamos ref

  const onRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setUploadedFile(null)
    lastFetchedId.current = null
    onChangeRef.current(null) // ✅ Usar ref
  }, []) // ✅ Sin dependencias

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': [], 'application/pdf': [] },
  })

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center h-40">
        <CgSpinner className="animate-spin text-purple-500" size={30} />
        <span className="ml-3 text-gray-600">Cargando...</span>
      </div>
    )
  }

  // --- ARCHIVO CARGADO ---
  if (uploadedFile) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <label className="block text-gray-800 font-semibold text-base mb-4">{label}</label>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
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
            className="text-red-500 hover:text-red-700 font-semibold ml-4 text-sm"
          >
            Quitar
          </button>
        </div>
        {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
      </div>
    )
  }

  // --- DROPZONE ---
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex gap-8 items-center">
        <div className="w-28 flex-shrink-0">
          <div className="text-gray-800 font-semibold text-base">{label}</div>
        </div>
        <div className="flex-1">
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
              isDragActive ? 'bg-violet-50 border-violet-600' : 'bg-transparent border-violet-500'
            }`}
          >
            <input {...getInputProps()} />
            <Image
              src={downloadIcon}
              alt="Icono de carga"
              width={24}
              height={24}
              className="mb-2"
            />
            <p className="text-violet-500 text-sm text-center">
              {isDragActive ? '¡Soltá el archivo!' : 'Arrastrá y soltá o seleccioná un archivo'}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            {...getRootProps()}
            className="w-20 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md py-2 transition-colors"
          >
            Subir
          </button>
          {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
        </div>
      </div>
    </div>
  )
}

export default CustomUploadField
