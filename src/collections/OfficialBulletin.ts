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
    hideAPIURL: true,
    components: {
      views: {
        edit: {
          default: {
            Component: '@/app/components/admin/views/collections/OfficialBulletinEditViewWrapper',
          },
        },
        list: {
          Component: '@/app/components/admin/views/collections/OfficialBulletinListViewWrapper',
        },
      },
    },
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
      name: 'number',
      label: 'Número de publicación de Boletín',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'publishedDate',
      label: 'Fecha de Publicación',
      type: 'date',
      required: true,
    },
    {
      name: 'type',
      label: 'Tipos de publicaciones',
      type: 'select',
      options: [
        { label: 'Disposiciones', value: 'disposiciones' },
        { label: 'Resoluciones', value: 'resoluciones' },
        { label: 'Ordenanzas', value: 'ordenanzas' },
      ],
      required: false,
    },
    {
      name: 'heroText',
      label: 'Texto destacado',
      type: 'text',
      required: false,
    },
    {
      name: 'file',
      label: 'Archivo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'isPublished',
      label: '¿Publicado?',
      type: 'checkbox',
      defaultValue: false,
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
