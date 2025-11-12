import React from 'react'
import '@/styles/payloadStyles.css'
import Image from 'next/image'
import herotransparencia from '@/public/assets/hero_transparencia.jpg'
import Link from 'next/link'
import { FaChevronCircleRight } from 'react-icons/fa'

const page = () => {
  return (
    <section className="grid grid-cols-1 text-left px-10">
      <h1 className="text-2xl font-semibold text-gradient-hero">Participación Ciudadana</h1>
      <p className="text-sm font-normal text-gray-500">
        Utiliza este buscador para localizar fácilmente los conjuntos de datos que necesites.
      </p>
      <div className="bg-gray-custom rounded-2xl">
        <Image
          src={herotransparencia}
          alt="Hero Transparencia"
          className="w-full mt-4 rounded-2xl"
        />
        <h3 className="font-semibold text-lg text-gradient-hero">Suma tu propuesta</h3>
        <p className="font-light text-sm text-black ">
          El Lorem Ipsum fue concebido como un texto de relleno, formateado de una cierta manera
          para permitir la presentación de elementos gráficos en documentos sin necesidad.
        </p>
        <div className="mt-4">
          <Link href="/participacion/sumar-propuesta" className="mt-4">
            <div className="flex items-center gap-2">
              <FaChevronCircleRight className="text-blue-500 w-4 h-4" />

              <span className="text-sm text-black">Conocer más</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="bg-gray-custom rounded-2xl">
        <h3 className="font-semibold text-lg text-gradient-hero">Convocatoria</h3>
        <p className="font-light text-sm text-black mb-2">
          El Lorem Ipsum fue concebido como un texto de relleno, formateado de una cierta manera
          para permitir la presentación de elementos gráficos en documentos sin necesidad.
        </p>
        <div className="mt-4">
          <Link href="/participacion/convocatoria" className="mt-4">
            <div className="flex items-center gap-2">
              <FaChevronCircleRight className="text-blue-500 w-4 h-4" />

              <span className="text-sm text-black">Conocer más</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default page
