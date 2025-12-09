// src/app/components/LoginRedirect.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const LoginRedirect = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Obtenemos el parámetro 'redirect' actual
    const redirect = searchParams.get('redirect')

    // Si NO existe un parámetro de redirección...
    if (!redirect) {
      // ...lo forzamos a la ruta que tú quieres.
      // Usamos 'replace' para que no ensucie el historial del navegador.
      router.replace('/admin/login?redirect=/admin/globals/home-customization') // <--- CAMBIA TU RUTA AQUÍ
    }
  }, [searchParams, router])

  // Este componente es invisible, no renderiza nada visual
  return null
}

export default LoginRedirect
