'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import Swal from 'sweetalert2'
import Image from 'next/image'

export default function RecuperarAcceso() {
  const router = useRouter()
  const [correo, setCorreo] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    const auth = getAuth()

    try {
      await sendPasswordResetEmail(auth, correo)
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Te hemos enviado un enlace para restablecer tu contraseña.',
        timer: 3000,
        showConfirmButton: false
      })

      setTimeout(() => {
        router.push('/iniciar-sesion')
      }, 3000)

    } catch (error) {
      console.error("Error enviando correo:", error.message)

      let mensajeError = 'Ocurrió un error. Intenta de nuevo.'
      if (error.code === 'auth/user-not-found') {
        mensajeError = 'No existe una cuenta con ese correo.'
      } else if (error.code === 'auth/invalid-email') {
        mensajeError = 'El correo electrónico no es válido.'
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#889E73] px-4 py-10 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-6">
          <Image src="/logo_bicentenario.png" alt="Logo Bicentenario" width={80} height={80} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Recuperar acceso</h1>
        <p className="text-gray-600 mb-6">
          Ingresa tu correo electrónico registrado para restablecer tu contraseña.
        </p>

        <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="input"
          />

          <button
            type="submit"
            className="bg-[#889E73] text-white px-6 py-2 rounded-full hover:bg-[#6f825e] transition cursor-pointer"
          >
            Enviar correo de recuperación
          </button>
        </form>

        <button
          onClick={() => router.push('/iniciar-sesion')}
          className="mt-6 text-blue-700 text-sm font-semibold hover:underline cursor-pointer"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  )
}
