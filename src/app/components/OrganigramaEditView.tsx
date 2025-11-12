// src/app/components/OrganigramaEditView.tsx

'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs' // (Tu import de Shadcn)

// --- ¡ESTA ES LA CORRECCIÓN CLAVE! ---
// Importamos 'useField' (que ya tenías) y 'useForm' (que nos faltaba)
import { useField, Gutter, SaveButton, Fields, useForm } from '@payloadcms/ui'
// 1. Ya no aceptamos 'props' de tipo OrganigramaViewProps
const OrganigramaEditView: React.FC<any> = (props) => {
  // (Opcional) Hacé un log para ver todo lo que te pasa Payload
  console.log('Props de OrganigramaEditView (Wrapper):', props)

  // --- ¡AQUÍ ESTÁ LA MAGIA! ---
  // 2. Obtenemos los componentes del hook useForm(), no de props.
  //    Este hook SÍ funciona porque estamos en un Componente de Cliente.
  const { Gutter, Fields, SaveButton } = useForm() as any
  console.log(Gutter, Fields, SaveButton)

  // 3. El resto de tu lógica está perfecta.
  const { value: currentRol, setValue: setRol } = useField<string>({ path: 'rol' })

  const handleTabChange = (newTabValue: string) => {
    setRol(newTabValue)
  }

  // 4. Añadimos una guarda de carga.
  //    Ahora SÍ funcionará, porque Gutter, Fields y SaveButton
  //    vendrán del hook después del primer render.
  if (!Gutter || !Fields || !SaveButton) {
    return <div className="gutter p-8">Cargando componentes...</div>
  }

  // 5. El JSX ahora es válido.
  return (
    <Gutter className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión del Organigrama</h1>
        <SaveButton />
      </div>

      <Tabs value={currentRol || 'intendente'} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="intendente">Intendente</TabsTrigger>
          <TabsTrigger value="secretario">Secretarios / Funcionarios</TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA INTENDENTE --- */}
        <TabsContent value="intendente">
          <div className="p-6 border bg-white rounded-lg mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Datos del Intendente</h2>
            <p className="text-gray-600 text-sm mb-6">
              Cargá los datos del intendente para la cabecera del organigrama.
            </p>
            <Fields fieldMap={['fullName', 'summary', 'photo', 'cv']} />
          </div>
        </TabsContent>

        {/* --- PESTAÑA SECRETARIOS --- */}
        <TabsContent value="secretario">
          <div className="p-6 border bg-white rounded-lg mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Datos del Funcionario / Secretario
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Cargá los datos del funcionario y las áreas que dependen de él.
            </p>
            <Fields
              fieldMap={['fullName', 'puesto', 'summary', 'photo', 'cv', 'areasSubordinadas']}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Gutter>
  )
}

export default OrganigramaEditView
