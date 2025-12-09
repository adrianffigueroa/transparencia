// collections/siteCustomization.ts
import type { GlobalConfig } from 'payload'
import path from 'path' // 1. Importa 'path'
import { fileURLToPath } from 'url' // 2. Importa 'fileURLToPath'

// --- 3. RECREA __dirname PARA ESM ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// --- FIN DEL BLOQUE NUEVO ---

const SiteCustomization: GlobalConfig = {
  slug: 'site-customization',
  label: 'Apariencia',
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '@/app/components/admin/views/globals/LookAndFeelCustomView',
          },
        },
      },
    },
  },

  access: {
    read: () => true, // front puede leer
    update: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
  },

  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryColor',
      type: 'text', // Guardamos el HEX como texto
    },
    {
      name: 'secondaryColor',
      type: 'text', // Guardamos el HEX como texto
    },
  ],
}

export default SiteCustomization
