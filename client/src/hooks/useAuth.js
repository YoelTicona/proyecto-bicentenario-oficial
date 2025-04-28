'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase-config'
import { doc, getDoc } from 'firebase/firestore'

export default function useAuth() {
  const [usuario, setUsuario] = useState(null)
  const [datosUsuario, setDatosUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user)
        try {
          const ref = doc(db, 'Usuarios', user.uid)
          const snap = await getDoc(ref)
          if (snap.exists()) {
            setDatosUsuario(snap.data())
          }
        } catch (err) {
          console.error('Error al obtener datos del usuario:', err)
        }
      } else {
        setUsuario(null)
        setDatosUsuario(null)
      }
      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  return { usuario, datosUsuario, cargando }
}
