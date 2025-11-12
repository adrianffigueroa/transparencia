// src/app/components/MapPreviewWrapper.tsx

'use client' // <--- ¡MUY IMPORTANTE!

import React from 'react'
import dynamic from 'next/dynamic'

// Mueve la importación dinámica de PublicWorks.ts AQUÍ
// Ahora es seguro usar 'ssr: false' porque este es un Client Component
const MapPreview = dynamic(
  () => import('./MapPreview'), // Importa el componente de mapa
  {
    ssr: false, // Ahora esto es válido
    loading: () => <p>Cargando mapa...</p>, // Opcional: un buen loader
  },
)

// Este es el componente que realmente usarás en tu colección
const MapPreviewWrapper: React.FC = () => {
  return <MapPreview />
}

export default MapPreviewWrapper
