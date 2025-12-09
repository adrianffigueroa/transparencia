'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'

// 1. Definimos el schema de Zod para los filtros
const formSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  filterBy: z.enum(['decretos', 'ordenanzas', 'resoluciones']).optional(),
})

type FilterValues = z.infer<typeof formSchema>

// 2. Definimos las props, incluida la función onSearch
interface AdvancedSearchProps {
  onSearch: (filters: FilterValues) => void
  className?: string
}

export function AdvancedSearch({ onSearch, className = '' }: AdvancedSearchProps) {
  // Estado para saber si el colapsable está abierto o cerrado
  const [isOpen, setIsOpen] = React.useState(false)

  // 3. Configuración de react-hook-form
  const form = useForm<FilterValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateFrom: '',
      dateTo: '',
    },
  })

  // 4. Función que se llama al enviar el formulario (click en "Aplicar Filtros")
  const onValidSubmit = (values: FilterValues) => {
    console.log('Filtros aplicados:', values)
    onSearch(values) // Envía los filtros al componente padre
  }

  // 5. Función para limpiar el formulario
  const handleClear = () => {
    form.reset() // Resetea react-hook-form
    onSearch({}) // Envía un objeto vacío al padre para resetear la búsqueda
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`w-full ${className} flex flex-col`}
    >
      <div className="w-full mt-2 space-y-4">
        {/* --- CABECERA DEL COLAPSABLE (Visible siempre) --- */}
        <div className="flex items-center justify-between ">
          <CollapsibleTrigger
            asChild
            className="border rounded-b-md rounded-tl-none rounded-tr-none"
          >
            <Button
              type="button"
              variant="outline"
              className={`flex items-center justify-start gap-2 text-gray-500 font-normal bg-transparent ${
                !isOpen ? 'w-full' : 'text-blue-500' // <-- LA SOLUCIÓN: w-full solo cuando está cerrado
              }`}
            >
              Búsqueda avanzada
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          {/* Botón de "Limpiar" que solo aparece si está abierto */}
          {isOpen && (
            <Button
              size="sm"
              onClick={handleClear}
              type="submit"
              variant="outline"
              className="w-full text-gray-500 border-none bg-transparent font-medium"
            >
              Limpiar
            </Button>
          )}
        </div>

        {/* --- CONTENIDO DEL COLAPSABLE (Formulario) --- */}
        <CollapsibleContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onValidSubmit)} className="space-y-6 pt-4">
              {/* --- Filtro de Fechas --- */}
              <span className="text-gray-500">Fecha</span>
              <div className="p-4 border border-gray-500 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-500">Desde</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-500">Hasta</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* --- Filtro por Radio --- */}

              <FormField
                control={form.control}
                name="filterBy"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-500">Filtrar por</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex justify-center space-y-1 text-gray-500"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="decretos" />
                          </FormControl>
                          <FormLabel className="font-normal text-black">Decretos</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="ordenanzas" />
                          </FormControl>
                          <FormLabel className="font-normal text-black">Ordenanzas</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="resoluciones" />
                          </FormControl>
                          <FormLabel className="font-normal text-black">Resoluciones</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Botón de Envío --- */}
              <Button
                type="submit"
                variant="outline"
                className="w-full text-blue-500 border-none bg-transparent font-medium"
              >
                Aplicar Filtros
              </Button>
            </form>
          </Form>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
