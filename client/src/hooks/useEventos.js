'use client'

import { useEffect, useState } from 'react'
import { obtenerEventos } from '@/services/eventService'

export default function useEventos() {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const eventosObtenidos = await obtenerEventos()
        setEventos(eventosObtenidos)
      } catch (err) {
        setError('Error al cargar eventos')
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  return { eventos, cargando, error }
}
