// collections/obras.ts
import { CollectionConfig } from 'payload'

const PublicWorks: CollectionConfig = {
  slug: 'public-works',
  labels: {
    singular: { en: 'Public Work', es: 'Obra Pública' },
    plural: { en: 'Public Works', es: 'Obras Públicas' },
  },
  admin: { useAsTitle: 'title' },
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
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },

    { name: 'contractor', label: 'Contratista', type: 'text' },
    {
      name: 'workType',
      label: 'Tipo de Obra',
      type: 'select',
      options: [
        { label: 'Pavimento', value: 'pavimento' },
        { label: 'Alumbrado', value: 'alumbrado' },
        { label: 'Red de Agua', value: 'red-de-agua' },
        { label: 'Red de Cloacas', value: 'red-de-cloacas' },
        { label: 'Edificio Público', value: 'edificio-publico' },
        { label: 'Parque/Jardín', value: 'parque-jardin' },
        { label: 'Plaza', value: 'plaza' },
        { label: 'Otro', value: 'otro' },
      ],
      required: true,
    },
    {
      name: 'location',
      label: 'Ubicación (punto)',
      type: 'group',
      fields: [
        { name: 'latitude', type: 'number', required: false },
        { name: 'longitude', type: 'number', required: false },
      ],
      required: false,
    },

    {
      name: 'segments',
      label: 'Tramos/Cuadras',
      type: 'array',
      fields: [
        { name: 'street', label: 'Calle', type: 'text' },
        // Una polilínea simple: lista de puntos
        {
          name: 'points',
          label: 'Puntos',
          type: 'array',
          minRows: 2,
          fields: [
            { name: 'latitude', type: 'number', required: true },
            { name: 'longitude', type: 'number', required: true },
          ],
        },
      ],
      required: false,
    },

    {
      name: 'mapPreview', // Nombre del campo (no se guarda en la DB)
      type: 'ui', // Tipo "User Interface"
      label: 'Previsualización de Mapa', // La label es opcional, ya la pusimos en el componente
      admin: {
        components: {
          // Asigna tu componente personalizado
          Field: '@/app/components/MapPreviewWrapper.tsx',
        },
      },
    },

    // Fotos de la obra
    {
      name: 'photos',
      label: 'Fotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: false,
    },

    // Avance de obra
    {
      name: 'progress',
      label: 'Avance (%)',
      type: 'number',
      min: 0,
      max: 100,
      required: true,
      admin: { description: 'Porcentaje de avance actual' },
    },

    // (Opcional) Historial de avances
    {
      name: 'progressHistory',
      label: 'Historial de avances',
      type: 'array',
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'progress', type: 'number', min: 0, max: 100, required: true },
        { name: 'comment', type: 'textarea' },
      ],
    },
  ],
}

export default PublicWorks
