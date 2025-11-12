import { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types'
import { CollectionConfig } from 'payload'

const COLLECTION_CATEGORY_MAP: Record<string, string> = {
  // Slug de Colección (referer URL) : Valor de Categoría de Media
  'public-works': 'obra',
  budget: 'presupuesto',
  official_bulletin: 'boletin',
  tenders: 'licitacion',
  organigrama: 'perfil',
  'site-customization': 'personalizacion',
  commitment: 'compromiso',
  users: 'perfil',
}

const setCategoryBeforeChange: BeforeChangeHook = async ({ data, req, operation }) => {
  console.log(operation)

  if (operation) {
    const referer = req.headers.get('referer')
    console.log('referer: ', referer)

    if (referer) {
      // Extraer el slug de la colección de la URL del referer
      // La expresión busca '/admin/collections/[slug]/' o '/admin/globals/[slug]'
      // const match = referer.match(/\/admin\/(?:collections|globals)\/([a-zA-Z0-9_-]+)\//)
      const match = referer.match(/\/admin\/(?:collections|globals)\/([a-zA-Z0-9_-]+)(?:\/|\?|$)/)
      console.log(match)

      if (match && match[1]) {
        const collectionOrGlobalSlug = match[1]
        const inferredCategory = COLLECTION_CATEGORY_MAP[collectionOrGlobalSlug]

        if (inferredCategory) {
          data.category = inferredCategory
          console.log(
            `Payload Media Hook: Categoría inferida de referer (${collectionOrGlobalSlug}): ${inferredCategory}`,
          )
          return data
        }
      }
    }

    // 3. Fallback seguro si no hay referer, no se pudo parsear o el slug no está mapeado
    console.log('Payload Media Hook: No se pudo determinar el contexto. Usando "otros".')
    data.category = 'otros'
  }

  // Devolver los datos modificados (o no modificados si es update)
  return data
}

const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { en: 'Media', es: 'Archivo' },
    plural: { en: 'Media', es: 'Archivos' },
  },
  upload: {
    staticDir: 'uploads/media',
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/plain', // .txt
      'application/zip', // .zip
      'text/csv', // .csv
      'text/html', // .html
      'text/json', // .json
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'image/svg+xml', // .svg
      'video/mp4', // .mp4
      'video/mpeg', // .mpeg
      'video/quicktime', // .mov
      'audio/mpeg', // .mp3
      'audio/wav', // .wav
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'profile', // Tamaño específico para fotos de perfil
        width: 200,
        height: 200,
        crop: 'center',
      },
    ],
    adminThumbnail: 'thumbnail', // usar el tamaño 'thumb' para previsualización en admin
  },
  access: {
    read: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    create: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    update: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  fields: [
    {
      name: 'caption',
      label: 'Descripción',
      type: 'text',
      admin: { placeholder: 'Descripción breve del archivo (opcional)' },
    },
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      options: [
        { value: 'logo', label: 'Logo' },
        { value: 'perfil', label: 'Foto de perfil' },
        { value: 'obra', label: 'Foto de obra' },
        { value: 'documento', label: 'Documento' },
        { value: 'banner', label: 'Banner' },
        { label: 'Personalización', value: 'personalizacion' },
        { value: 'otros', label: 'Otros' },
      ],
      admin: {
        isClearable: true,
        readOnly: true, // EL ADMIN NO PUEDE CAMBIAR ESTE VALOR
        hidden: true, // OCULTAR ESTE CAMPO EN EL MODAL DE SUBIDA/EDICIÓN
      },
    },
  ],
  hooks: {
    beforeChange: [setCategoryBeforeChange],
  },
}

export default Media
