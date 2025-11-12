import type { CollectionConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'

const Participation: CollectionConfig = {
  slug: 'participation',
  labels: {
    singular: { en: 'Participation', es: 'Participación' },
    plural: { en: 'Participations', es: 'Participaciones' },
  },
  auth: false,
  admin: {
    useAsTitle: 'title',
    description: 'Participación Ciudadana',
  },
  access: {
    read: () => true,
    create: () => true,
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
    { name: 'title', label: 'Título del Proyecto', type: 'text', required: true },
    { name: 'fullName', label: 'Nombre y Apellido', type: 'text', required: true },
    {
      name: 'personalId',
      label: 'Documento',
      type: 'select',
      options: [
        { label: 'DNI', value: 'dni' },
        { label: 'Cédula', value: 'cedula' },
        { label: 'Libreta Cívica', value: 'libreta-civica' },
      ],
      required: true,
    },
    { name: 'idNumber', label: 'Número de Documento', type: 'number', required: true },
    { name: 'address', label: 'Domicilio', type: 'textarea', required: true },
    { name: 'email', label: 'Correo Electrónico', type: 'email', required: true },
    { name: 'phone', label: 'Teléfono', type: 'text', required: true },
    {
      name: 'projectArea',
      label: 'Área del Proyecto',
      type: 'select',
      options: [
        { label: 'Educación', value: 'educacion' },
        { label: 'Seguridad', value: 'seguridad' },
        { label: 'Salud', value: 'salud' },
        { label: 'Transporte', value: 'transporte' },
        { label: 'Medio Ambiente', value: 'medio-ambiente' },
      ],
      required: true,
    },

    { name: 'summary', label: 'Resumen del Proyecto', type: 'textarea', required: true },
    {
      name: 'justification',
      label: 'Justificación del Proyecto',
      type: 'textarea',
      required: true,
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

export default Participation
