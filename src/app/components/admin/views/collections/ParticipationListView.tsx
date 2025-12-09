'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Button } from '@/app/components/ui/button'
import { FaSave, FaEdit } from 'react-icons/fa'

const ParticipationListView = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('config')
  const [config, setConfig] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [heroText, setHeroText] = useState('')
  const [instructions, setInstructions] = useState('')
  const [enableSubmissions, setEnableSubmissions] = useState(true)

  useEffect(() => {
    // Cargar configuración (documento con isConfig=true)
    fetch('/api/participation?where[isConfig][equals]=true&limit=1')
      .then((res) => res.json())
      .then((data) => {
        if (data.docs.length > 0) {
          const cfg = data.docs[0]
          setConfig(cfg)
          setHeroText(cfg.heroText || '')
          setInstructions(cfg.instructions || '')
          setEnableSubmissions(cfg.enableSubmissions ?? true)
        }
      })

    // Cargar propuestas (documentos con isConfig=false o undefined)
    fetch('/api/participation?where[isConfig][not_equals]=true')
      .then((res) => res.json())
      .then((data) => setProposals(data.docs))
  }, [])

  const handleSaveConfig = async () => {
    const method = config?.id ? 'PATCH' : 'POST'
    const url = config?.id ? `/api/participation/${config.id}` : '/api/participation'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isConfig: true,
        heroText,
        instructions,
        enableSubmissions,
      }),
    })

    router.refresh()
  }

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Participación Ciudadana</h2>
        {activeTab === 'config' && (
          <Button onClick={handleSaveConfig} className="bg-blue-600 hover:bg-blue-700">
            <FaSave className="mr-2" /> Guardar Configuración
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">⚙️ Configuración</TabsTrigger>
          <TabsTrigger value="proposals">📋 Propuestas ({proposals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-6 space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <label className="block text-sm font-medium mb-2">Texto Hero</label>
            <textarea
              value={heroText}
              onChange={(e) => setHeroText(e.target.value)}
              className="w-full border rounded p-3 min-h-[100px]"
              placeholder="Tu voz es importante..."
            />
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <label className="block text-sm font-medium mb-2">Instrucciones</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full border rounded p-3 min-h-[150px]"
            />
          </div>

          <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
            <input
              type="checkbox"
              checked={enableSubmissions}
              onChange={(e) => setEnableSubmissions(e.target.checked)}
              className="w-5 h-5"
            />
            <label className="text-sm font-medium">Habilitar envío de propuestas</label>
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="mt-6">
          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left">Título</th>
                  <th className="p-3 text-left">Ciudadano</th>
                  <th className="p-3 text-left">Área</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">{p.fullName}</td>
                    <td className="p-3">{p.projectArea}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          p.status === 'aprobado'
                            ? 'bg-green-100 text-green-800'
                            : p.status === 'rechazado'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/collections/participation/${p.id}`)}
                      >
                        <FaEdit className="mr-1" /> Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ParticipationListView
