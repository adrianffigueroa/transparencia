import type { CollectionConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'

// 1. ¡NO importamos 'dynamic' ni el componente aquí!

const Organigrama: CollectionConfig = {
  slug: 'organigrama_person',
  labels: {
    singular: { en: 'Staff', es: 'Funcionarios' },
    plural: { en: 'Staff', es: 'Funcionarios' },
  },
  admin: {
    useAsTitle: 'fullName',
    description: 'Funcionarios / organigrama del municipio',
    components: {
      views: {
        // 2. Usamos 'edit' (minúscula) y la estructura correcta
        edit: {
          default: {
            // 3. Apuntamos al "WRAPPER" usando el alias
            Component: '@/app/components/OrganigramaEditViewWrapper.tsx',
          },
        },
      },
    },
    defaultColumns: ['fullName', 'position'],
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
    // --- 2. USAMOS EL CAMPO 'tabs' NATIVO DE PAYLOAD ---
    {
      type: 'tabs',
      tabs: [
        // --- PESTAÑA 1: INTENDENTE ---
        {
          label: 'Intendente',
          description: 'Cargá los datos del intendente para la cabecera del organigrama.',
          fields: [
            // (Ponemos los campos comunes aquí)
            {
              name: 'fullName',
              label: 'Nombre y Apellido',
              type: 'text',
              required: true,
              admin: { description: 'Nombre completo' },
            },
            {
              name: 'summary',
              label: 'Resumen / Biografía',
              type: 'richText',
            },
            {
              name: 'photo',
              label: 'Foto',
              type: 'upload',
              relationTo: 'media' as unknown as any,
            },
            {
              name: 'cv',
              label: 'CV',
              type: 'relationship',
              relationTo: 'media' as unknown as any,
            },
          ],
        },

        // --- PESTAÑA 2: FUNCIONARIOS ---
        {
          label: 'Secretarios / Funcionarios',
          description: 'Cargá los datos del funcionario y las áreas que dependen de él.',
          fields: [
            // (Ponemos los campos específicos de esta pestaña)
            {
              name: 'puesto',
              label: 'Puesto',
              type: 'text',
              required: true,
            },
            {
              name: 'areasSubordinadas',
              label: 'Áreas subordinadas',
              type: 'array',
              fields: [
                {
                  name: 'puestoSubordinado',
                  label: 'Puesto del Área',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'nombreResponsable',
                  label: 'Nombre del Responsable',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },

            // --- ¡IMPORTANTE! ---
            // Para poder construir tu frontend, necesitamos saber si
            // el documento es 'intendente' o 'secretario'.
            // Añadimos un campo 'rol' aquí adentro.
            {
              name: 'rol',
              label: 'Rol',
              type: 'radio', // Radio es mejor que 'select' para 2 opciones
              options: [
                { label: 'Intendente', value: 'intendente' },
                { label: 'Secretario/Funcionario', value: 'secretario' },
              ],
              defaultValue: 'intendente',
              required: true,
              admin: {
                // Hacemos que la pestaña activa dependa de este botón
                layout: 'horizontal',
              },
            },
          ],
        },
      ],
    },

    // --- 3. CAMPOS DE CONTROL (Si los necesitas afuera) ---
    // (Movimos 'rol' adentro de las pestañas, pero 'isVisible', 'contact', etc.
    //  pueden ir aquí afuera si querés que apliquen a ambos)
    {
      name: 'isVisible',
      label: 'Visible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar', // Los ponemos en la barra lateral
      },
    },
    {
      name: 'startDate',
      label: 'Fecha de inicio en el cargo',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contact',
      label: 'Contacto',
      type: 'group',
      fields: [
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'phone', label: 'Teléfono', type: 'text' },
      ],
    },
  ],
}

export default Organigrama
