'use client'

import { useEffect, useState } from 'react'
import { getAuth, sendEmailVerification } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './../firebase'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function VerificacionPendiente() {
  const [usuario, setUsuario] = useState(null)
  const [verificado, setVerificado] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    setUsuario(auth.currentUser)

    const interval = setInterval(async () => {
      await auth.currentUser.reload()
      if (auth.currentUser.emailVerified) {
        setVerificado(true)

        // Actualiza Firestore si está verificado
        const ref = doc(db, 'Usuarios', auth.currentUser.uid)
        await updateDoc(ref, { verificado: true })

        Swal.fire({
          icon: 'success',
          title: 'Correo verificado',
          text: 'Ya puedes acceder al sistema'
        })

        clearInterval(interval)
        router.push('/')
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const reenviarCorreo = async () => {
    try {
      await sendEmailVerification(usuario)
      Swal.fire({
        icon: 'info',
        title: 'Correo reenviado',
        text: 'Verifica tu bandeja de entrada'
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: err.message
      })
    }
  }

  if (verificado) return null

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f6f6f6] text-center px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Verificación pendiente</h1>
      <p className="text-gray-600 max-w-md">
        Te hemos enviado un correo de verificación. Por favor verifica tu correo electrónico para activar tu cuenta.
      </p>
      <button
        onClick={reenviarCorreo}
        className="mt-6 bg-[#889E73] text-white px-6 py-2 rounded-full hover:bg-[#6f825e] transition"
      >
        Reenviar correo de verificación
      </button>
    </div>
  )
}
