'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EditTable from '../../shared/EditTable'

const BudgetListView = () => {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/budget')
        const json = await res.json()
        console.log('📦 Datos recibidos:', json)

        // Transformar los datos para la tabla
        const formattedData =
          json.docs?.map((doc: any) => ({
            title: doc.title,
            publishedDate: doc.createdAt
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
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const columns = [
    { key: 'title', label: 'Título', width: 'w-[150px]' },
    { key: 'publishedDate', label: 'Fecha de Publicación', width: 'w-[180px]' },
    { key: 'isPublished', label: 'Estado', width: 'w-[150px]' },
  ]

  const handleEdit = (row: any) => {
    console.log('Editando:', row)
    router.push(`/admin/collections/budget/${row.id}`)
  }

  const handleDelete = async (row: any) => {
    if (!confirm(`¿Estás seguro de eliminar el presupuesto ${row.title}?`)) return

    try {
      const res = await fetch(`/api/budget/${row.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Presupuesto eliminado correctamente')
        // Recargar datos
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

  if (isLoading) {
    return (
      <div className="p-10 bg-white rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando presupuestos...</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-black">Presupuestos</h2>
          <p className="text-black font-normal text-sm">
            Listado de todos los presupuestos cargados
          </p>
        </div>
        <button
          className="bg-transparent text-blue-500 border-blue-500 px-6 py-2 rounded-xl font-medium hover:bg-blue-600 hover:text-white hover:cursor-pointer transition-colors"
          onClick={() => router.push('/admin/collections/budget/create')}
        >
          Nuevo Presupuesto
        </button>
      </div>

      <EditTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default BudgetListView
