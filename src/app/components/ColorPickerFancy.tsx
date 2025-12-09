'use client'

import React, { useEffect, useState, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'

// Hook para clicks afuera
function useClickOutside(ref: any, handler: () => void) {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

type Props = {
  label: string
  value: string // Recibe el valor del padre
  onChange: (val: string) => void // Avisa al padre
}

export const ColorPickerFancy: React.FC<Props> = ({ label, value, onChange }) => {
  // Eliminamos useField. Usamos las props directas.
  const [showPicker, setShowPicker] = useState(false)
  const popover = useRef<HTMLDivElement>(null)

  useClickOutside(popover, () => setShowPicker(false))

  return (
    <div className="w-full">
      <label className="block text-gray-800 font-semibold text-base mb-4">{label}</label>

      <div className="relative flex items-center gap-3">
        {/* Swatch */}
        <div
          className="w-12 h-10 rounded border border-gray-300 shadow-sm cursor-pointer"
          style={{ backgroundColor: value || '#000000' }}
          onClick={() => setShowPicker(true)}
        />

        {/* Input */}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="border border-gray-300 rounded px-3 py-2 text-gray-400 text-sm w-full focus:outline-none focus:border-blue-500 uppercase"
        />

        {/* Picker Flotante */}
        {showPicker && (
          <div className="absolute top-12 left-0 z-10 shadow-xl rounded-lg" ref={popover}>
            <HexColorPicker color={value || '#000000'} onChange={onChange} />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">Se usará para títulos, botones y degradados</p>
    </div>
  )
}

export default ColorPickerFancy
