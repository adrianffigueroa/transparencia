// src/app/components/CustomNav.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useConfig } from '@payloadcms/ui'
import { useAuth } from '@payloadcms/ui'
import { CustomNavLink } from './CustomNavLink'
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
  // Aquí puedes mapear slugs a íconos si lo deseas
}

const adminCollectionSlugs = ['users']

export default function CustomNav() {
  const config = useConfig()
  const { user } = useAuth()
  const [mainItems, setMainItems] = useState<NavItem[]>([])
  const [adminItems, setAdminItems] = useState<NavItem[]>([])
  const [enabledSections, setEnabledSections] = useState<string[]>([])

  useEffect(() => {
    // console.log('--- CustomNav (useEffect Triggered) ---', { config, user })

    if (config && (config as any).config?.collections) {
      // console.log('--- CustomNav [useEffect]: ¡Contexto cargado!', { config, user })
      fetch('/api/globals/home-customization')
        .then((res) => res.json())
        .then((settings) => {
          // Guardamos las secciones habilitadas (ej: ['public-works', 'tenders'])
          setEnabledSections(settings.enabledSections || [])
        })
      // Ahora que la guarda protegió 'config', podemos usarlo.
      const {
        config: { collections },
        config: { globals },
      } = config as any

      console.log(collections)
      console.log(user)

      // 4. Obtenemos colecciones accesibles (tu lógica simplificada)
      const accessibleCollections = (collections || [])
        .filter((coll: any) => !coll.slug.startsWith('payload'))
        .filter((coll: any) => {
          if (!user) {
            return false
          }
          if ((user as any).role === 'admin') {
            return true
          }
          return (
            (coll.access?.read?.includes((user as any).role) ||
              (user as any).role === 'client-admin') &&
            enabledSections.includes(coll.slug)
          )
        })

        .map((coll: any) => ({
          slug: coll.slug,
          label: coll.labels.plural.es,
          href: `/admin/collections/${coll.slug}`,
        }))

      // 5. Obtenemos globales accesibles (tu lógica simplificada)
      const accessibleGlobals = (globals || []).map((g: any) => ({
        slug: g.slug,
        label: g.label,
        href: `/admin/globals/${g.slug}`,
      }))

      // 6. Juntamos todo y separamos por grupos
      const allItems = [...accessibleGlobals, ...accessibleCollections]

      setMainItems(allItems.filter((item) => !adminCollectionSlugs.includes(item.slug)))
      setAdminItems(allItems.filter((item) => adminCollectionSlugs.includes(item.slug)))
    } else {
      console.log(
        '--- CustomNav [useEffect]: Omitido (config, config.collections, o user no están listos)',
      )
    }
  }, [config, user]) // Dependencias: se re-ejecuta cuando config o user cambian

  // 7. El 'return' (renderizado)
  // (Este código estaba bien y se actualizará cuando el estado cambie)
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
                    <div className="text-indigo-500 w-10">{navIcons[item.slug]}</div>
                    <span>{item.label}</span>
                  </span>
                </CustomNavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Grupo de Administración (solo si hay items) */}
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
