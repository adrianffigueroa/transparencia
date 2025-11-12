'use client'
import React, { useEffect } from 'react'
import { useField } from '@payloadcms/ui' // este sí suele estar disponible

const CATEGORY_OPTIONS = [
  { value: 'logo', label: 'Logo' },
  { value: 'perfil', label: 'Foto de perfil' },
  { value: 'public-works', label: 'Foto de obra' },
  { value: 'documento', label: 'Documento' },
  { value: 'banner', label: 'Banner' },
  { value: 'otros', label: 'Otros' },
]

const CategorySelect: React.FC<any> = (props) => {
  const { value, setValue } = useField<string>({ path: props.path })

  useEffect(() => {
    if (!value) {
      const urlParams = new URLSearchParams(window.location.search)
      const category = urlParams.get('public-works')
      if (category && CATEGORY_OPTIONS.some((opt) => opt.value === category)) {
        setValue(category)
      }
    }
  }, [value, setValue])

  return (
    <select
      {...props}
      value={value || ''}
      onChange={(e) => setValue(e.target.value)}
      style={{ width: '100%', padding: 8 }}
    >
      <option value="">Seleccionar categoría...</option>
      {CATEGORY_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export default CategorySelect
