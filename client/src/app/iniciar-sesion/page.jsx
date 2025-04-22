'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { generarCaptcha, validarCaptcha } from './../../utils/captcha'
import FishDecorativo from '../../components/FishDecorativo'
import { loginUsuario } from '../../services/auth'


export default function IniciarSesion() {
  const [captcha, setCaptcha] = useState('')
  const [verContrasenia, setVerContrasenia] = useState(false)
  const [formData, setFormData] = useState({
    usuario: '',
    contrasenia: '',
    captcha: ''
  })

  const router = useRouter()

  useEffect(() => {
    setCaptcha(generarCaptcha())
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
  
    if (!validarCaptcha(formData.captcha, captcha)) {
      Swal.fire({
        icon: 'error',
        title: 'Captcha incorrecto',
        text: 'Por favor verifica el código mostrado.'
      })
      setCaptcha(generarCaptcha())
      return
    }
  
    try {
      const response = await loginUsuario({
        email: formData.usuario,
        password: formData.contrasenia
      })
    
      if (!response.user.emailVerified) {
        Swal.fire({
          icon: 'warning',
          title: 'Verifica tu correo',
          text: 'Tu cuenta aún no ha sido verificada. Por favor revisa tu email.',
          confirmButtonText: 'Ir a verificación'
        }).then(() => {
          router.push('/iniciar-sesion/verificacion-pendiente')
        })
        return
      }
    
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: `Bienvenido, ${response.user.email}`,
        timer: 1500,
        showConfirmButton: false
      })
    
      setTimeout(() => router.push('/'), 1600)    
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: error.message
      })
      setCaptcha(generarCaptcha())
    }
  }
  
  // ENVIO DEL FORMULARIO DE LOGIN 
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#889E73] px-4 overflow-hidden py-10">

      <FishDecorativo />
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
            <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} required className="input" />
          </div>

          <div className="relative">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type={verContrasenia ? 'text' : 'password'}
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
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
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                className="input"
                placeholder="Ingresa el código"
              />
              <button type="button" onClick={() => setCaptcha(generarCaptcha())} className="bg-gray-800 text-white px-3 py-2 rounded">
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