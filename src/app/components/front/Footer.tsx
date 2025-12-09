import React from 'react'
import Link from 'next/link'
import HomeSocialLogos from '../HomeSocialLogos'

const Footer = () => {
  return (
    <footer className="grid grid-cols-1 text-center mt-8 pb-4">
      <div className="text-lg font-semibold text-violet-300">
        <Link className="no-underline" href="/">
          LOGO
        </Link>
      </div>
      <div className="my-4">
        <p className="text-sm text-gray-600 font-normal">
          Compromiso con la transparencia y la participación
        </p>
      </div>
      <p className="text-sm text-gray-600 font-medium">Contacto 0800-111-222</p>
      <p className="text-sm text-gray-600 font-normal">trasparecia@quilmes.gob.ar</p>
      <HomeSocialLogos />
      <p className="text-black font-light text-xs">© 2025 Municipio - Portal de Transparencia</p>
    </footer>
  )
}

export default Footer
