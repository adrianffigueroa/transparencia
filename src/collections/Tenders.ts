import type { CollectionConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'

const Tenders: CollectionConfig = {
  slug: 'tenders',
  labels: {
    singular: { en: 'Tender', es: 'Licitación' },
    plural: { en: 'Tenders', es: 'Licitaciones' },
  },
  auth: false,
  admin: {
    useAsTitle: 'title',
    description: 'Licitaciones del municipio',
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
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'object', label: 'Objeto', type: 'textarea', required: true },
    { name: 'officialBudget', label: 'Presupuesto Oficial', type: 'text', required: true },
    { name: 'deadlineRetiroPliego', label: 'Fecha límite para retiro de pliego', type: 'date' },
    { name: 'deadlineOfertas', label: 'Fecha límite para recepción de ofertas', type: 'date' },
    { name: 'openingDate', label: 'Fecha de apertura de ofertas', type: 'date' },
    { name: 'openingTime', label: 'Hora de apertura', type: 'text' },
    { name: 'lugarApertura', label: 'Lugar de apertura', type: 'textarea' },
    { name: 'valorPliego', label: 'Valor del Pliego', type: 'text' },
    { name: 'fechaValorPliego', label: 'Fecha valor pliego', type: 'date' },
    { name: 'lugarEntrega', label: 'Lugar de entrega del pliego', type: 'textarea' },
    { name: 'infoAdicional', label: 'Info adicional', type: 'textarea' },
    {
      name: 'contactEmail',
      label: 'Correo de contacto',
      type: 'email',
      required: false,
      admin: { placeholder: 'correo@municipio.gob.ar' },
    },
    {
      name: 'attachedFile',
      label: 'Archivo adjunto',
      type: 'upload',
      relationTo: 'media',
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

export default Tenders
