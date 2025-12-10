// src/app/components/HomeCustomView.tsx
'use client'

import React, { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '../../../ui/input'
import { Textarea } from '../../../ui/textarea'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '../../../ui/checkbox'
import Image from 'next/image'
// Asegurate de que estas rutas de imagen sean correctas
import faceIcon from '@/public/assets/faceIcon.png'
import youtubeIcon from '@/public/assets/youtubeIcon.png'
import instaIcon from '@/public/assets/instaIcon.png'
import twitterIcon from '@/public/assets/xIcon.png'

// Estilos
const itemStyles =
  'bg-white rounded-lg p-3 pt-2 space-y-1 border-[0.2px] shadow-md border-[#B2B2B2] mb-4'
const labelStyles = 'text-gray-500 text-xs font-medium'
const inputStyles = `w-full border-none bg-white shadow-none p-0 h-auto text-base text-gray-500 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0`

// Schema (Tu validación con Zod)
const formSchema = z.object({
  siteName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }).max(50),
  slogan: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  address: z.string().optional(),
  contactEmail: z.string().email({ message: 'Debe ser un email válido' }),
  phone: z.string().min(8).max(15),
  enabledSections: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Debes seleccionar al menos una sección.',
  }),
  socialLinks: z
    .object({
      facebook: z.string().nullish(),
      twitter: z.string().nullish(),
      instagram: z.string().nullish(),
      youtube: z.string().nullish(),
    })
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

// Arrays de configuración
const sections = [
  { label: 'Organigrama', value: 'organigrama_person' },
  { label: 'Boletín Oficial', value: 'official_bulletin' },
  { label: 'Compromisos', value: 'commitment' },
  { label: 'Presupuesto', value: 'budget' },
  { label: 'Licitaciones', value: 'tenders' },
  { label: 'Obras y Servicios', value: 'public-works' },
  { label: 'Participación Ciudadana', value: 'participation' },
] as const

const socialLinksMap = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Youtube', value: 'youtube' },
] as const

const socialLinksIcons: any = {
  facebook: faceIcon,
  youtube: youtubeIcon,
  instagram: instaIcon,
  twitter: twitterIcon,
}

const HomeCustomView = () => {
  // 1. Eliminamos el estado 'data' y 'setData' porque no se usan.
  //    React Hook Form maneja los datos ahora.
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false) // Usamos este para el estado del botón

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: '',
      slogan: '',
      description: '',
      address: '',
      contactEmail: '',
      phone: '',
      enabledSections: [],
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
      },
    },
  })

  // 2. Cargar datos (GET)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/globals/home-customization')
        const json = await res.json()

        // Actualizamos SOLO el formulario
        form.reset({
          siteName: json.siteName || '',
          slogan: json.slogan || '',
          description: json.description || '',
          address: json.address || '',
          contactEmail: json.contactEmail || '',
          phone: json.phone || '',
          enabledSections: json.enabledSections || [],
          socialLinks: json.socialLinks || {},
        })
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [form]) // 'form' como dependencia es correcto para reset()

  // 3. Función de envío (Conecta el formulario con la API)
  const onValidSubmit = async (values: FormValues) => {
    setIsSaving(true) // Activamos loading del botón

    const payloadBody = {
      siteName: values.siteName,
      slogan: values.slogan,
      description: values.description,
      address: values.address,
      contactEmail: values.contactEmail,
      phone: values.phone,
      enabledSections: values.enabledSections,
      socialLinks: values.socialLinks,
    }

    console.log('Enviando:', payloadBody) // Debug

    try {
      const res = await fetch('/api/globals/home-customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadBody),
      })

      if (res.ok) {
        alert('¡Guardado correctamente!')
        // Opcional: Volver a hacer un reset con los datos guardados para limpiar estado "dirty"
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

  // Función para manejar errores de validación (Debug)
  function onInvalid(errors: any) {
    console.error('Validación Fallida:', errors)
    alert('Por favor revisa los campos obligatorios.')
  }

  if (isLoading) return <div className="p-8">Cargando tu panel personalizado...</div>

  return (
    <div className="mx-20">
      <div className="flex justify-between items-center mb-8 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Home</h2>
          <p className="text-gray-500 font-normal text-lg">
            Editá el contenido principal que se muestra en la página de inicio.
          </p>
        </div>

        {/* 4. CAMBIO CLAVE: El botón ahora dispara el submit del formulario */}
        <button
          onClick={form.handleSubmit(onValidSubmit, onInvalid)} // <--- ¡ESTO CONECTA EL BOTÓN!
          disabled={isSaving}
          className="bg-white text-blue-500 px-6 py-2 rounded-xl border border-blue-500 font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div className="bg-white flex flex-col w-full p-8 rounded-lg">
        <Form {...form}>
          {/* El onSubmit aquí es redundante si usamos el onClick del botón de arriba, 
              pero es buena práctica dejarlo por si alguien presiona Enter */}
          <form onSubmit={form.handleSubmit(onValidSubmit, onInvalid)}>
            {/* --- CAMPOS DE TEXTO --- */}
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Nombre del Sitio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Municipalidad de Ejemplo"
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
              name="slogan"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Slogan</FormLabel>
                  <FormControl>
                    <Input placeholder="Slogan..." {...field} className={inputStyles} />
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
                    <Textarea placeholder="Descripción..." {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- SECCIONES HABILITADAS --- */}
            <p className="text-black font-medium text-lg mt-6">Secciones habilitadas</p>
            <p className="text-sm text-gray-500 mb-4">
              Activá o desactivá las secciones que se muestran en el portal.
            </p>

            <FormField
              control={form.control}
              name="enabledSections"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sections.map((item) => (
                      <FormField
                        key={item.value}
                        control={form.control}
                        name="enabledSections"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-gray-200 p-4 bg-white"
                            >
                              <FormControl>
                                <Checkbox
                                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.value])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== item.value),
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-medium text-gray-700 cursor-pointer w-full">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- INFORMACIÓN DE CONTACTO --- */}
            <p className="text-black font-medium text-lg mt-8">Información de contacto</p>
            <p className="text-sm text-gray-500 mb-4">Edita la información de contacto.</p>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="0810..." {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle 123..." {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem className={itemStyles}>
                  <FormLabel className={labelStyles}>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} className={inputStyles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- REDES SOCIALES --- */}
            <p className="text-black font-medium text-lg mt-8 mb-4">Redes Sociales</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinksMap.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  // Conectamos al objeto socialLinks.{red}
                  name={`socialLinks.${item.value}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0 rounded-md border border-gray-200 p-3 bg-white">
                      <div className="shrink-0">
                        <Image
                          src={socialLinksIcons[item.value]}
                          alt={item.label}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="grow">
                        <FormControl>
                          <Input
                            placeholder={`URL de ${item.label}`}
                            {...field}
                            value={field.value || ''}
                            className={inputStyles}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default HomeCustomView
