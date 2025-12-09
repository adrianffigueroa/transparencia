import type { CollectionConfig } from 'payload'

const Participation: CollectionConfig = {
  slug: 'participation',
  labels: {
    singular: 'Participación Ciudadana',
    plural: 'Participación Ciudadana',
  },
  admin: {
    group: 'Módulos',
    description: 'Gestión completa de Participación Ciudadana',
    components: {
      views: {
        list: {
          Component: '@/app/components/admin/views/collections/ParticipationListView', // Vista custom con tabs
        },
      },
    },
  },
  access: {
    read: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
    create: () => true, // Ciudadanos pueden crear propuestas
    update: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
    delete: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && user.role === 'admin')
    },
  },
  fields: [
    // --- CAMPOS DE CONFIGURACIÓN (solo editables por admin) ---
    {
      name: 'isConfig',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true, // No visible en UI, solo interno
      },
    },
    {
      name: 'heroText',
      label: 'Texto Hero',
      type: 'textarea',
      admin: {
        condition: (data) => data?.isConfig === true,
        description: 'Solo editable en el documento de configuración',
      },
    },
    {
      name: 'instructions',
      label: 'Instrucciones',
      type: 'richText',
      admin: {
        condition: (data) => data?.isConfig === true,
      },
    },
    {
      name: 'enableSubmissions',
      label: 'Habilitar envíos',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (data) => data?.isConfig === true,
      },
    },

    // --- CAMPOS DE PROPUESTAS (ciudadanos) ---
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data?.isConfig !== true,
      },
    },
    {
      name: 'fullName',
      label: 'Nombre y Apellido',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data?.isConfig !== true,
      },
    },
    // ...resto de campos de propuestas con la misma condition
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      admin: {
        condition: (data) => data?.isConfig !== true,
      },
    },
    {
      name: 'projectArea',
      label: 'Área',
      type: 'select',
      options: [
        { label: 'Educación', value: 'educacion' },
        { label: 'Salud', value: 'salud' },
        // ...resto
      ],
      admin: {
        condition: (data) => data?.isConfig !== true,
      },
    },
    {
      name: 'summary',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      admin: {
        condition: (data) => data?.isConfig !== true,
      },
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      defaultValue: 'pendiente',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'En Revisión', value: 'en-revision' },
        { label: 'Aprobado', value: 'aprobado' },
        { label: 'Rechazado', value: 'rechazado' },
      ],
      admin: {
        condition: (data) => data?.isConfig !== true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Al crear, si no viene isConfig, asumimos que es una propuesta de ciudadano
        if (operation === 'create' && data && data.isConfig === undefined) {
          data.isConfig = false
        }
        return data
      },
    ],
  },
}

export default Participation
