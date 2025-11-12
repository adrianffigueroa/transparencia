import React from 'react'
import './styles.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Transparencia - Plantilla base',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
