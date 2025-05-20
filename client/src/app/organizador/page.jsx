'use client'

import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebase-config'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import SkeletonFormularioEvento from '../../components/SkeletonForm'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Importar el mapa solo en el cliente
const MapaEvento = dynamic(() => import('../../components/MapaEvento'), { ssr: false })

export default function PaginaOrganizador() {
  const [usuario, setUsuario] = useState(null)
  const [datos, setDatos] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [evento, setEvento] = useState({
    titulo: '', descripcion: '', fecha: '', hora: '', modalidad: '', link: '',
    costo: '', ciudad: '', departamento: '', direccion: '', categoria: '', imagen: '', pais: '', puntuacion: 0
  })
  const [subiendo, setSubiendo] = useState(false)
  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null })
  const [ubicacionMapa, setUbicacionMapa] = useState({ lat: -16.5, lng: -68.15 }) // Por defecto La Paz
  const [paisesCiudades, setPaisesCiudades] = useState([])
  const [patrocinadores, setPatrocinadores] = useState([{ nombre: '' }])
  const [expositores, setExpositores] = useState([{ nombre: '' }])
  const [tags, setTags] = useState(['']) // Empieza con un campo vacío
  const fechaHoraCompleta = new Date(`${evento.fecha}T${evento.hora}`)
  const [zoom, setZoom] = useState(14); // Zoom por defecto para ciudad




  const router = useRouter()

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(res => res.json())
      .then(data => setPaisesCiudades(data.data))
  }, [])

  const paises = paisesCiudades.map(p => p.country)
  const ciudades = evento.pais
    ? paisesCiudades.find(p => p.country === evento.pais)?.cities || []
    : []

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

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
  
          setUbicacionMapa({
            lat: latitude,
            lng: longitude
          });
  
          setUbicacion({
            lat: latitude,
            lng: longitude
          });
          setZoom(18);
        },
        (error) => {
          console.warn('No se pudo obtener ubicación, usando La Paz por defecto.', error);
        }
      )
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'imagen' && files?.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => setImagenPreview(reader.result)
      reader.readAsDataURL(file)
      setEvento((prev) => ({ ...prev, imagen: file }))
    } else {
      setEvento({ ...evento, [name]: value })
    }
  }

  const subirImagenCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dw8uxuhxl/image/upload`
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'eventos_bicentenario')

    const res = await fetch(url, { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Error al subir imagen')
    const data = await res.json()
    return data.secure_url
  }

  const guardarEvento = async (e) => {
    e.preventDefault()
    if (!evento.titulo || !evento.fecha) {
      Swal.fire({ icon: 'warning', title: 'Faltan campos obligatorios' })
      return
    }
    try {
      setSubiendo(true)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Subiendo imagen...',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

      let urlImagen = ''
      if (evento.imagen && typeof evento.imagen !== 'string') {
        urlImagen = await subirImagenCloudinary(evento.imagen)
      }

      const eventoRef = await addDoc(collection(db, 'Eventos'), {
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha: Timestamp.fromDate(fechaHoraCompleta), // ahora guarda fecha Y hora
        modalidad: evento.modalidad,
        link: evento.link,
        costo: evento.costo,
        direccion: evento.direccion,
        categoria: evento.categoria,
        pais: evento.pais,
        ciudad: evento.ciudad,
        imagen: urlImagen,
        latitud: ubicacion.lat,
        longitud: ubicacion.lng,
        creadoPor: usuario.uid,
        puntuacion: evento.puntuacion || 0,
        tags: tags.filter(tag => tag.trim() !== '') // Guardar sólo tags que no estén vacíos
      })
      console.log("Patrocinadores a guardar:", patrocinadores)
      console.log("Expositores a guardar:", expositores)

      // GUARDAR PATROCINADORES
      for (const p of patrocinadores) {
        if (p.nombre.trim() !== '') {
          await addDoc(collection(eventoRef, 'Patrocinadores'), { nombre: p.nombre })
        }
      }

      // GUARDAR EXPOSITORES
      for (const ex of expositores) {
        if (ex.nombre.trim() !== '') {
          await addDoc(collection(eventoRef, 'Expositores'), { nombre: ex.nombre })
        }
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Evento guardado con éxito',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      setEvento({ titulo: '', descripcion: '', fecha: '', modalidad: '', link: '', costo: '', ciudad: '', departamento: '', direccion: '', categoria: '', imagen: '', pais: '', puntuacion: 0 })
      setImagenPreview(null)
      setUbicacion({ lat: null, lng: null })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al guardar', text: error.message, showConfirmButton: true })
    } finally {
      setSubiendo(false)
    }
  }

  if (!usuario || !datos || paisesCiudades.length === 0) return <SkeletonFormularioEvento />


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10 z-10 relative">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Agregar Evento</h2>
      <form onSubmit={guardarEvento} className="space-y-5">
        {/* ... todos los inputs que ya tenías ... */}
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
          <div>
            <label className="block mb-1">Hora del evento</label>
            <input
              type="time"
              name="hora"
              value={evento.hora}
              onChange={handleChange}
              className="input w-full"
            />
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
          {/* País y ciudad */}
          <div>
            <select name="pais" className="input" value={evento.pais} onChange={handleChange} required>
              <option value="">País</option>
              {paises.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <select name="ciudad" className="input" value={evento.ciudad} onChange={handleChange} required disabled={!ciudades.length}>
              <option value="">Ciudad</option>
              {ciudades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-4">
          <label className="block mb-1">Ubicación GPS (haz clic en el mapa)</label>
          <MapaEvento 
            ubicacionMapa={ubicacionMapa}
            ubicacion={ubicacion}
            setUbicacion={setUbicacion}
            zoom={zoom} />

          {ubicacion.lat && (
            <p className="mt-2 text-sm text-gray-600">
              Latitud: {ubicacion.lat.toFixed(5)} - Longitud: {ubicacion.lng.toFixed(5)}
            </p>
          )}
        </div>


        <div>
          <label className="block mb-1">Categoría</label>
          <select name="categoria" value={evento.categoria} onChange={handleChange} className="input w-full">
            <option value="">Seleccionar</option>
            <option value="Académico">Académico</option>
            <option value="Adultos Mayores">Adultos Mayores</option>
            <option value="Comunitario">Comunitario</option>
            <option value="Cultural">Cultural</option>
            <option value="Cívico">Cívico</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Gratuito">Gratuito</option>
            <option value="Juvenil">Juvenil</option>
            <option value="Infantil">Infantil</option>
            <option value="Musical">Musical</option>
            <option value="Todo Publico">Todo Publico</option>
            <option value="Religioso">Religioso</option>
          </select>
        </div>
        <div className="mt-6">
          <label className="block mb-1">Palabras clave (Tags)</label>
          {tags.map((tag, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ej: historia, cultura"
                value={tag}
                onChange={(e) => {
                  const nuevos = [...tags]
                  nuevos[idx] = e.target.value
                  setTags(nuevos)
                }}
                className="input w-full"
              />
              <button type="button" onClick={() => {
                const nuevos = tags.filter((_, i) => i !== idx)
                setTags(nuevos)
              }} className="text-red-500 font-bold cursor-pointer">✖</button>
            </div>
          ))}
          <button type="button" onClick={() => setTags([...tags, ''])} className="text-blue-600 mt-2 underline cursor-pointer">➕ Agregar tag</button>
        </div>

        {/* Patrocinadores */}
        <div>
          <label className="block mb-1">Patrocinadores</label>
          {patrocinadores.map((p, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nombre del patrocinador"
                value={p.nombre}
                onChange={(e) => {
                  const nuevos = [...patrocinadores]
                  nuevos[idx].nombre = e.target.value
                  setPatrocinadores(nuevos)
                }}
                className="input w-full"
              />
              <button type="button" onClick={() => {
                const nuevos = patrocinadores.filter((_, i) => i !== idx)
                setPatrocinadores(nuevos)
              }} className="text-red-500 font-bold cursor-pointer">✖</button>
            </div>
          ))}
          <button type="button" onClick={() => setPatrocinadores([...patrocinadores, { nombre: '' }])} className="text-blue-600 mt-2 underline cursor-pointer">➕ Agregar patrocinador</button>
        </div>

        {/* Expositores */}
        <div className="mt-6">
          <label className="block mb-1">Expositores</label>
          {expositores.map((e, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nombre del expositor"
                value={e.nombre}
                onChange={(e2) => {
                  const nuevos = [...expositores]
                  nuevos[idx].nombre = e2.target.value
                  setExpositores(nuevos)
                }}
                className="input w-full"
              />
              <button type="button" onClick={() => {
                const nuevos = expositores.filter((_, i) => i !== idx)
                setExpositores(nuevos)
              }} className="text-red-500 font-bold cursor-pointer">✖</button>
            </div>
          ))}
          <button type="button" onClick={() => setExpositores([...expositores, { nombre: '' }])} className="text-blue-600 mt-2 underline cursor-pointer">➕ Agregar expositor</button>
        </div>


        <div className="text-center">
          <button
            type="submit"
            className={`cursor-pointer px-8 py-2 border-2 rounded-full font-semibold ${subiendo ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'border-green-600 text-green-700 hover:bg-green-100'
              }`}
            disabled={subiendo}
          >
            {subiendo ? 'Subiendo imagen...' : 'Agregar'}
          </button>
        </div>
      </form>
    </motion.div>



  )
}
