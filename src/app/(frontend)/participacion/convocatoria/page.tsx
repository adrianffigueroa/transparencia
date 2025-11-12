import React from 'react'
import BackButton from '@/app/components/BackButton'
import { ParticipationForm } from '@/app/components/ParticipationForm'
const page = () => {
  return (
    <div>
      <BackButton />
      <section className="grid grid-cols-1 text-center px-10 mb-6">
        <section>
          <h2 className="text-2xl text-gradient-hero font-bold text-left mb-4">Convocatoria</h2>
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
          <ParticipationForm variant="convocatoria" />
        </section>
      </section>
    </div>
  )
}

export default page
