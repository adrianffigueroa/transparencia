'use client'

import React, { useState, useEffect } from 'react'
import { CustomUploadField } from '@/app/components/admin/shared/CustomUploadField'
// 1. Importamos el ColorPicker
import { ColorPickerFancy } from '@/app/components/ColorPickerFancy'

const LookAndFeelCustomView = () => {
  // Estados existentes
  const [logoId, setLogoId] = useState<string | null>(null)
  const [faviconId, setFaviconId] = useState<string | null>(null)

  // 2. Nuevos Estados para Colores
  const [primaryColor, setPrimaryColor] = useState<string>('#000000')
  const [secondaryColor, setSecondaryColor] = useState<string>('#000000')

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/globals/site-customization')
        const json = await res.json()

        setLogoId(typeof json.logo === 'object' ? json.logo?.id : json.logo)
        setFaviconId(typeof json.favicon === 'object' ? json.favicon?.id : json.favicon)

        // 3. Cargamos los colores (con fallback)
        setPrimaryColor(json.primaryColor || '#000000')
        setSecondaryColor(json.secondaryColor || '#000000')
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Guardar datos
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/globals/site-customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo: logoId,
          favicon: faviconId,
          // 4. Enviamos los colores
          primaryColor,
          secondaryColor,
        }),
      })
      if (res.ok) alert('¡Guardado!')
      else alert('Error al guardar')
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-8">Cargando...</div>

  return (
    <div className="flex flex-col px-20 w-full">
      <div className="flex justify-between mb-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900">Apariencia</h2>
          <p className="text-gray-500 text-lg mt-1">Configuración visual del portal.</p>
        </div>
        <div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-blue-500 border border-blue-500 px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
      <div className="p-8  bg-white rounded-lg">
        <div className="space-y-8">
          {/* Logos */}
          <CustomUploadField
            label="Logo del Municipio"
            description="Tamaño recomendado: 400x400 px. PNG o SVG."
            value={logoId}
            onChange={setLogoId}
          />

          <CustomUploadField
            label="Favicon"
            description="Tamaño recomendado: 16x16 o 32x32 px. ICO o PNG."
            value={faviconId}
            onChange={setFaviconId}
          />

          {/* 5. NUEVA SECCIÓN: Paleta de Colores */}
          <div className="bg-white p-8 flex gap-6">
            <h3 className=" text-gray-800 font-semibold text-base mb-6">Paleta de colores</h3>

            {/* Grid para ponerlos uno al lado del otro */}
            <div className="flex gap-6">
              <ColorPickerFancy
                label="Color primario"
                value={primaryColor}
                onChange={setPrimaryColor}
              />

              <ColorPickerFancy
                label="Color secundario"
                value={secondaryColor}
                onChange={setSecondaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookAndFeelCustomView
