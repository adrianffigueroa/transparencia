'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Gutter } from '@payloadcms/ui'
import { Plus, UserCog } from 'lucide-react'

const OrganigramaListHeader = () => {
  const [intendenteID, setIntendenteID] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscamos si existe un intendente
    const checkIntendente = async () => {
      try {
        const res = await fetch('/api/organigrama_person?where[rol][equals]=intendente')
        const data = await res.json()
        if (data.docs && data.docs.length > 0) {
          setIntendenteID(data.docs[0].id)
        }
      } catch (error) {
        console.error('Error verificando intendente:', error)
      } finally {
        setLoading(false)
      }
    }

    checkIntendente()
  }, [])

  if (loading) return null // O un spinner pequeño

  return (
    <Gutter className="mb-8">
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* ESTADO 1: YA EXISTE INTENDENTE */}
        {intendenteID ? (
          <>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Gestión del Organigrama</h3>
              <p className="text-sm text-gray-500">
                El intendente ya está registrado. Puedes editarlo o agregar nuevos funcionarios.
              </p>
            </div>
            <div className="flex gap-3">
              {/* Botón para EDITAR al Intendente existente */}
              <Link
                href={`/admin/collections/organigrama_person/${intendenteID}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 text-gray-700"
              >
                <UserCog size={16} />
                Editar Intendente
              </Link>

              {/* Botón para CREAR FUNCIONARIO (Pasamos rol=secretario por URL para ayudar a la UI) */}
              <Link
                href="/admin/collections/organigrama_person/create"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
              >
                <Plus size={16} />
                Crear Funcionario
              </Link>
            </div>
          </>
        ) : (
          /* ESTADO 2: NO EXISTE INTENDENTE */
          <>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Para comenzar, debes registrar al Intendente.
              </h3>
            </div>
            <Link
              href="/admin/collections/organigrama_person/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              Crear Intendente
            </Link>
          </>
        )}
      </div>

      <style jsx global>{`
        /* 1. Ocultar la barra superior (Buscador, Columnas, Filtros) */
        .collection-list__controls {
          display: none !important;
        }

        /* 2. Ocultar el bloque de "No se encontró ningún..." */
        .collection-list__no-results {
          display: none !important;
        }

        /* 3. Ocultar el botón nativo "Create New" (por si acaso) */
        .collection-list__header .btn--style-primary {
          display: none !important;
        }

        .search-bar {
          display: none !important;
        }
      `}</style>
    </Gutter>
  )
}

export default OrganigramaListHeader
