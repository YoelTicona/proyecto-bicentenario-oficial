'use client'

import { useRouter } from 'next/navigation'
import useAuth from '../../hooks/useAuth'
import { useEffect } from 'react'

export default function ProteccionRol({ children, rolRequerido = null, redireccion = '/' }) {
  const { usuario, datosUsuario, cargando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        router.push('/iniciar-sesion')
      } else if (rolRequerido && datosUsuario?.rol !== rolRequerido) {
        router.push(redireccion)
      }
    }
  }, [usuario, datosUsuario, cargando, router, rolRequerido, redireccion])

  if (cargando || !usuario || (rolRequerido && datosUsuario?.rol !== rolRequerido)) {
    return <p className="text-center py-20">Cargando...</p>
  }

  return <>{children}</>
}
