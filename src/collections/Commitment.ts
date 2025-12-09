// collections/staff.ts
import type { CollectionConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'

const Commitment: CollectionConfig = {
  slug: 'commitment',
  labels: {
    singular: { en: 'Commitment', es: 'Compromiso' },
    plural: { en: 'Commitments', es: 'Compromisos' },
  },
  auth: false,
  admin: {
    useAsTitle: 'title',
    description: 'Compromisos del municipio',
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
    update: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
    delete: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'heroText',
      label: 'Texto destacado',
      type: 'richText',
      required: false,
    },
    {
      name: 'summary',
      label: 'Resumen',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      label: 'Imagen destacada',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: false,
      options: [
        { value: 'not-started', label: 'No iniciado' },
        { value: 'in-progress', label: 'En progreso' },
        { value: 'completed', label: 'Completado' },
      ],
    },
    {
      name: 'percentageCompleted',
      label: 'Porcentaje Completado',
      type: 'number',
      required: false,
    },
  ],
  hooks: {
    beforeValidate: [
      async (req: any) => {
        if (req.data.summary || req.data.pageText) {
          req.data.summary = sanitizeHtml(req.data.summary, { allowedTags: [] })
          req.data.pageText = sanitizeHtml(req.data.pageText, { allowedTags: [] })
        }
      },
    ],
  },
}

export default Commitment
