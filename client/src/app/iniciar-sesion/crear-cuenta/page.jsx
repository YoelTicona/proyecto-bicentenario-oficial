'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroUsuario() {
  const router = useRouter()
  const [paisesCiudades, setPaisesCiudades] = useState([])
  const [verContrasenia, setVerContrasenia] = useState(false)
  const [verRepetida, setVerRepetida] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  const [form, setForm] = useState({
    nombre: '', paterno: '', materno: '', nacimiento: '', genero: '',
    email: '', pais: '', ciudad: '', contrasenia: '', confirmar: ''
  })

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(res => res.json())
      .then(data => setPaisesCiudades(data.data))
  }, [])

  const paises = paisesCiudades.map(p => p.country)
  const ciudades = form.pais
    ? paisesCiudades.find(p => p.country === form.pais)?.cities || []
    : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.contrasenia !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      setExito(false)
      return
    }

    if (form.contrasenia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setExito(false)
      return
    }

    setError('')
    setExito(true)
    alert('Usuario registrado con éxito (simulado)')
  }

  return (
    <div className="min-h-screen bg-[#889E73] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Registro de Usuario</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <input name="nombre" placeholder="Nombre" className="input" required onChange={handleChange} />
          <input name="paterno" placeholder="Paterno" className="input" required onChange={handleChange} />
          <input name="materno" placeholder="Materno" className="input" required onChange={handleChange} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <input name="email" type="email" placeholder="Correo electrónico" className="input" required onChange={handleChange} />
          <input name="nacimiento" type="date" className="input" required onChange={handleChange} />
          <select name="genero" className="input" required onChange={handleChange}>
            <option value="">Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <select name="pais" className="input" value={form.pais} onChange={handleChange} required>
            <option value="">País</option>
            {paises.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select name="ciudad" className="input" value={form.ciudad} onChange={handleChange} required disabled={!ciudades.length}>
            <option value="">Ciudad</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <input
              name="contrasenia"
              type={verContrasenia ? 'text' : 'password'}
              placeholder="Contraseña"
              className="input"
              required
              onChange={handleChange}
            />
            <span
              onClick={() => setVerContrasenia(!verContrasenia)}
              className="absolute right-3 top-2 cursor-pointer text-gray-600"
            >
              {verContrasenia ? '🙈' : '👁️'}
            </span>
          </div>
          <div className="relative">
            <input
              name="confirmar"
              type={verRepetida ? 'text' : 'password'}
              placeholder="Repite la contraseña"
              className="input"
              required
              onChange={handleChange}
            />
            <span
              onClick={() => setVerRepetida(!verRepetida)}
              className="absolute right-3 top-2 cursor-pointer text-gray-600"
            >
              {verRepetida ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {exito && <p className="text-green-600 text-sm">¡Registro exitoso!</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#889E73] text-white px-6 py-2 rounded-full hover:bg-[#6f825e] transition"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}
