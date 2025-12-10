import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

// --- HOOK: Solo un Intendente ---
// Este hook valida que no se cree más de un registro con el rol 'intendente'.
const ensureUniqueIntendente: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Normalizamos a minúsculas para comparar
  const roleToCheck = (data.role || '').toLowerCase()

  if (roleToCheck === 'intendente') {
    const existing = await req.payload.find({
      collection: 'organigrama_person',
      where: {
        role: { equals: 'Intendente' }, // Buscamos el string exacto si guardas con mayúscula inicial
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      // Si es CREATE, prohibido.
      if (operation === 'create') {
        throw new Error('Ya existe un Intendente. Solo puede haber uno.')
      }
      // Si es UPDATE, verificamos que sea el mismo ID.
      if (operation === 'update' && originalDoc.id !== existing.docs[0].id) {
        throw new Error('Ya existe un Intendente. No puedes asignar este rol.')
      }
    }
  }
  return data
}

const Organigrama: CollectionConfig = {
  slug: 'organigrama_person',
  labels: {
    singular: 'Organigrama',
    plural: 'Organigrama',
  },
  admin: {
    hideAPIURL: true,
    components: {
      views: {
        edit: {
          default: {
            // Usamos el Wrapper para cargar el componente de cliente
            Component: '@/app/components/admin/views/collections/OrganigramaEditViewWrapper',
          },
        },
        list: {
          // Usamos el Wrapper para cargar el componente de cliente
          Component: '@/app/components/admin/views/collections/OrganigramaListViewWrapper',
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
  hooks: {
    beforeChange: [ensureUniqueIntendente],
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'role', type: 'text', required: true }, // Ej: "Intendente" o "Jefe de Gabinete"
    { name: 'bio', type: 'textarea', required: false },
    { name: 'photo', type: 'upload', relationTo: 'media', required: false },
    { name: 'cv', type: 'upload', relationTo: 'media', required: false },
    { name: 'heroText', label: 'Texto destacado', type: 'text', required: false },

    // --- Array para el Nivel 3 (Áreas) ---
    {
      name: 'subordinateAreas',
      type: 'array',
      fields: [
        { name: 'areaName', type: 'text' },
        { name: 'responsibleName', type: 'text' },
      ],
      required: false,
    },
  ],
}

export default Organigrama
