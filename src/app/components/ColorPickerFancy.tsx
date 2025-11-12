'use client'

import React, { useEffect, useMemo, useState } from 'react'
// 1. ELIMINAMOS 'HexColorPicker' ya que no se usará
// import { HexColorPicker } from 'react-colorful'

type Props = {
  value?: string
  onChange?: (val: string) => void
  // Payload pasa muchas props; permitimos cualquier cosa
} & any

const normalizeHex = (v?: string) => {
  if (!v || typeof v !== 'string') return ''
  const s = v.trim().toLowerCase()
  if (s.startsWith('#')) return s
  return s.length === 6 ? `#${s}` : `#${s}`
}
const isValidHex = (s?: string) => /^#[0-9a-f]{6}$/.test((s || '').toLowerCase())

export default function ColorPickerFancy(props: Props) {
  // usamos props completo para poder leer label/field/schema/path/description etc.
  const { value, onChange } = props

  // (Esta lógica para encontrar el label y la descripción está perfecta)
  const resolvedLabel =
    props.label ||
    props.field?.label ||
    props.schema?.label ||
    props.labelKey ||
    (() => {
      const path = props.path || ''
      if (!path) return 'Color'
      const words = path
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_\-]+/g, ' ')
        .split(' ')
        .map((w: string) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
        .filter(Boolean)
      return words.join(' ') || 'Color'
    })()
  const resolvedDescription = props.description || props.field?.admin?.description || ''

  // (Toda esta lógica de estado y validación está perfecta)
  const normalizedFromProps = useMemo(() => normalizeHex(value), [value])
  const [localColor, setLocalColor] = useState<string>(normalizedFromProps || '')

  useEffect(() => {
    if (normalizedFromProps && normalizedFromProps !== localColor)
      setLocalColor(normalizedFromProps)
    if (!normalizedFromProps && localColor) setLocalColor('')
    // eslint-disable-next-line
  }, [normalizedFromProps])

  // 2. ELIMINAMOS handlePickerChange porque ya no hay picker
  // const handlePickerChange = (newColor: string) => { ... }

  // (Esta lógica para el input está perfecta)
  const handleInputChange = (val: string) => {
    setLocalColor(val)
    if (isValidHex(val)) onChange?.(val.toLowerCase())
  }
  const handleInputBlur = () => {
    const normalized = normalizeHex(localColor)
    setLocalColor(normalized)
    if (isValidHex(normalized)) onChange?.(normalized)
  }
  const swatchColor = isValidHex(localColor)
    ? localColor
    : isValidHex(normalizedFromProps)
      ? normalizedFromProps
      : '#000000'

  // --- 3. ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Reorganizamos el JSX para que coincida con tu imagen deseada
  return (
    <div className="bg-white" style={{ marginBottom: 12 }}>
      {/* 1. Etiqueta (Color primario) */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>{resolvedLabel}</label>
          {props.required ? <span style={{ color: '#ff6b6b' }}>*</span> : null}
        </div>
        {/* Los errores se mostrarán aquí si los hay */}
        {props.showError ? (
          <div style={{ fontSize: 12, color: '#ff6b6b', marginTop: 6 }}>
            {props.errorMessage || 'Valor inválido'}
          </div>
        ) : null}
      </div>

      {/* 2. Contenedor para [Swatch] y [Input] */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* El recuadro de color (Swatch) */}
        <div
          aria-hidden
          style={{
            width: 48,
            height: 32,
            borderRadius: 6,
            border: '1px solid #222',
            background: swatchColor,
            flexShrink: 0, // Evita que se encoja
          }}
        />

        {/* El campo de texto */}
        <input
          type="text"
          value={localColor || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          placeholder="#000000"
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #2b2b2b',
            background: 'transparent',
            color: 'inherit',
            width: '100%', // Ocupa el espacio restante
          }}
        />
      </div>

      {/* 3. Descripción (debajo de todo) */}
      {resolvedDescription ? (
        <div style={{ fontSize: 12, color: '#9a9a9a', marginTop: 8 }}>{resolvedDescription}</div>
      ) : null}
    </div>
  )
}
