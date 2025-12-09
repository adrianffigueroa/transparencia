'use client'

import React, { useEffect, useState } from 'react'
import { useField, useForm as usePayloadForm } from '@payloadcms/ui'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { CustomUploadField } from '@/app/components/admin/shared/CustomUploadField'
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa'
import CustomInput from '@/app/components/admin/shared/CustomInput'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
type SubordinateArea = {
  id?: string
  areaName: string
  responsibleName: string
}

const itemStyles =
  'bg-white rounded-lg p-3 pt-2 space-y-1 border-[0.2px] shadow-md border-[#B2B2B2]'
const labelStyles = 'text-gray-500 text-xs font-medium'
const inputStyles = `w-full border-none bg-white shadow-none p-0 h-auto text-base text-gray-500 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio'),
  role: z.string().min(1, 'El puesto o cargo es obligatorio'),
  bio: z.string().optional(),
  image: z.string().optional(),
  cv: z.string().optional(),
  subordinateAreas: z
    .array(
      z.object({
        areaName: z.string().optional(),
        responsibleName: z.string().optional(),
      }),
    )
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

const OrganigramaEditView = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      role: '',
      bio: '',
      image: '',
      cv: '',
      subordinateAreas: [],
    },
  })
  const [isLoading, setIsLoading] = useState<boolean | null>(true)
  const [isSaving, setIsSaving] = useState<boolean | null>(false)

  const router = useRouter()

  // Detectar si ya existe Intendente
  const [hasIntendente, setHasIntendente] = useState<boolean | null>(null)
  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const res = await fetch('/api/organigrama_person?where[role][equals]=Intendente&limit=1')
        const data = await res.json()
        if (active) setHasIntendente(data.totalDocs > 0)
      } catch {
        if (active) setHasIntendente(true) // fallback: asumimos que existe para no forzar
      }
    }
    check()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/organigrama_person')
        const json = await res.json()
        form.reset({
          fullName: json.fullName || '',
          role: json.role || '',
          bio: json.bio || '',
          image: json.image || '',
          cv: json.cv || '',
          subordinateAreas: json.subordinateAreas || [],
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [form])

  // Campos simples
  const { value: fullName, setValue: setFullName } = useField<string>({ path: 'fullName' })
  const { value: role, setValue: setRole } = useField<string>({ path: 'role' })
  const { value: bio, setValue: setBio } = useField<string>({ path: 'bio' })
  const { value: photo, setValue: setPhoto } = useField<string>({ path: 'photo' })
  const { value: cv, setValue: setCv } = useField<string>({ path: 'cv' })

  // Array
  const { value: subordinateAreas, setValue: setSubordinateAreas } = useField<SubordinateArea[]>({
    path: 'subordinateAreas',
  })

  const onValidSubmit = async (values: FormValues) => {
    setIsSaving(true)
    const payloadBody = {
      fullName: values.fullName,
      role: values.role,
      bio: values.bio,
      image: values.image,
      cv: values.cv,
      subordinateAreas: values.subordinateAreas,
    }

    console.log('Enviando:', payloadBody) // Debug

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadBody),
      })

      if (res.ok) {
        alert('¡Guardado correctamente!')
        form.reset(values)
      } else {
        const errorData = await res.json()
        console.error(errorData)
        alert('Error al guardar')
      }
    } catch (error) {
      console.error('Error guardando:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSubordinateAreas = (newRows: SubordinateArea[]) => {
    setSubordinateAreas(newRows)
  }
  const addArea = () => {
    const current = subordinateAreas || []
    updateSubordinateAreas([...current, { areaName: '', responsibleName: '' }])
  }
  const removeArea = (index: number) => {
    const current = subordinateAreas || []
    updateSubordinateAreas(current.filter((_, i) => i !== index))
  }
  const updateArea = (index: number, field: keyof SubordinateArea, val: string) => {
    const current = [...(subordinateAreas || [])]
    current[index] = { ...current[index], [field]: val }
    updateSubordinateAreas(current)
  }

  const isIntendente = (role || '').toLowerCase().trim() === 'intendente'

  const showIntendenteBanner = hasIntendente === false && !role

  return (
    <div className="p-4 mx-20">
      <div className="flex justify-between items-center mb-8 pb-2">
        <div>
          <h2 className="text-xl font-medium text-black">Organigrama</h2>
          <p className="text-black font-normal text-sm">Cargá y administrá el organigrama</p>
        </div>
        <button
          className="bg-white text-blue-500 px-6 py-2 rounded-xl border border-blue-500 font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
          onClick={form.handleSubmit(onValidSubmit)}
          type="button"
        >
          Guardar
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValidSubmit)} className="">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Perez" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-xs text-gray-400 mb-4 block">
              Escribí <span className="font-bold">Intendente</span> para asignarlo como cabeza del
              organigrama.
            </span>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className={itemStyles}>
                    <FormLabel className={labelStyles}>Puesto o Cargo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Secretario de Gobierno"
                        {...field}
                        className={inputStyles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Biografía / Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Breve descripción del funcionario"
                      {...field}
                      className={inputStyles}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="mt-4">
                <CustomUploadField
                  label="Foto"
                  value={photo}
                  onChange={setPhoto}
                  description="Tamaño recomendado: 400x400 px (mínimo 200x200 px). Formato .JPG o .PNG. Asegurate de que el rostro se vea claro y centrado."
                />
              </div>
              <div className="mt-2">
                <CustomUploadField
                  label="Curriculum"
                  value={cv}
                  onChange={setCv}
                  description="Tamaño recomendado: hasta 5 MB. Formato .PDF"
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default OrganigramaEditView
