'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useField, useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { CustomUploadField } from '@/app/components/admin/shared/CustomUploadField'
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

const itemStyles =
  'bg-white rounded-lg p-3 pt-2 space-y-1 border-[0.2px] shadow-md border-[#B2B2B2]'
const labelStyles = 'text-gray-500 text-xs font-medium'
const inputStyles = `w-full border-none bg-white shadow-none p-0 h-auto text-base text-gray-500 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`
const textareaStyles = `w-full border-none bg-white shadow-none p-0 text-base text-gray-500 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none`

const formSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  heroText: z.string().optional(),
  year: z.number().min(1900, 'Año inválido').max(2100, 'Año inválido'),
  files: z.string().optional(),
  isPublished: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const BudgetEditView = () => {
  const [isSaving, setIsSaving] = React.useState(false)
  const { value: payloadFiles, setValue: setPayloadFiles } = useField<string>({ path: 'files' })
  const { id } = useDocumentInfo()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      heroText: '',
      year: new Date().getFullYear(),
      files: '',
      isPublished: false,
    },
  })

  const onValidSubmit = async (values: FormValues) => {
    if (!values.files) {
      form.setError('files', { type: 'manual', message: 'El archivo es obligatorio' })
      return
    }

    console.log('✅ Validación pasó. Enviando:', values)
    setIsSaving(true)

    try {
      const payload = {
        title: values.title,
        description: values.description,
        heroText: values.heroText || '',
        year: values.year,
        files: parseInt(values.files, 10),
        isPublished: values.isPublished,
      }

      const url = id ? `/api/budget/${id}` : '/api/budget'
      const method = id ? 'PATCH' : 'POST'

      console.log(`📤 ${method} a ${url}`, payload)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        alert(
          id ? '¡Presupuesto actualizado correctamente!' : '¡Presupuesto guardado correctamente!',
        )

        if (method === 'POST') {
          router.push(`/admin/collections/budget/${data.doc.id}`)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          console.log('🔍 Cargando presupuesto con ID:', id)
          const res = await fetch(`/api/budget/${id}`)
          const data = await res.json()
          console.log('📦 Respuesta completa del servidor:', data)

          const doc = data.doc || data
          console.log('📄 Documento extraído:', doc)

          if (doc) {
            let filesId = ''
            if (doc.files) {
              if (typeof doc.files === 'object' && doc.files.id) {
                filesId = String(doc.files.id)
              } else {
                filesId = String(doc.files)
              }
            }

            const initialData = {
              title: doc.title || '',
              description: doc.description || '',
              heroText: doc.heroText || '',
              year: doc.year || new Date().getFullYear(),
              files: filesId,
              isPublished: doc.isPublished || false,
            }

            console.log('✅ Datos formateados para el form:', initialData)
            form.reset(initialData)
            setPayloadFiles(filesId || null)
          }
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error)
      }
    }
    fetchData()
  }, [id, form, setPayloadFiles])

  const filesValue = form.watch('files')

  return (
    <div className="p-4 mx-20">
      <div className="flex justify-between items-center mb-8 pb-2">
        <div>
          <h2 className="text-xl font-medium text-black">
            {id ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
          </h2>
          <p className="text-black font-normal text-sm">
            {id ? 'Modificá los datos del presupuesto' : 'Cargá un nuevo presupuesto municipal'}
          </p>
        </div>

        <div className="flex gap-2">
          {id && (
            <button
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl border border-gray-300 font-medium hover:bg-gray-300 transition-colors"
              onClick={() => router.push('/admin/collections/budget')}
              type="button"
            >
              Volver al listado
            </button>
          )}

          <button
            className="bg-white text-blue-500 px-6 py-2 rounded-xl border border-blue-500 font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
            onClick={() => form.handleSubmit(onValidSubmit)()}
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Presupuesto 2025" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del presupuesto"
                      {...field}
                      className={textareaStyles}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroText"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Texto destacado (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Texto para destacar" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Año</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2025"
                      {...field}
                      className={inputStyles}
                      min={1900}
                      max={2100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <CustomUploadField
                label="Archivos del presupuesto"
                value={filesValue}
                onChange={(id) => {
                  const validId = id ? String(id) : ''
                  form.setValue('files', validId, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                  if (validId) {
                    form.clearErrors('files')
                  }
                }}
                description="Formato: PDF, Excel, etc. (hasta 10 MB)."
              />
              {form.formState.errors.files && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.files.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className={`${itemStyles} w-1/6 flex flex-row items-center space-x-3`}>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </FormControl>
                  <label className="text-gray-600 font-medium text-sm">Publicado</label>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default BudgetEditView
