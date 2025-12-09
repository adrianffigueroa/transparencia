import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useField } from '@payloadcms/ui'
import { Input } from '@/app/components/ui/input'
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
import { is } from 'date-fns/locale'

const itemStyles =
  'bg-white rounded-lg p-3 pt-2 space-y-1 border-[0.2px] shadow-md border-[#B2B2B2]'
const labelStyles = 'text-gray-500 text-xs font-medium'
const inputStyles = `w-full border-none bg-white shadow-none p-0 h-auto text-base text-gray-500 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`

const formSchema = z.object({
  number: z.string().min(1, 'El número es obligatorio'),
  publishedDate: z.string().min(1, 'La fecha de publicación es obligatoria'),
  file: z.string().optional(),
  isPublished: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const OfficialBulletinEditView = () => {
  const [isSaving, setIsSaving] = React.useState(false)
  const { value: payloadFile, setValue: setPayloadFile } = useField<string>({ path: 'file' })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: '',
      publishedDate: '',
      file: '',
    },
  })

  const onValidSubmit = async (values: FormValues) => {
    console.log('🔍 Valores al intentar submit:', values)
    console.log('🔍 Valor de payloadFile:', payloadFile)
    console.log('🔍 Todos los valores del form:', form.getValues())
    if (!values.file) {
      console.log('❌ El archivo está vacío, mostrando error')
      form.setError('file', { type: 'manual', message: 'El archivo es obligatorio' })
      return
    }
    console.log('✅ Validación pasó. Enviando:', values)
    setIsSaving(true)

    try {
      // ✅ Crear el payload con file convertido a número
      const payload = {
        number: values.number,
        publishedDate: values.publishedDate,
        file: parseInt(values.file, 10), // ✅ Convertir string a número
      }

      console.log('📤 Payload a enviar:', payload)
      const res = await fetch('/api/official_bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('¡Guardado correctamente!')
        form.reset(values)
      } else {
        const errorData = await res.json()

        // ✅ Manejar error de duplicado desde el servidor
        if (
          errorData.errors?.some(
            (e: any) => e.message?.includes('duplicate') || e.message?.includes('unique'),
          )
        ) {
          form.setError('number', {
            type: 'manual',
            message: `Ya existe un boletín con el número ${values.number}`,
          })
        } else {
          alert(`Error: ${errorData.errors?.[0]?.message || 'Error desconocido'}`)
        }
      }
    } catch (error) {
      console.error('❌ Error de red:', error)
      alert('Error al conectar con el servidor')
    } finally {
      setIsSaving(false)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/official_bulletin?limit=1')
        const json = await res.json()
        const doc = json.docs?.[0]

        if (doc) {
          const initialData = {
            number: doc.number || '',
            publishedDate: doc.publishedDate || '',
            file: doc.file || '',
          }
          console.log('📥 Datos cargados desde API:', initialData)
          form.reset(initialData)
          setPayloadFile(doc.file || null)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [form, setPayloadFile])

  // Sincronizar file de react-hook-form con Payload
  const fileValue = form.watch('file')

  return (
    <div className="p-4 mx-20">
      <div className="flex justify-between items-center mb-8 pb-2">
        <div>
          <h2 className="text-xl font-medium text-black">Boletín Oficial</h2>
          <p className="text-black font-normal text-sm">Cargá y administrá el boletín oficial</p>
        </div>
        <button
          className="bg-white text-blue-500 px-6 py-2 rounded-xl border border-blue-500 font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
          onClick={() => {
            console.log('🖱️ Click en Guardar')
            console.log('📋 Estado actual del form:', form.getValues())
            console.log('❌ Errores actuales:', form.formState.errors)
            form.handleSubmit(onValidSubmit)()
          }}
          type="button"
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValidSubmit)}>
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Número de publicación de boletín</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publishedDate"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Fecha de publicación</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ CLAVE: actualizar AMBOS estados */}
            <div className="mt-4">
              <CustomUploadField
                label="Documento"
                value={fileValue}
                onChange={(id) => {
                  console.log('🔔 onChange recibido en padre con ID:', id)
                  // ✅ Actualizar Payload
                  // ✅ Convertir a string (por si viene como number)
                  const validId = id ? String(id) : ''

                  // ✅ Actualizar react-hook-form
                  form.setValue('file', validId, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })

                  console.log('✅ Valor actualizado:', form.getValues('file'))
                  // ✅ Limpiar error si hay archivo
                  if (validId) {
                    form.clearErrors('file')
                  }
                }}
                description="Formato: .PDF (hasta 10 MB). Asegurate de que el boletín esté completo y en buena calidad."
              />
              {/* Mostrar error de validación manualmente */}
              {form.formState.errors.file && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.file.message}</p>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default OfficialBulletinEditView
