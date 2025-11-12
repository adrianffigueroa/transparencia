// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import SiteCustomization from './globals/SiteCustomization'
import Organigrama from './collections/Staff'

import Users from './collections/Users'
import Media from './collections/Media'
import { es } from '@payloadcms/translations/languages/es'
import OfficialBulletin from './collections/OfficialBulletin'
import Commitment from './collections/Commitment'
import Budget from './collections/Budget'
import Tenders from './collections/Tenders'
import Participation from './collections/Participation'
import PublicWorks from './collections/PublicWorks'
import HomeCustomization from './globals/HomeCustomization'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: { supportedLanguages: { es } },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      Nav: '@/app/components/CustomNav.tsx',
      graphics: {
        Logo: '@/app/components/CustomLogo.tsx',
        Icon: '@/app/components/CustomLogo.tsx',
      },
    },
  },
  collections: [
    Users,
    Media,
    Organigrama,
    OfficialBulletin,
    Commitment,
    Budget,
    Tenders,
    Participation,
    PublicWorks,
  ],
  globals: [SiteCustomization, HomeCustomization],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
