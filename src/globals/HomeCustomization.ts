// src/globals/HomeCustomization.ts
import type { GlobalConfig } from 'payload'

const HomeCustomization: GlobalConfig = {
  slug: 'home-customization',
  label: 'Home',

  admin: {
    hideAPIURL: true,
    components: {
      views: {
        edit: {
          default: {
            // Apuntamos a tu vista completa
            Component: '@/app/components/admin/views/globals/HomeCustomView',
          },
        },
      },
    },
  },

  access: {
    read: () => true,
    update: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
  },

  fields: [
    // --- Textos ---
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'slogan',
      type: 'text', // Coincide con tu <Input />
    },
    {
      name: 'description',
      type: 'textarea', // Coincide con tu <Textarea />
    },

    // --- Secciones (Array de strings) ---
    {
      name: 'enabledSections',
      type: 'select',
      hasMany: true, // Esto permite guardar ['organigrama', 'boletin']
      options: [
        { label: 'Organigrama', value: 'organigrama_person' },
        { label: 'Boletín Oficial', value: 'official_bulletin' },
        { label: 'Compromisos', value: 'commitment' },
        { label: 'Presupuesto', value: 'budget' },
        { label: 'Licitaciones', value: 'tenders' },
        { label: 'Obras y Servicios', value: 'public-works' },
        { label: 'Participación Ciudadana', value: 'participation' },
      ],
    },

    // --- Contacto ---
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'contactEmail',
      type: 'text',
    },

    // --- Redes Sociales ---
    // CAMBIO IMPORTANTE: Ahora es un grupo para coincidir con tu Zod Schema
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
      required: false,
    },
  ],
}

export default HomeCustomization
