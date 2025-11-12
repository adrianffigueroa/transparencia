// import { headers as getHeaders } from 'next/headers.js'
// import Image from 'next/image'
// import { getPayload } from 'payload'
// import React from 'react'
// import { fileURLToPath } from 'url'

// import config from '@/payload.config'
// import './styles.css'

// export default async function HomePage() {
//   const headers = await getHeaders()
//   const payloadConfig = await config
//   const payload = await getPayload({ config: payloadConfig })
//   const { user } = await payload.auth({ headers })

//   const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

//   return (
//     <div className="home">
//       <div className="content">
//         <picture>
//           <source srcSet="" type="image/svg+xml" />
//           <Image
//             alt="Logo Transparencia"
//             height={65}
//             src="https://cdn-icons-png.flaticon.com/512/11532/11532886.png"
//             width={65}
//           />
//         </picture>
//         {!user && <h1>Bienvenido a tu nuevo proyecto.</h1>}
//         {user && <h1>Bienvenido de nuevo, {user.email}</h1>}
//         <div className="links">
//           <a
//             className="admin"
//             href={payloadConfig.routes.admin}
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Ir al panel de administración
//           </a>
//           <a
//             className="docs"
//             href="https://payloadcms.com/docs"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Documentación
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }

import Link from 'next/link'
// Importamos los íconos del header (de lucide-react, que ya deberías tener)

import { LuSearch, LuMenu } from 'react-icons/lu'

// Importamos los íconos de la grilla (de react-icons)
import {
  FaSitemap,
  FaRegNewspaper,
  FaWallet,
  FaDatabase,
  FaGavel,
  FaTools,
  FaComments,
} from 'react-icons/fa'
import { FaListCheck } from 'react-icons/fa6'
import '@/styles/payloadStyles.css'
import CardLatest from '../components/CardLatest'
import HomeSocialLogos from '../components/HomeSocialLogos'
import Footer from '../components/Footer'

// --- Datos de la Grilla de Navegación ---
// (Por ahora son estáticos, luego los podemos cargar desde Payload si es necesario)
const navItems = [
  { label: 'Organigrama', href: '/organigrama', icon: <FaSitemap /> },
  { label: 'Boletín oficial', href: '/boletin-oficial', icon: <FaRegNewspaper /> },
  { label: 'Compromisos', href: '/compromisos', icon: <FaListCheck /> },
  { label: 'Presupuesto', href: '/presupuesto', icon: <FaWallet /> },
  { label: 'Datos abiertos', href: '/datos-abiertos', icon: <FaDatabase /> },
  { label: 'Licitaciones', href: '/licitaciones', icon: <FaGavel /> },
  { label: 'Obras y servicios', href: '/obras', icon: <FaTools /> },
  { label: 'Participación ciudadana', href: '/participacion', icon: <FaComments /> },
]

// --- Componente del Home ---
export default function Home() {
  return (
    // Usamos un fondo degradado ligero como en el Figma
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* --- Header --- */}

      {/* --- Contenido Principal --- */}
      <div className="px-6 py-8 flex flex-col items-center">
        {/* --- Sección Hero --- */}
        <section className="text-center mb-10">
          <h2 className="text-lg font-medium text-gray-500 uppercase tracking-wide">
            MUNICIPIO DE QUILMES
          </h2>
          <h1 className="text-3xl font-extrabold text-gradient-hero">Portal de transparencia</h1>
          <p className="text-gray-500 text-lg mt-4 text-center">
            Toda la información pública municipal de manera clara y completa. Tu derecho a saber,
            nuestro compromiso con la transparencia.
          </p>
        </section>

        {/* --- Sección de Estadísticas (Stats) --- */}
        <section className="grid grid-cols-2 gap-x-4 gap-y-6 mb-12 text-center">
          {/* (Estos son datos de ejemplo por ahora) */}
          <div>
            <div className="text-2xl font-bold text-black">250</div>
            <div className="text-sm text-gray-500">
              Boletines <br /> publicados
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-black">58%</div>
            <div className="text-sm text-gray-500">
              Avance <br /> de obras
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-black">37%</div>
            <div className="text-sm text-gray-500">
              Compromisos <br /> cumplidos
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-black">128</div>
            <div className="text-sm text-gray-500">
              Ciudadanos <br /> participando
            </div>
          </div>
        </section>

        {/* --- Sección Grilla de Navegación --- */}
        <section className="grid grid-cols-2 gap-4">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="block p-4 bg-white shadow-lg rounded-xl text-center transition-transform transform hover:-translate-y-1"
            >
              <div className="text-3xl text-blue-600 flex justify-center items-center h-10 w-full">
                {item.icon}
              </div>
              <span className="mt-2 block font-semibold text-gray-800 text-sm">{item.label}</span>
            </Link>
          ))}
        </section>
        <section className="grid grid-cols-1 gap-2 mt-20">
          <h2 className="text-3xl font-semibold text-black text-center">
            Últimas <span className="text-gradient-hero"> publicaciones</span>
          </h2>
          <span className="text-gray-500 text-center text-lg">
            Te acercamos las publicaciones más <br /> recientes de la gestión.
          </span>
          <CardLatest />
          <CardLatest />
          <CardLatest />
        </section>

        {/* --- (Próximo paso: Sección "Últimas publicaciones" y Footer) --- */}
      </div>
    </main>
  )
}
