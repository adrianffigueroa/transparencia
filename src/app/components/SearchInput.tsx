'use client'

import React, { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Input } from '@/app/components/ui/input' // Asumiendo la ruta de tu Input
import { Search } from 'lucide-react'

// Definimos las props que el componente padre puede pasarle
interface SearchInputProps {
  /**
   * Función que se llama cuando el usuario presiona "Enter".
   * Devuelve el término de búsqueda.
   */
  onSearch: (query: string) => void
  /**
   * El texto que se muestra cuando el input está vacío.
   */
  placeholder?: string
  /**
   * Clases de Tailwind adicionales para el contenedor,
   * útil para ajustar el ancho (ej: "w-full" o "w-64").
   */
  className?: string
}

export function SearchInput({
  onSearch,
  placeholder = 'Buscar por palabra clave', // Valor por defecto
  className = '',
}: SearchInputProps) {
  // Estado local para guardar el valor del input
  const [query, setQuery] = useState('')

  // Manejador para el evento de presionar una tecla
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Si la tecla es "Enter" y el query no está vacío
    if (e.key === 'Enter' && query.trim() !== '') {
      e.preventDefault() // Previene el envío de un formulario
      onSearch(query.trim()) // Llama a la función del padre
    }
  }

  // Manejador para actualizar el estado mientras se escribe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <div className={`relative ${className}  `}>
      {/* 1. El ícono de Lupa */}
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

      {/* 2. El Input de shadcn */}
      <Input
        type="search" // El tipo "search" es semántico y a veces añade una 'x' para borrar
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        // La clase 'pl-10' es clave: añade padding a la izquierda
        // para que el texto no se escriba encima del ícono.
        className="w-full pl-10 border rounded-t-md rounded-b-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
      />
    </div>
  )
}
