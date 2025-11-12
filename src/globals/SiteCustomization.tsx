// collections/siteCustomization.ts
import type { GlobalConfig } from 'payload'
import sanitizeHtml from 'sanitize-html'
import path from 'path' // 1. Importa 'path'
import { fileURLToPath } from 'url' // 2. Importa 'fileURLToPath'

// --- 3. RECREA __dirname PARA ESM ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// --- FIN DEL BLOQUE NUEVO ---

const hexValidate = (v: unknown) => {
  if (!v) return true
  if (typeof v !== 'string') return 'Formato HEX inválido'
  return /^#([0-9A-Fa-f]{6})$/.test(v) ? true : 'Formato HEX inválido. Ej: #1A2B3C'
}

const colorFieldAdmin: any = {
  description: '',
  components: {
    // --- 4. CORRECCIÓN: USA UN ALIAS O RUTA ABSOLUTA ---
    // (Usando el alias '@/' es la mejor práctica, asumiendo que está en tsconfig.json)
    Field: '@/app/components/ColorPickerFancy.tsx',
    // O si prefieres la ruta absoluta con __dirname:
    // Field: path.resolve(__dirname, '../../app/components/ColorPickerFancy.tsx')
  },
}

const SiteCustomization: GlobalConfig = {
  slug: 'site-customization',
  label: 'Apariencia',
  admin: {
    description: 'Configuración visual del portal.',
  },

  access: {
    read: () => true, // front puede leer
    update: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
  },

  fields: [
    // Logos y favicons
    {
      name: 'logo',
      label: 'Logo del Municipio',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Tamaño recomendado: 400 x 400 px. Formatos aceptados: PNG o SVG transparentes.',
        components: {
          Field: '@/app/components/CustomUploadField',
        },
      },
    },
    {
      name: 'favicon',
      label: 'Favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Tamaño recomendado: 16 x 16 px o 32 x 32 px, formato .ICO o .PNG.',
        components: {
          Field: '@/app/components/CustomUploadField',
        },
      },
    },

    {
      name: 'paletaDeColores', // 1. Mantenemos el GRUPO para la estructura de datos
      label: 'Paleta de colores',
      type: 'group',
      fields: [
        // --- 2. AÑADE UN CAMPO 'row' PARA EL LAYOUT ---
        {
          type: 'row',
          fields: [
            // 3. Mueve tus campos de color DENTRO de la 'row'
            {
              name: 'primaryColor',
              type: 'text',
              validate: hexValidate,
              admin: {
                ...colorFieldAdmin,
                width: '50%', // <-- Ahora esto funcionará
                description: 'Se usará para títulos, botones y degradados',
              },
              defaultValue: '#005aa7',
              label: 'Color primario',
            },
            {
              name: 'secondaryColor',
              type: 'text',
              validate: hexValidate,
              admin: {
                ...colorFieldAdmin,
                width: '50%', // <-- Ahora esto funcionará
                description: 'Se usará para títulos, botones y degradados',
              },
              defaultValue: '#005aa7',
              label: 'Color secundario',
            },
          ],
        },
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

export default SiteCustomization
