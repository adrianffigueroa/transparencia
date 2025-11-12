// src/app/components/OrganigramaEditViewWrapper.tsx
'use client' // ¡Clave 1!

import React from 'react'
import dynamic from 'next/dynamic'

// Clave 2: Cargamos la vista de pestañas dinámicamente en el cliente
const OrganigramaEditView = dynamic(
  () => import('@/app/components/OrganigramaEditView'), // Importa el componente de pestañas
  {
    ssr: false, // ¡Ahora esto es válido!
    loading: () => <div className="gutter p-8">Cargando vista...</div>,
  },
)

// Este es el componente que Payload renderiza
const OrganigramaEditViewWrapper: React.FC<any> = (props) => {
  // Clave 3: Pasa todas las props (que SÍ contienen Gutter, Fields, etc.) al hijo
  return <OrganigramaEditView {...props} />
}

export default OrganigramaEditViewWrapper
