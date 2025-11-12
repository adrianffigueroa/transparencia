import type { CollectionConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'

const Budget: CollectionConfig = {
  slug: 'budget',
  labels: {
    singular: { en: 'Budget', es: 'Presupuesto' },
    plural: { en: 'Budgets', es: 'Presupuestos' },
  },
  auth: false,
  admin: {
    useAsTitle: 'title',
    description: 'Presupuesto del municipio',
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
      name: 'pageText',
      label: 'Texto de la página',
      type: 'richText',
      required: false,
    },
    {
      name: 'publishedDate',
      label: 'Fecha de Publicación',
      type: 'date',
      required: true,
    },
    {
      name: 'files',
      label: 'Archivos',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'file',
          label: 'Archivo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'summary',
          label: 'Resumen',
          type: 'richText',
          required: false,
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data?.files && Array.isArray(data.files)) {
          data.files = data.files.map((f) => ({
            ...f,
            summary: f.summary ? sanitizeHtml(f.summary, { allowedTags: [] }) : undefined,
          }))
        }
        if (data?.pageText) {
          data.pageText = sanitizeHtml(data.pageText, { allowedTags: [] })
        }
        return data
      },
    ],
  },
}

export default Budget
