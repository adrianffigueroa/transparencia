import React from 'react'
import CustomDrawer from './front/Drawer'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 ">
      {/* Izquierda: Logo */}
      <div className="text-lg font-semibold text-violet-300">
        <Link className="no-underline" href="/">
          LOGO
        </Link>
      </div>

      {/* Derecha: Iconos de Usuario, Búsqueda y Menú */}
      <div className="flex items-center gap-3 text-gray-700">
        <CustomDrawer />
      </div>
    </nav>
  )
}

export default Navbar
