'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  href: string
  children: React.ReactNode
}

export const CustomNavLink = ({ href, children }: Props) => {
  const pathname = usePathname()

  // Se considera "activo" si la ruta es exacta o si es una sub-página
  // (ej: /admin/collections/obras/123 sigue marcando "Obras" como activo)
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      // Aquí aplicas tus clases de Tailwind
      className={`block rounded-md py-2 px-1 text-md transition-colors no-underline ${
        isActive
          ? 'font-semibold text-gray-900 bg-gray-100' // Estilo activo
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' // Estilo inactivo
      }`}
    >
      {children}
    </Link>
  )
}
