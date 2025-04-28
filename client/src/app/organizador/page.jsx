'use client'

import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebase-config'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

export default function PaginaOrganizador() {
  const [usuario, setUsuario] = useState(null)
  const [datos, setDatos] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [evento, setEvento] = useState({
    titulo: '', descripcion: '', fecha: '', modalidad: '', link: '',
    costo: '', ciudad: '', departamento: '', direccion: '', categoria: '', imagen: '', puntuacion: 0
  })

  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push('/')
      setUsuario(user)
      const ref = doc(db, 'Usuarios', user.uid)
      const snap = await getDoc(ref)
      if (!snap.exists() || snap.data().rol !== 'organizador') {
        Swal.fire({ icon: 'error', title: 'Acceso restringido', text: 'Solo para organizadores' })
        router.push('/')
      } else {
        setDatos(snap.data())
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'imagen' && files?.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => setImagenPreview(reader.result)
      reader.readAsDataURL(file)
      setEvento((prev) => ({ ...prev, imagen: file.name })) // solo nombre por ahora
    } else {
      setEvento({ ...evento, [name]: value })
    }
  }

  const guardarEvento = async (e) => {
    e.preventDefault()
    if (!evento.titulo || !evento.fecha) {
      Swal.fire({ icon: 'warning', title: 'Faltan campos obligatorios' })
      return
    }
    try {
      await addDoc(collection(db, 'Eventos'), {
        ...evento,
        fecha: Timestamp.fromDate(new Date(evento.fecha)),
        creadoPor: usuario.uid
      })
      Swal.fire({ icon: 'success', title: 'Evento registrado' })
      setEvento({
        titulo: '', descripcion: '', fecha: '', modalidad: '', link: '',
        costo: '', ciudad: '', departamento: '', direccion: '', categoria: '', imagen: '', puntuacion: 0
      })
      setImagenPreview(null)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message })
    }
  }

  if (!usuario || !datos) return <p className="text-center py-20">Cargando...</p>

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Agregar Evento</h2>
      <form onSubmit={guardarEvento} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Imagen del evento</label>
          <div className="relative w-full h-48 bg-gray-100 rounded flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden">
            {imagenPreview ? (
              <img src={imagenPreview} alt="Previsualización" className="h-full object-contain rounded" />
            ) : (
              <span className="text-gray-400 z-10">Haz clic para seleccionar imagen</span>
            )}
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Título</label>
            <input name="titulo" value={evento.titulo} onChange={handleChange} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1">Fecha</label>
            <input name="fecha" type="date" value={evento.fecha} onChange={handleChange} className="input w-full" />
          </div>
        </div>

        <div>
          <label className="block mb-1">Descripción</label>
          <textarea name="descripcion" value={evento.descripcion} onChange={handleChange} className="input w-full h-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Modalidad</label>
            <select name="modalidad" value={evento.modalidad} onChange={handleChange} className="input w-full">
              <option value="">Seleccionar</option>
              <option value="virtual">Virtual</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Enlace de información</label>
            <input name="link" value={evento.link} onChange={handleChange} className="input w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Costo</label>
            <input name="costo" type="number" value={evento.costo} onChange={handleChange} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1">Dirección</label>
            <input name="direccion" value={evento.direccion} onChange={handleChange} className="input w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Departamento</label>
            <select name="departamento" value={evento.departamento} onChange={handleChange} className="input w-full">
              <option value="">Seleccionar</option>
              <option value="La Paz">La Paz</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Oruro">Oruro</option>
              <option value="Potosí">Potosí</option>
              <option value="Chuquisaca">Chuquisaca</option>
              <option value="Tarija">Tarija</option>
              <option value="Beni">Beni</option>
              <option value="Pando">Pando</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Ciudad</label>
            <select name="ciudad" value={evento.ciudad} onChange={handleChange} className="input w-full">
              <option value="">Seleccionar</option>
              <option value="La Paz">La Paz</option>
              <option value="El Alto">El Alto</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Oruro">Oruro</option>
              <option value="Potosí">Potosí</option>
              <option value="Sucre">Sucre</option>
              <option value="Tarija">Tarija</option>
              <option value="Trinidad">Trinidad</option>
              <option value="Cobija">Cobija</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1">Categoría</label>
          <select name="categoria" value={evento.categoria} onChange={handleChange} className="input w-full">
            <option value="">Seleccionar</option>
            <option value="Infantil">Infantil</option>
            <option value="Cultural">Cultural</option>
            <option value="Musical">Musical</option>
            <option value="Académico">Académico</option>
            <option value="Cívico">Cívico</option>
            <option value="Juvenil">Juvenil</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Comunitario">Comunitario</option>
            <option value="Religioso">Religioso</option>
            <option value="Adultos Mayores">Adultos Mayores</option>
          </select>
        </div>

        <div className="text-center">
          <button type="submit" className="px-8 py-2 border-2 border-green-600 text-green-700 font-semibold rounded-full hover:bg-green-100">
            Agregar
          </button>
        </div>
      </form>
    </motion.div>



)
}
