// collections/users.ts
import type { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { en: 'User', es: 'Usuario' }, plural: { en: 'Users', es: 'Usuarios' } },
  admin: {
    useAsTitle: 'email',
    group: 'Administración',
    description: 'Usuarios del sistema (admins, client-admins, editors).',
  },
  auth: true,
  access: {
    // Crear usuarios: por defecto solo admin. Opcionalmente habilitar registro público con env var.
    create: ({ req }) => {
      const user = req?.user as any
      // Si querés habilitar registro público setea ALLOW_REGISTRATION=true en env
      // if (process.env.ALLOW_REGISTRATION === 'true') return true
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
    // Leer: cualquiera puede leer su propio registro; admin puede leer todo
    read: ({ req }) => {
      const user = req?.user as any
      return Boolean(user) // los endpoints de front llamarán con token; para UI esto está OK
    },
    // Update: admin o el propio usuario
    update: ({ req, id }) => {
      const user = req?.user as any
      if (!user) return false
      if (user.role === 'admin' || user.role === 'client-admin') return true
      // allow user to update only their own record
      return user.id === id
    },
    // Delete: solo admin
    delete: ({ req }) => {
      const user = req?.user as any
      return Boolean(user && (user.role === 'admin' || user.role === 'client-admin'))
    },
  },
  fields: [
    {
      name: 'firstName',
      label: 'Nombre',
      type: 'text',
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'text',
    },
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Foto de perfil (png/jpg). Máx 2MB.' },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'text',
      validate: (value: unknown) => {
        if (!value) return true
        const v = String(value)
        const ok = /^\+?[0-9\s\-\(\)]{7,20}$/.test(v)
        return ok ? true : 'Teléfono inválido. Ej: +54 9 381 1234567'
      },
    },

    {
      name: 'bio',
      label: 'Biografía',
      type: 'textarea',
      admin: { description: 'Breve descripción / bio del usuario' },
    },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Client Admin', value: 'client-admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'client-admin',
      admin: {
        description: 'Rol del usuario. Solo un admin puede cambiar este campo.',
      },
    },
    {
      name: 'isActive',
      label: 'Activo',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Destildar para desactivar la cuenta sin borrarla.' },
    },
  ],
  hooks: {
    beforeChange: [
      // Normalizar displayName y proteger role para no-admins
      async ({ data, req, operation, originalDoc }) => {
        const user = req?.user as any

        // Protegemos la edición del campo "role": solo admin puede cambiarlo.
        // if (data && Object.prototype.hasOwnProperty.call(data, 'role')) {
        //   const wantsToSetRole = data.role
        //   // Si no hay user (registro público) y no permitimos registro con role, forzamos default:
        //   if (!user) {
        //     // en creación pública, forzamos el role por default
        //     delete data.role
        //   } else if (user.role !== 'admin' || user.role !== 'client-admin') {
        //     // si quien edita no es admin, evitamos cambiar role
        //     // en caso de update: mantenemos el valor original
        //     if (operation === 'update') {
        //       data.role = originalDoc?.role
        //     } else {
        //       // si es create y editor no-admin está intentando crear (no debería), borramos role
        //       delete data.role
        //     }
        //   } else {
        //     // user.role === 'admin' -> deja cambiar role
        //   }
        // }

        // Si no enviaron displayName, lo generamos desde first + last
        // if (
        //   (!data?.displayName || data.displayName === '') &&
        //   (data?.firstName || data?.lastName)
        // ) {
        //   const fn = (data.firstName ?? originalDoc?.firstName ?? '') as string
        //   const ln = (data.lastName ?? originalDoc?.lastName ?? '') as string
        //   const generated = `${fn} ${ln}`.trim()
        //   if (generated) data.displayName = generated
        // }

        return data
      },
    ],
  },
}

export default Users
