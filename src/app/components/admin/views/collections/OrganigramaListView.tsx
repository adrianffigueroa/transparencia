'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const OrganigramaListView = () => {
  const router = useRouter()
  const [hasIntendente, setHasIntendente] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const res = await fetch('/api/organigrama_person?where[role][equals]=Intendente&limit=1')
        const data = await res.json()
        if (active) setHasIntendente(data.totalDocs > 0)
      } catch {
        if (active) setHasIntendente(true)
      }
    }
    check()
    return () => {
      active = false
    }
  }, [])

  if (hasIntendente === null) {
    return <div className="p-8">Verificando...</div>
  }

  if (!hasIntendente) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2">No hay Intendente registrado</h2>
          <p className="text-blue-700 mb-4">
            Crea primero el Intendente para comenzar a armar el organigrama.
          </p>
          <button
            onClick={() => router.push('/admin/collections/organigrama_person/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Crear Intendente
          </button>
        </div>
      </div>
    )
  }

  // Si existe Intendente, delega a la vista nativa de Payload
  return null // o importa y renderiza DefaultListView si lo exporta Payload
}

export default OrganigramaListView
