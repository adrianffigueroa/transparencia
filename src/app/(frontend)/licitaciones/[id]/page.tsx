import BackButton from '@/app/components/BackButton'
import React from 'react'

const page = () => {
  return (
    <section className="grid grid-cols-1 px-10">
      <BackButton />
      <section>
        <h2 className="text-gradient-hero text-2xl font-semibold ">Licitación pública 04/05</h2>
        <div className="border border-black p-4 rounded-md">
          <h3 className="text-black text-lg font-medium mb-4">Información de la licitación</h3>
          {/* Bloque 1: Objeto */}
          <div className="mb-4">
            <p className="text-sm text-black font-semibold">Objeto</p>
            <p className="text-sm text-gray-500 font-normal">
              Vinculación de AU Buenos Aires - La Plata con Colectoras Km 25.
            </p>
          </div>
          {/* Bloque 2: Presupuesto */}
          <div className="mb-4">
            <p className="text-sm text-black font-semibold">Presupuesto Oficial</p>
            <p className="text-sm text-gray-500 font-normal">
              $10.541.930.332,13.- (Pesos Diez Mil Quinientos Cuarenta y Un Millones Novecientos
              Treinta Mil Trescientos Treinta y Dos con 13)
            </p>
          </div>
          {/* Bloque 3: Fecha límite pliego */}
          <div className="mb-4">
            <p className="text-sm text-black font-semibold">Fecha límite para retiro de pliego</p>
            <p className="text-sm text-gray-500 font-normal">19/09/2025</p>
          </div>
          {/* Bloque 4: Fecha límite ofertas */}
          <div className="mb-4">
            <p className="text-sm text-black font-semibold">
              Fecha límite para recepción de las ofertas
            </p>
            <p className="text-sm text-gray-500 font-normal">22/09/2025</p>
          </div>
          {/* Bloque 5: Fecha apertura */}
          <div className="mb-4">
            <p className="text-sm text-black font-semibold">Fecha de apertura de ofertas:</p>
            <p className="text-sm text-gray-500 font-normal">23/09/2025 a las 10:00 horas</p>
          </div>
          {/* Bloque 6: Lugar de apertura */}
          <div className="mb-4">
            <p className="text-sm text-black font-semibold">Lugar de apertura</p>
            <p className="text-sm text-gray-500 font-normal">
              Sala de Reuniones de la Secretaría de Hacienda de la Municipalidad de Quilmes sita en
              Alberdi Nº 500 segundo piso -Quilmes.
            </p>
          </div>
          {/* Bloque 7: Valor del Pliego */}
          <div className="mb-4">
            <p className="text-sm text-black font-semibold">Valor del Pliego</p>
            <p className="text-sm text-gray-500 font-normal">
              El monto del pliego se establece en $52.709.652,00.- (Pesos Cincuenta y Dos Millones
              Setecientos Nueve Mil Seiscientos Cincuenta y Dos con 00).
            </p>
          </div>
          {/* Bloque 8: Lugar de entrega (usa 'mb-0' si es el último) */}
          <div className="mb-0">
            <p className="text-sm text-black font-semibold">Lugar de entrega del pliego</p>
            <p className="text-sm text-gray-500 font-normal">
              Los pliegos deberán ser retirados por los oferentes, hasta el día 19 de septiembre, en
              la Secretaría de Desarrollo Urbano y Obra Pública de la Municipalidad de Quilmes.
            </p>
          </div>
        </div>
        <section className="mt-2">
          <p className="text-md text-blue-500 font-normal">
            Solicitá el documento completo al siguiente correo{' '}
            <span className="font-semibold">pliegos@municipio.gob.ar</span>
          </p>
        </section>
      </section>
    </section>
  )
}

export default page
