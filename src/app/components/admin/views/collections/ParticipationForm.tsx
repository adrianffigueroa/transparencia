'use client'
import React, { useState, useMemo } from 'react'
import { Button } from '../../../ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '../../../ui/input'
import { Textarea } from '../../../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// --- ESTILOS REUTILIZABLES ---
const itemStyles = 'bg-slate-100/70 rounded-lg p-3 pt-2 space-y-1'
const labelStyles = 'text-gray-500 text-xs font-medium'
const inputStyles = `w-full border-none bg-transparent shadow-none p-0 h-auto text-base text-gray-500
                     placeholder:text-gray-400 
                     focus-visible:ring-0 focus-visible:ring-offset-0`

// --- PROPS DEL COMPONENTE ---
// La variante ahora define el propósito y el endpoint
type ParticipationFormProps = {
  variant: 'participation' | 'convocatoria'
}

// 1. DEFINIMOS EL SCHEMA BASE CON TODO OPCIONAL
const baseFormSchema = z.object({
  // Campos del formulario 'convocatoria' (reducido)
  fullName: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(50, { message: 'El nombre debe tener menos de 50 caracteres' }),
  personalId: z.string().nonempty({ message: 'Por favor, selecciona un tipo de documento.' }),
  idNumber: z
    .string()
    .min(6, { message: 'El número de identificación debe tener al menos 6 caracteres' })
    .max(10, { message: 'El número de identificación debe tener menos de 10 caracteres' }),
  address: z
    .string()
    .min(5, { message: 'La dirección debe tener al menos 5 caracteres' })
    .max(100, { message: 'La dirección debe tener menos de 100 caracteres' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  phone: z
    .string()
    .min(8, { message: 'El teléfono debe tener al menos 8 caracteres' })
    .max(15, { message: 'El teléfono debe tener menos de 15 caracteres' }),

  // Campos del formulario 'participation' (completo)
  title: z.string().optional(),
  projectArea: z.string().optional(),
  summary: z.string().optional(),
  justification: z.string().optional(),
})

// 2. CREAMOS UN TIPO BASADO EN EL SCHEMA
type FormValues = z.infer<typeof baseFormSchema>

export function ParticipationForm({ variant }: ParticipationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 3. HACEMOS EL SCHEMA FINAL DINÁMICO
  const formSchema = useMemo(() => {
    if (variant === 'participation') {
      // Si la variante es 'participation', hacemos los campos del proyecto obligatorios
      return baseFormSchema
        .refine((data) => !!data.title && data.title.length >= 2, {
          message: 'El título debe tener al menos 2 caracteres',
          path: ['title'],
        })
        .refine((data) => !!data.projectArea, {
          message: 'Por favor, selecciona un área.',
          path: ['projectArea'],
        })
        .refine((data) => !!data.summary && data.summary.length >= 10, {
          message: 'El resumen debe tener al menos 10 caracteres',
          path: ['summary'],
        })
        .refine((data) => !!data.justification && data.justification.length >= 10, {
          message: 'La justificación debe tener al menos 10 caracteres',
          path: ['justification'],
        })
    }
    // Si la variante es 'convocatoria', el schema base (solo campos de persona) es suficiente
    return baseFormSchema
  }, [variant])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      fullName: '',
      personalId: '',
      idNumber: '',
      address: '',
      email: '',
      phone: '',
      projectArea: '',
      summary: '',
      justification: '',
    },
  })

  // Función para formatear a RichText
  const formatAsRichText = (text: string) => {
    return [{ children: [{ text: text || '' }] }]
  }

  // 4. LÓGICA DE ENVÍO CON ENDPOINT Y PAYLOAD DINÁMICOS
  const onValidSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    let payloadBody
    let endpointSlug

    if (variant === 'participation') {
      // --- Lógica para el formulario COMPLETO ---
      endpointSlug = 'participation'
      payloadBody = {
        ...values,
        summary: formatAsRichText(values.summary || ''),
        justification: formatAsRichText(values.justification || ''),
        idNumber: Number(values.idNumber),
      }
    } else {
      // --- Lógica para el formulario REDUCIDO ---
      endpointSlug = 'convocatoria' // <-- NUEVO ENDPOINT
      // El payload ya no incluye campos de relleno, SÓLO los validados
      payloadBody = {
        fullName: values.fullName,
        personalId: values.personalId,
        idNumber: Number(values.idNumber),
        address: values.address,
        email: values.email,
        phone: values.phone,
      }
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_PAYLOAD_URL || ''}/api/${endpointSlug}`

      if (!apiUrl.startsWith('http')) {
        throw new Error('La URL de la API no está configurada. Revisa tus variables de entorno.')
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadBody),
      })

      if (!response.ok) {
        const resData = await response.json()
        throw new Error(resData.errors?.[0]?.message || 'Ocurrió un error al enviar los datos.')
      }

      setSuccess(true)
      form.reset()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function onInvalid(errors: any) {
    console.error('Validación Fallida:', errors)
  }

  // 5. RENDERIZADO CONDICIONAL DEL JSX (basado en 'participation')
  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onValidSubmit, onInvalid)} className="space-y-4">
          {/* --- CAMPOS DEL FORMULARIO COMPLETO ('participation') --- */}
          {variant === 'participation' && (
            <>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className={itemStyles}>
                    <FormLabel className={labelStyles}>Título del Proyecto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mi propuesta de proyecto"
                        {...field}
                        className={inputStyles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* --- CAMPOS COMUNES (Se muestran siempre) --- */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className={itemStyles}>
                <FormLabel className={labelStyles}>Nombre y Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} className={inputStyles} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="personalId"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Tipo de Documento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputStyles}>
                        <SelectValue placeholder="DNI" className="text-gray-500" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white text-gray-500">
                      <SelectItem value="dni">DNI</SelectItem>
                      <SelectItem value="cedula">Cédula</SelectItem>
                      <SelectItem value="libreta-civica">Libreta Cívica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Número</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12345678"
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
            name="address"
            render={({ field }) => (
              <FormItem className={itemStyles}>
                <FormLabel className={labelStyles}>Domicilio</FormLabel>
                <FormControl>
                  <Input placeholder="Calle Falsa 123" {...field} className={inputStyles} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan.perez@example.com"
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
              name="phone"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Teléfono</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="123456789" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* --- MÁS CAMPOS DEL FORMULARIO COMPLETO ('participation') --- */}
          {variant === 'participation' && (
            <>
              <FormField
                control={form.control}
                name="projectArea"
                render={({ field }) => (
                  <FormItem className={itemStyles}>
                    <FormLabel className={labelStyles}>Área del Proyecto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputStyles}>
                          <SelectValue placeholder="Educación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-gray-500">
                        <SelectItem value="educacion">Educación</SelectItem>
                        <SelectItem value="seguridad">Seguridad</SelectItem>
                        <SelectItem value="salud">Salud</SelectItem>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="medio-ambiente">Medio Ambiente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem className={itemStyles}>
                    <FormLabel className={labelStyles}>Resumen del Proyecto</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contanos tu idea..."
                        {...field}
                        className={`${inputStyles} min-h-20`}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem className={itemStyles}>
                    <FormLabel className={labelStyles}>Justificación del Proyecto</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contanos por qué es importante..."
                        {...field}
                        className={`${inputStyles} min-h-[120px]`}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* --- MENSAJES Y BOTÓN --- */}
          <div>
            {success && (
              <div className="mb-4 text-center text-green-700 bg-green-100 p-3 rounded-md">
                ¡{variant === 'participation' ? 'Propuesta enviada' : 'Inscripción registrada'} con
                éxito!
              </div>
            )}
            {error && (
              <div className="mb-4 text-center text-red-700 bg-red-100 p-3 rounded-md">{error}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full border-0 bg-transparent text-blue-500 font-bold"
            >
              {loading ? 'Enviando...' : variant === 'participation' ? 'Enviar' : 'Inscribirme'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
