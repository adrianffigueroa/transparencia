// collections/staff.ts
import type { CollectionConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'

const OfficialBulletin: CollectionConfig = {
  slug: 'official_bulletin',
  labels: {
    singular: { en: 'Official Bulletin', es: 'Boletín Oficial' },
    plural: { en: 'Official Bulletins', es: 'Boletines Oficiales' },
  },
  auth: false,
  admin: {
    useAsTitle: 'title',
    description: 'Boletines Oficiales del municipio',
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
      name: 'summary',
      label: 'Resumen',
      type: 'richText',
    },
    {
      name: 'file',
      label: 'Archivo',
      type: 'upload',
      relationTo: 'media',
      required: true,
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

export default OfficialBulletin
