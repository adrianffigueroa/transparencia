// src/app/components/CheckboxGroup.tsx

'use client'

import React from 'react'
import { useField } from '@payloadcms/ui' // Solo necesitamos este hook

// Helper
const isSelected = (value: string, selected: string[]) => {
  return selected?.includes(value)
}

// 1. Tu componente RECIBE 'props' de Payload
export const CheckboxGroup: React.FC<any> = (props) => {
  // --- DEBUG INICIAL (para ver qué llega) ---
  console.log('--- CheckboxGroup PROPS ---', props)

  // 2. Extraemos 'path', 'label' y 'options' de las PROPS
  //    (Basado en tu captura de pantalla, esta es la ruta correcta)
  const path = props.path
  const label = props.field?.label
  const options = props.field?.options || [] // Usamos '|| []' como fallback

  // 3. AHORA usamos el 'path' de las props para obtener el 'value' y 'setValue'
  const { value: selectedValues = [], setValue } = useField<string[]>({ path })

  // --- DEBUG FINAL (para ver qué extrajimos) ---
  console.log('--- CheckboxGroup VARS ---', { path, label, options, selectedValues })

  // 4. Tu lógica de 'handleChange' (esta estaba bien)
  const handleChange = (optionValue: string) => {
    let newValues: string[]

    if (isSelected(optionValue, selectedValues)) {
      newValues = selectedValues.filter((val) => val !== optionValue)
    } else {
      newValues = [...(selectedValues || []), optionValue]
    }

    setValue(newValues)
  }

  // 5. Tu JSX (ahora 'options' será un array)
  return (
    <div className="py-2 w-2/3">
      <label className="field-label mb-2 block">{label}</label>
      <div className="grid grid-cols-2 gap-3 rounded-md border border-gray-300 p-4">
        {options.map((option: { label: string; value: string }) => (
          <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox"
              value={option.value}
              checked={isSelected(option.value, selectedValues)}
              onChange={() => handleChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export default CheckboxGroup
