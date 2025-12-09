// src/app/components/CustomNav.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useConfig } from '@payloadcms/ui'
import { useAuth } from '@payloadcms/ui' // Asegurate que la importación sea correcta según tu versión
import { CustomNavLink } from '@/app/components/admin/navigation/CustomNavLink'
import { FaRegEdit, FaHome, FaRegNewspaper, FaWallet } from 'react-icons/fa'
import { GiOrganigram } from 'react-icons/gi'
import { FaListCheck, FaRoadBarrier } from 'react-icons/fa6'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { ImHammer2 } from 'react-icons/im'
import { UserMenu } from './UserMenu'

type NavItem = {
  slug: string
  label: string
  href: string
}

const navIcons: { [key: string]: React.ReactNode } = {
  'site-customization': <FaRegEdit />,
  'home-customization': <FaHome />,
  organigrama_person: <GiOrganigram />,
  official_bulletin: <FaRegNewspaper />,
  tenders: <ImHammer2 />,
  commitment: <FaListCheck />,
  budget: <FaWallet />,
  participation: <IoChatbubbleEllipsesOutline />,
  'public-works': <FaRoadBarrier />,
}

const adminCollectionSlugs = ['users']

export default function CustomNav() {
  const config = useConfig()
  const { user } = useAuth()

  const [mainItems, setMainItems] = useState<NavItem[]>([])
  const [adminItems, setAdminItems] = useState<NavItem[]>([])
  const [enabledSections, setEnabledSections] = useState<string[]>([])

  // --- EFECTO 1: CARGAR CONFIGURACIÓN (Fetch) ---
  useEffect(() => {
    // Solo hacemos el fetch si tenemos usuario (estamos logueados)
    if (user) {
      fetch('/api/globals/home-customization')
        .then((res) => res.json())
        .then((settings) => {
          // Actualizamos el estado. Esto disparará el Efecto 2.
          setEnabledSections(settings.enabledSections || [])
        })
        .catch((err) => console.error('Error cargando configuración del home:', err))
    }
  }, [user]) // Se ejecuta al loguearse/cargar

  // --- EFECTO 2: CONSTRUIR MENÚ (Filtrado) ---
  useEffect(() => {
    // Verificamos que la config de Payload esté lista
    if (config && (config as any).config?.collections) {
      const {
        config: { collections },
        config: { globals },
      } = config as any

      // 1. Obtenemos colecciones accesibles
      const accessibleCollections = (collections || [])
        .filter((coll: any) => !coll.slug.startsWith('payload'))
        .filter((coll: any) => {
          if (!user) return false

          // Si es admin, ve todo (incluso si no está habilitado en el home, opcionalmente)
          if ((user as any).role === 'admin') return true

          // Si es client-admin, validamos permisos Y que esté habilitado en el home
          return (
            (coll.access?.read?.includes((user as any).role) ||
              (user as any).role === 'client-admin') &&
            enabledSections.includes(coll.slug) // <--- Ahora esto usará el valor actualizado
          )
        })
        .map((coll: any) => ({
          slug: coll.slug,
          label: coll.labels.singular?.es || coll.labels.singular, // Asegurate que .es exista, o usa un fallback (|| coll.labels.plural)
          href: `/admin/collections/${coll.slug}`,
        }))

      // 2. Obtenemos globales accesibles
      const accessibleGlobals = (globals || []).map((g: any) => ({
        slug: g.slug,
        label: g.label,
        href: `/admin/globals/${g.slug}`,
      }))

      // 3. Juntamos y separamos
      const allItems = [...accessibleGlobals, ...accessibleCollections]

      setMainItems(allItems.filter((item) => !adminCollectionSlugs.includes(item.slug)))
      setAdminItems(allItems.filter((item) => adminCollectionSlugs.includes(item.slug)))
    }
  }, [config, user, enabledSections]) // <--- ¡LA CLAVE! Se re-ejecuta cuando enabledSections cambia
  console.log(enabledSections)
  console.log(mainItems)

  return (
    <aside className="h-full w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col p-4 overflow-y-auto">
      <UserMenu />

      <nav className="grow">
        {/* Grupo de Colecciones */}
        <div>
          <h3 className="px-3 mb-1 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Colecciones
          </h3>
          <ul className="space-y-1 list-none style-none">
            {mainItems.map((item) => (
              <li key={item.slug}>
                <CustomNavLink href={item.href}>
                  <span className="flex items-center gap-1">
                    <div className="text-indigo-500 w-10">
                      {navIcons[item.slug] || <span>•</span>}{' '}
                      {/* Fallback visual si no hay ícono */}
                    </div>
                    <span>{item.label}</span>
                  </span>
                </CustomNavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Grupo de Administración */}
        {adminItems.length > 0 && (
          <div className="mt-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administración
            </h3>
            <ul className="space-y-1 list-none">
              {adminItems.map((item) => (
                <li key={item.slug}>
                  <CustomNavLink href={item.href}>{item.label}</CustomNavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  )
}
