'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Swal from 'sweetalert2'

export default function IniciarSesion() {
  const [captcha, setCaptcha] = useState('')
  const [inputCaptcha, setInputCaptcha] = useState('')
  const [verContrasenia, setVerContrasenia] = useState(false)
  const router = useRouter()

  useEffect(() => {
    generarCaptcha()
  }, [])

  const generarCaptcha = () => {
    const caracteres = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let codigo = ''
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    setCaptcha(codigo)
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
    if (inputCaptcha !== captcha) {
      Swal.fire({
        icon: 'error',
        title: 'Captcha incorrecto',
        text: 'Por favor verifica el código mostrado.',
      })
      generarCaptcha()
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        timer: 1500,
        showConfirmButton: false,
      })
      setTimeout(() => router.push('/'), 1600)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#889E73] px-4 overflow-hidden py-10">
      {/* SVG pez decorativo */}
      <div className="absolute bottom-10 left-10 z-0 animate-swim">
        <svg viewBox="0 0 512 512" className="w-32 h-32">
          <path
            fill="#ffffff"
            d="M96 256c0 35.35 7.2 68.87 20.2 99.5C84.15 365.2 64 388.6 64 416c0 8.837 7.164 16 16 16 27.41 0 50.83-20.15 60.5-52.2C187.1 440.8 256 480 256 480s68.88-39.19 115.5-100.2C381.2 411.9 404.6 432 432 432c8.836 0 16-7.163 16-16 0-27.41-20.15-50.83-52.2-60.5C408.8 324.9 416 291.4 416 256s-7.201-68.88-20.2-99.5C443.9 146.8 464 123.4 464 96c0-8.837-7.164-16-16-16-27.41 0-50.83 20.15-60.5 52.2C324.9 71.2 256 32 256 32s-68.87 39.2-115.5 100.2C130.8 100.1 107.4 80 80 80c-8.837 0-16 7.163-16 16 0 27.41 20.15 50.83 52.2 60.5C103.2 187.1 96 220.6 96 256z"
          />
        </svg>
      </div>

      <div className="relative z-10 bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <Image src="/logo_bicentenario.png" alt="Logo Bicentenario" width={80} height={80} />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">Bicentenario 2025</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          “200 años de lucha, identidad y esplendor. ¡Celebremos juntos el Bicentenario de Bolivia!”
        </p>

        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-gray-700">Usuario o correo</label>
            <input type="text" required className="input" />
          </div>

          <div className="relative">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type={verContrasenia ? 'text' : 'password'}
              required
              className="input pr-10"
            />
            <span
              onClick={() => setVerContrasenia(!verContrasenia)}
              className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
            >
              {verContrasenia ? '🙈' : '👁️'}
            </span>
          </div>

          <div>
            <label className="block text-gray-700">Captcha</label>
            <div className="bg-gray-100 border p-2 text-center tracking-widest font-mono text-lg">
              {captcha}
            </div>
            <div className="flex mt-2 gap-2">
              <input
                type="text"
                className="input"
                placeholder="Ingresa el código"
                value={inputCaptcha}
                onChange={(e) => setInputCaptcha(e.target.value)}
              />
              <button type="button" onClick={generarCaptcha} className="bg-gray-800 text-white px-3 py-2 rounded">
                ↻
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-[#889E73] hover:bg-[#6f825e] rounded transition hover:scale-105"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            ¿No tienes cuenta?{' '}
            <a href="/iniciar-sesion/crear-cuenta" className="text-blue-700 font-semibold">
              Crea una cuenta
            </a>
          </p>
          <p>
            ¿Olvidaste tu contraseña?{' '}
            <a href="/iniciar-sesion/recuperar-acceso" className="text-blue-700 font-semibold">
              Recuperar acceso
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
