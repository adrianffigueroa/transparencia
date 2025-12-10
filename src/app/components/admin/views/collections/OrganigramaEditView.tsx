'use client'

import React, { useEffect, useState } from 'react'
import { useField, useDocumentInfo } from '@payloadcms/ui'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { CustomUploadField } from '@/app/components/admin/shared/CustomUploadField'
import { Checkbox } from '@/app/components/ui/checkbox'
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
import Image from 'next/image'
import deleteIcon from '@/public/assets/deleteIcon.png'
import personIcon from '@/public/assets/personIcon.png'
import backIcon from '@/public/assets/backIcon.png'
import { FaPlus } from 'react-icons/fa'

type SubordinateArea = {
  id?: string
  areaName: string
  responsibleName: string
}

const itemStyles =
  'bg-white mb-4 rounded-lg p-3 pt-2 space-y-1 border-[0.2px] shadow-md border-[#B2B2B2]'
const labelStyles = 'text-gray-500 text-xs font-medium'
const inputStyles = `w-full border-none bg-white shadow-none p-0 h-auto text-base text-gray-500 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio'),
  role: z.string().min(1, 'El puesto o cargo es obligatorio'),
  bio: z.string().optional(),
  photo: z.string().optional(),
  cv: z.string().optional(),
  isPublished: z.boolean(),
  subordinateAreas: z
    .array(
      z.object({
        areaName: z.string().min(1, 'El nombre del área es obligatorio'),
        responsibleName: z.string().min(1, 'El nombre del responsable es obligatorio'),
      }),
    )
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

const OrganigramaEditView = () => {
  const { id } = useDocumentInfo()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      role: '',
      bio: '',
      photo: '',
      cv: '',
      isPublished: false,
      subordinateAreas: [],
    },
  })

  const { value: photo, setValue: setPhoto } = useField<string>({ path: 'photo' })
  const { value: cv, setValue: setCv } = useField<string>({ path: 'cv' })

  const currentRole = form.watch('role')
  const isIntendente = currentRole.toLowerCase().includes('intendente')

  // ✅ Cargar datos si estamos editando
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        if (id) {
          const res = await fetch(`/api/organigrama_person/${id}`)
          const data = await res.json()
          const doc = data.doc || data
          if (doc) {
            let photoId = ''
            if (doc.photo) {
              photoId = typeof doc.photo === 'object' ? String(doc.photo.id) : String(doc.photo)
            }

            let cvId = ''
            if (doc.cv) {
              cvId = typeof doc.cv === 'object' ? String(doc.cv.id) : String(doc.cv)
            }

            const initialData = {
              fullName: doc.fullName || '',
              role: doc.role || '',
              bio: doc.bio || '',
              photo: photoId,
              cv: cvId,
              isPublished: doc.isPublished || false,
              subordinateAreas: doc.subordinateAreas || [],
            }

            form.reset(initialData)
            setPhoto(photoId || null)
            setCv(cvId || null)
          }
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, form, setPhoto, setCv])

  const onValidSubmit = async (values: FormValues) => {
    setIsSaving(true)

    try {
      const payload = {
        fullName: values.fullName,
        role: values.role,
        bio: values.bio || '',
        photo: values.photo ? parseInt(values.photo, 10) : null,
        cv: values.cv ? parseInt(values.cv, 10) : null,
        isPublished: values.isPublished,
        subordinateAreas: values.subordinateAreas || [],
      }

      const url = id ? `/api/organigrama_person/${id}` : '/api/organigrama_person'
      const method = id ? 'PATCH' : 'POST'

      console.log(`📤 ${method} a ${url}`, payload)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        alert(id ? '¡Actualizado correctamente!' : '¡Guardado correctamente!')

        if (method === 'POST') {
          router.push(`/admin/collections/organigrama_person/${data.doc.id}`)
        } else {
          router.refresh()
        }
      } else {
        const errorData = await res.json()
        console.error('❌ Error del servidor:', errorData)
        alert(`Error: ${errorData.errors?.[0]?.message || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('❌ Error de red:', error)
      alert('Error al conectar con el servidor')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSubordinateAreas = (newRows: SubordinateArea[]) => {
    form.setValue('subordinateAreas', newRows, { shouldValidate: true })
  }

  const addArea = () => {
    const current = form.watch('subordinateAreas') || []
    updateSubordinateAreas([...current, { areaName: '', responsibleName: '' }])
  }

  const removeArea = (index: number) => {
    const current = form.watch('subordinateAreas') || []
    updateSubordinateAreas(current.filter((_, i) => i !== index))
  }

  const updateArea = (index: number, field: keyof SubordinateArea, val: string) => {
    const current = [...(form.watch('subordinateAreas') || [])]
    current[index] = { ...current[index], [field]: val }
    updateSubordinateAreas(current)
  }

  if (isLoading) {
    return (
      <div className="p-10 bg-white rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  const currentAreas = form.watch('subordinateAreas') || []

  return (
    <div className="p-4 mx-20">
      <div className="flex justify-between items-center mb-8 pb-2">
        <div>
          <h2 className="text-xl font-medium text-black">
            {id ? 'Editar Miembro' : 'Nuevo Miembro'}
          </h2>
          <p className="text-black font-normal text-sm">
            {id ? 'Modificá los datos del miembro' : 'Cargá un nuevo miembro al organigrama'}
          </p>
        </div>

        <div className="flex gap-2">
          {/* {id && (
            <button
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl border border-gray-300 font-medium hover:bg-gray-300 transition-colors"
              onClick={() => router.push('/admin/collections/organigrama_person')}
              type="button"
            >
              Volver al listado
            </button>
          )} */}

          <button
            className="bg-white text-blue-500 px-6 py-2 rounded-xl border border-blue-500 font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
            onClick={form.handleSubmit(onValidSubmit)}
            type="button"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : id ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValidSubmit)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => router.push('/admin/collections/organigrama_person')}
                  className="bg-transparent border-0 flex items-center hover:cursor-pointer"
                  type="button"
                >
                  <Image src={backIcon} alt="Volver" width={24} height={24} />
                  <span className="font-semibold text-sm text-gray-500">Volver al listado</span>
                </button>
              </div>
              <div className="flex justify-end mb-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className={`flex flex-row`}>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white"
                        />
                      </FormControl>
                      <FormLabel className="text-gray-600 font-medium text-sm mb-0">
                        Publicado
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <CustomUploadField
                label="Foto"
                value={form.watch('photo')}
                onChange={(id) => {
                  const validId = id ? String(id) : ''
                  form.setValue('photo', validId)
                  setPhoto(validId)
                }}
                description="Tamaño recomendado: 400x400 px (mínimo 200x200 px). Formato .JPG o .PNG."
              />
            </div>

            <div className="mt-4">
              <CustomUploadField
                label="Curriculum"
                value={form.watch('cv')}
                onChange={(id) => {
                  const validId = id ? String(id) : ''
                  form.setValue('cv', validId)
                  setCv(validId)
                }}
                description="Tamaño recomendado: hasta 5 MB. Formato .PDF"
              />
            </div>

            {/* ✅ Sección de Áreas Subordinadas */}
            {!isIntendente && currentAreas.length > 0 && (
              <div className="mt-6 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Áreas Subordinadas</h3>
                    <p className="text-sm text-gray-500">
                      Áreas que reportan directamente a esta persona
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addArea}
                    className="flex items-center gap-2 font-semibold bg-white text-blue-500 border-0  px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white hover:cursor-pointer transition-colors"
                  >
                    <FaPlus />
                    Añadir Área
                  </button>
                </div>

                {currentAreas.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    No hay áreas subordinadas. Click en Agregar Área para comenzar.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {currentAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-3 p-4">
                        <div>
                          <Image src={personIcon} alt="Person Icon" className="w-10 h-10" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <FormField
                            control={form.control}
                            name={`subordinateAreas.${index}.areaName`}
                            render={({ field }) => (
                              <FormItem className={`${itemStyles} `}>
                                <FormLabel className={labelStyles}>Nombre del Área</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ej: Dirección de Cultura"
                                    {...field}
                                    className={inputStyles}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`subordinateAreas.${index}.responsibleName`}
                            render={({ field }) => (
                              <FormItem className={`${itemStyles} `}>
                                <FormLabel className={labelStyles}>
                                  Nombre del Responsable
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ej: Juan Gomez"
                                    {...field}
                                    className={inputStyles}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeArea(index)}
                            className="p-2 bg-white border-0 hover:cursor-pointer rounded transition-colors"
                            title="Eliminar área"
                          >
                            <Image src={deleteIcon} alt="Eliminar área" className="w-8 h-8" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default OrganigramaEditView
