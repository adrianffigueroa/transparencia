import React from 'react'
import BackButton from '@/app/components/BackButton'

import herotransparencia from '@/public/assets/hero_transparencia.jpg'
import { ParticipationForm } from '@/app/components/admin/views/collections/ParticipationForm'

const page = () => {
  return (
    <>
      <BackButton />
      <section className="grid grid-cols-1 text-center px-10">
        <div
          className={`relative h-40 rounded-lg bg-cover bg-bottom bg-no-repeat`}
          style={{
            backgroundImage: `url(${herotransparencia.src})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)`,
            }}
            className={`absolute inset-0 flex items-center justify-center rounded-lg `}
          >
            <h2 className="text-2xl font-bold text-gradient-hero">Sumá tu Propuesta</h2>
          </div>
        </div>
        <section>
          <p className="text-sm font-light text-gray-500 text-left ">
            Si tenés una idea para mejorar tu barrio o tu ciudad, este es tu lugar. En “Suma tu
            proyecto” podés compartir tus propuestas, contar qué te gustaría cambiar o impulsar, y
            sumar apoyos de otros vecinos. Completá el formulario con los datos de tu proyecto y
            explicá brevemente cómo querés hacerlo realidad. Luego, el municipio evaluará tu
            propuesta y te avisará si puede sumarse al programa de participación ciudadana.
          </p>
        </section>
        <section>
          <h3 className="font-normal text-black text-left">
            Sumá tu proyecto completando el formulario
          </h3>
          <ParticipationForm variant="participation" />
        </section>
      </section>
    </>
  )
}

export default page
