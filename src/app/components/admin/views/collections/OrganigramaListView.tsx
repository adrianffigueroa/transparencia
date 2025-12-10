'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EditTable from '../../shared/EditTable'

const OrganigramaListView = () => {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasIntendente, setHasIntendente] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Verificar si existe intendente
        const checkRes = await fetch(
          '/api/organigrama_person?where[role][equals]=Intendente&limit=1',
        )
        const checkData = await checkRes.json()

        if (!active) return

        const intendenteExists = checkData.totalDocs > 0
        setHasIntendente(intendenteExists)

        if (!intendenteExists) {
          setIsLoading(false)
          return
        }

        // Cargar todos los registros
        const res = await fetch('/api/organigrama_person')
        const json = await res.json()

        if (!active) return

        console.log('📦 Datos recibidos:', json)

        const formattedData =
          json.docs?.map((doc: any) => ({
            id: doc.id,
            fullName: doc.fullName || '-',
            role: doc.role || '-',
            createdAt: doc.createdAt
              ? new Date(doc.createdAt).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '-',
            isPublished: doc.isPublished ? 'Publicado' : 'No publicado',
          })) || []

        console.log('✅ Datos formateados:', formattedData)
        setData(formattedData)
      } catch (error) {
        console.error('❌ Error fetching data:', error)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [])

  const columns = [
    { key: 'fullName', label: 'Nombre Completo', width: 'w-[30%]' },
    { key: 'role', label: 'Cargo', width: 'w-[20%]' },
    { key: 'createdAt', label: 'Creado', width: 'w-[15%]' },
    { key: 'isPublished', label: 'Estado', width: 'w-[15%]' },
  ]

  const handleEdit = (row: any) => {
    console.log('Editando:', row)
    router.push(`/admin/collections/organigrama_person/${row.id}`)
  }

  const handleDelete = async (row: any) => {
    if (!confirm(`¿Estás seguro de eliminar a ${row.name}?`)) return

    try {
      const res = await fetch(`/api/organigrama_person/${row.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Persona eliminada correctamente')
        setData((prev) => prev.filter((item) => item.id !== row.id))
      } else {
        const error = await res.json()
        alert(`Error: ${error.errors?.[0]?.message || 'Error al eliminar'}`)
      }
    } catch (error) {
      console.error('Error eliminando:', error)
      alert('Error al conectar con el servidor')
    }
  }

  // Estado de verificación inicial
  if (hasIntendente === null || isLoading) {
    return (
      <div className="p-10 bg-white rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-500">
          {hasIntendente === null ? 'Verificando...' : 'Cargando organigrama...'}
        </p>
      </div>
    )
  }

  // Si no hay intendente, mostrar mensaje
  if (!hasIntendente) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2">No hay Intendente registrado</h2>
          <p className="text-blue-700 mb-4">
            Creá primero el Intendente para comenzar a armar el organigrama.
          </p>
          <button
            onClick={() => router.push('/admin/collections/organigrama_person/create')}
            className="bg-white border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Crear Intendente
          </button>
        </div>
      </div>
    )
  }

  // Vista normal con tabla
  return (
    <div className="mx-20 mt-8 ">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Organigrama Municipal</h2>
          <p className="text-gray-500 font-normal text-lg">Listado de personas del organigrama</p>
        </div>
        <button
          className="bg-white text-blue-500 border border-blue-500 px-6 py-2 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => router.push('/admin/collections/organigrama_person/create')}
        >
          Nuevo Miembro
        </button>
      </div>

      <EditTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default OrganigramaListView
