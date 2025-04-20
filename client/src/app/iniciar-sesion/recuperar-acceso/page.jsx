'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function RecuperarContrasenia() {
  const router = useRouter()
  const pathname = usePathname()
  const token = pathname.split('/')[2] || ''

  const [contrasenia, setContrasenia] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [ver1, setVer1] = useState(false)
  const [ver2, setVer2] = useState(false)

  const validar = (pass) => {
    if (!/[a-z]/.test(pass)) return 'Debe tener al menos una minúscula.'
    if (!/[A-Z]/.test(pass)) return 'Debe tener al menos una mayúscula.'
    if (!/\d/.test(pass)) return 'Debe tener al menos un número.'
    if (!/[^a-zA-Z0-9]/.test(pass)) return 'Debe tener un carácter especial.'
    if (pass.length < 8 || pass.length > 15) return 'Debe tener entre 8 y 15 caracteres.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validacion = validar(contrasenia)
    if (validacion) return setError(validacion)
    if (contrasenia !== confirmar) return setError('Las contraseñas no coinciden.')

    try {
      const res = await fetch('http://localhost:4000/api/cambiar_contrasenia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contrasenia, token })
      })

      const data = await res.json()
      if (!res.ok) return setError(data.message)
      setExito(data.message)
      setTimeout(() => router.push('/iniciar-sesion'), 2000)
    } catch (err) {
      setError('Error de conexión.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#889E73] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2b2c32]">
          Recupera tu contraseña
        </h2>

        <div className="mb-4 relative">
          <label className="block mb-1">Nueva contraseña</label>
          <input
            type={ver1 ? 'text' : 'password'}
            className="input pr-10"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() => setVer1(!ver1)}
          >
            {ver1 ? '🙈' : '👁️'}
          </span>
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1">Confirmar contraseña</label>
          <input
            type={ver2 ? 'text' : 'password'}
            className="input pr-10"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() => setVer2(!ver2)}
          >
            {ver2 ? '🙈' : '👁️'}
          </span>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {exito && <p className="text-green-600 text-sm mb-3">{exito}</p>}

        <button
          type="submit"
          className="w-full bg-[#889E73] text-white py-2 rounded hover:bg-[#71875e] transition"
        >
          Recuperar contraseña
        </button>
      </form>
    </div>
  )
}
