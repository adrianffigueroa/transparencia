import Link from 'next/link'
import React from 'react'

const CardLatestLicitaciones = () => {
  return (
    <section className="flex flex-col gap-2 border border-black rounded-md p-2 mb-2">
      <div className="flex flex-row items-center justify-between">
        <div className="text-black text-lg font-normal">Licitacion pública 04/25</div>
        <div className="flex flex-row items-center gap-2">
          <Link href="licitaciones/1" className="text-blue-500 font-semibold inline-block">
            <span className="text-blue-500">Ver</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-4/5">
        <div className="text-gray-500">
          Vinculación de AU Buenos Aires - La Plata con Colectoras Km 25.
        </div>
      </div>
    </section>
  )
}

export default CardLatestLicitaciones
