// src/app/components/UserMenu.tsx

'use client'

import React, { Fragment } from 'react'
import { useAuth } from '@payloadcms/ui'
import { Menu, Transition } from '@headlessui/react' // 1. Importamos de Headless UI
import Link from 'next/link'
import { LuChevronDown } from 'react-icons/lu'

// Helper para generar las iniciales (sin cambios)
const getInitials = (name: string = '') => {
  const names = name.split(' ')
  const firstName = names[0] || ''
  const lastName = names[names.length - 1] || ''
  if (!lastName && firstName.includes('@')) {
    return firstName.substring(0, 2).toUpperCase()
  }
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
}

export const UserMenu = () => {
  const { user, logOut } = useAuth()

  if (!user) {
    console.log('no hay user')

    return <div className="h-[69px] border-b border-gray-200" />
  }

  const userName = (user as any).name || user.email
  const userRole = (user as any).role || (user as any).roles?.[0] || 'User'
  const userInitials = getInitials(userName)

  const handleLogout = async () => {
    await logOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="pb-4 mb-4 mt-12 ">
      {/* 2. Reemplazamos <Dropdown> por <Menu> de Headless UI */}
      <Menu as="div" className="relative">
        {/* Este es el botón en el que haces clic */}
        <Menu.Button className="flex items-center justify-between w-full text-left group">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-full text-white font-bold text-sm flex-shrink-0">
              {userInitials}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600">
                {userName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
          <LuChevronDown size={16} className="text-gray-500 group-hover:text-indigo-600" />
        </Menu.Button>

        {/* 3. Esta es la parte del menú desplegable */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/admin/account"
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Mi Cuenta
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => handleLogout()}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Cerrar Sesión
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
