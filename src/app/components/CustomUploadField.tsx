// src/app/components/CustomUploadField.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useField } from '@payloadcms/ui'
import { AiOutlineUpload } from 'react-icons/ai'
import { CgSpinner } from 'react-icons/cg'
import Image from 'next/image'

type Props = {
  path: string
}

type MediaDoc = {
  id: string
  filename: string
  mimeType: string
  filesize: number
  url: string
}

export const CustomUploadField: React.FC<Props> = () => {
  const fieldProps = useField() as any
  const path = fieldProps.path // Ej: "favicon"
  const mediaID = fieldProps.value // Ej: null
  const setValue = fieldProps.setValue // La función
  const label = fieldProps.customComponents?.Field?.props?.children?.props?.field?.label
  const name = fieldProps.customComponents?.Field?.props?.children?.props?.field?.name
  const description =
    fieldProps.customComponents?.Field?.props?.children?.props?.field?.admin?.description

  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<MediaDoc | null>(null)

  // --- 1. useEffect AHORA SOLO CARGA DATOS ---
  useEffect(() => {
    // Si no hay ID, no hagas nada.
    if (!mediaID) {
      // (Quitamos el 'setUploadedFile(null)' de aquí)
      return
    }

    // Si el ID ya coincide con el archivo que mostramos, no hagas nada.
    if (uploadedFile?.id === mediaID) {
      return
    }

    // Si hay un ID pero no tenemos el archivo, búscalo.
    setIsLoading(true) // Spinner ON
    fetch(`/api/media/${mediaID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.filename) {
          setUploadedFile(data)
        } else {
          // El ID era malo o el fetch falló, limpia el valor en Payload
          setValue(null)
          setUploadedFile(null)
        }
        setIsLoading(false) // Spinner OFF
      })
      .catch(() => {
        setIsLoading(false) // Spinner OFF
        setUploadedFile(null)
        setValue(null)
      })
  }, [mediaID, uploadedFile?.id, setValue]) // Dependencias actualizadas

  // --- 2. onDrop SOLO SUBE Y SETEA EL ID ---
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setIsLoading(true) // Spinner ON (para la subida)
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (data.doc) {
          // ¡ÉXITO! Solo seteamos el ID.
          // El useEffect se encargará del resto.
          setValue(data.doc.id)
        } else {
          console.error('Error al subir:', data)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Error de fetch:', e)
        setIsLoading(false)
      }
    },
    [setValue],
  )

  // --- 3. onRemove AHORA LIMPIA TODO ---
  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Limpia el ID en Payload
    setValue(null)
    // Limpia el archivo en el estado local
    setUploadedFile(null)
  }

  // ... (useDropzone no cambia) ...
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': [] },
  })

  // ... (Tu JSX de 'return' es 100% correcto y no necesita cambios) ...
  // --- RENDERIZADO ---
  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center h-40">
        <CgSpinner className="animate-spin text-purple-500" size={30} />
      </div>
    )
  }

  if (uploadedFile) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mt-4">
        <label className="block text-gray-800 font-semibold text-base mb-4">
          {label as string}
        </label>
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
          {uploadedFile.url && uploadedFile.mimeType?.includes('image') ? (
            <Image
              src={uploadedFile.url}
              alt={uploadedFile.filename}
              className="w-10 h-10 object-cover rounded"
              width={40}
              height={40}
            />
          ) : null}
          <span className="grow text-gray-700 text-sm ml-3">{uploadedFile.filename}</span>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 font-semibold ml-4"
          >
            Quitar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mt-4">
      <div className="flex items-center justify-between gap-1">
        <div className="grow">
          <label className="block text-gray-800 font-semibold text-base mb-4 whitespace-nowrap">
            {label as string}
          </label>
        </div>
        <div className="w-1/3">
          <div
            {...getRootProps()}
            className={`
              flex flex-col items-center justify-center 
              p-4 border-2 border-dashed rounded-xl h-[120px] 
              cursor-pointer transition-colors
              ${isDragActive ? ' border-blue-600' : ' border-blue-500'}
            `}
          >
            <input {...getInputProps()} />
            <AiOutlineUpload size={24} className="text-purple-600 mb-2" />
            <p className="text-blue-600 text-sm text-center">
              {isDragActive ? '¡Soltá el archivo!' : 'Arrastrá y soltá o seleccioná un archivo'}
            </p>
          </div>
        </div>

        <div className="grow pt-10 pr-8 pl-6 flex flex-col items-start">
          <button
            type="button"
            {...getRootProps()}
            className=" w-1/4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md px-4 py-2 border-0 hover:cursor-pointer"
          >
            Subir {name as string}
          </button>

          {description && (
            <p className="text-sm text-gray-500 mt-2 text-center">{description as string}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomUploadField
