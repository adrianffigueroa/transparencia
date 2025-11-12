// collections/siteCustomization.ts
import type { GlobalConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'
import path from 'path' // 1. Importa 'path'
import { fileURLToPath } from 'url' // 2. Importa 'fileURLToPath'

// --- 3. RECREA __dirname PARA ESM ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// --- FIN DEL BLOQUE NUEVO ---

const HomeCustomization: GlobalConfig = {
  slug: 'home-customization',
  label: 'Home',
  admin: {
    description: 'Editá el contenido principal que se muestra en la página de inicio.',
  },

  access: {
    read: () => true, // front puede leer
    update: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
  },

  fields: [
    // Básicos
    { name: 'siteName', label: 'Nombre del sitio', type: 'text', required: true },
    { name: 'tagline', label: 'Eslogan', type: 'richText' },
    { name: 'description', label: 'Descripción', type: 'richText' },

    // Secciones
    {
      name: 'enabledSections',
      label: 'Secciones Visibles',
      type: 'select',
      hasMany: true,
      admin: {
        description: 'Selecciona las secciones que quieres mostrar en el portal.',
        components: {
          Field: '@/app/components/CheckboxGroup',
        },
      },
      options: [
        { label: 'Organigrama', value: 'organigrama_person' },
        { label: 'Boletín Oficial', value: 'official_bulletin' },
        { label: 'Compromisos', value: 'commitment' },
        { label: 'Presupuesto', value: 'budget' },
        { label: 'Licitaciones', value: 'tenders' },
        { label: 'Obras y Servicios', value: 'public-works' },
        { label: 'Participación Ciudadana', value: 'participation' },
      ],
    },

    // Contacto y redes
    {
      name: 'contact',
      label: 'Contacto',
      type: 'group',
      fields: [
        { name: 'address', label: 'Dirección', type: 'text' },
        { name: 'phone', label: 'Teléfono', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Redes Sociales',
      type: 'array',
      fields: [
        { name: 'network', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],

  // --- 7. NOTA ADICIONAL ---
  // Este hook hace referencia a campos (sections, metaDescription, carousel)
  // que NO existen en tu lista de 'fields'. Lo he dejado,
  // pero no hará nada. Probablemente sea un copy-paste de otra colección.
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        const d = data as any

        // sanitizar todos los richText de sections
        if (Array.isArray(d?.sections)) {
          d.sections = d.sections.map((s: any) => {
            if (s?.content) {
              s.content = sanitizeHtml(s.content, {
                allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'strong', 'em'],
                allowedAttributes: { a: ['href', 'target', 'rel'] },
              })
            }
            return s
          })
        }

        // Sanitizar metaDescription si viene
        if (d?.metaDescription) {
          d.metaDescription = sanitizeHtml(String(d.metaDescription), {
            allowedTags: [],
            allowedAttributes: {},
          })
        }

        // Validar cantidad de items en carousel (ejemplo límite 6)
        if (Array.isArray(d?.carousel) && d.carousel.length > 6) {
          throw new Error('Máximo 6 imágenes permitidas en el carrusel.')
        }

        return d
      },
    ],
  },
}

export default HomeCustomization
