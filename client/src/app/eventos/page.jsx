'use client'

import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from 'next/image'
import { db, auth } from "../../firebase/firebase-config"
import { collection, addDoc, doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from 'firebase/auth'

const Eventos = () => {
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)

  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '', descripcion: '', fecha: '', modalidad: '', costo: '', puntuacion: '1',
    ciudad: '', departamento: '', direccion: '', categoria: '',
    expositores: [''], patrocinadores: ['']
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevoEvento(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user)
        const docRef = doc(db, 'Usuarios', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) setRol(docSnap.data().rol)
      }
    })
    return () => unsubscribe()
  }, [])

  const crearEvento = async () => {
    const { titulo, descripcion, fecha, modalidad, costo, puntuacion,
            ciudad, departamento, direccion, categoria,
            expositores, patrocinadores } = nuevoEvento

    if (!titulo || !fecha || !modalidad || !ciudad || !categoria) {
      alert("Por favor, completa todos los campos obligatorios.")
      return
    }

    try {
      const ubicacionRef = await addDoc(collection(db, "Ubicaciones"), { ciudad, departamento, direccion })
      const eventoRef = await addDoc(collection(db, "Eventos"), {
        titulo, descripcion, fecha, modalidad, costo,
        puntuacion: parseFloat(puntuacion),
        categoria,
        id_ubicacion: ubicacionRef.id
      })

      // Agregar múltiples expositores
      for (let nombre of expositores) {
        if (nombre.trim()) {
          await addDoc(collection(eventoRef, "Expositores"), { nombre })
        }
      }

      // Agregar múltiples patrocinadores
      for (let nombre of patrocinadores) {
        if (nombre.trim()) {
          await addDoc(collection(eventoRef, "Patrocinadores"), { nombre })
        }
      }

      alert("Evento creado exitosamente ")
      setNuevoEvento({ titulo: '', descripcion: '', fecha: '', modalidad: '', costo: '', puntuacion: '1', ciudad: '', departamento: '', direccion: '', categoria: '', expositores: [''], patrocinadores: [''] })
    } catch (err) {
      console.error("Error al crear evento:", err)
      alert("Error al guardar el evento")
    }
  }

  const handleArrayChange = (tipo, index, valor) => {
    const actualizado = [...nuevoEvento[tipo]]
    actualizado[index] = valor
    setNuevoEvento({ ...nuevoEvento, [tipo]: actualizado })
  }

  const agregarCampo = (tipo) => {
    setNuevoEvento({ ...nuevoEvento, [tipo]: [...nuevoEvento[tipo], ''] })
  }

  const eventosDestacados = [
    { id: 1, titulo: 'Gala del Bicentenario', foto: '/anuncios/anuncio_1.jpeg' },
    { id: 2, titulo: 'Exposición Histórica', foto: '/anuncios/anuncio_2.jpg' }
  ]

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      {usuario && (
        <button className="fixed top-24 right-4 bg-orange-500 text-white rounded-full p-3 shadow-md z-50">🔔 Notificaciones</button>
      )}

      {rol === 'organizador' && (
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Crear Evento</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {['titulo', 'descripcion', 'fecha', 'modalidad', 'costo', 'puntuacion', 'ciudad', 'departamento', 'direccion', 'categoria'].map((campo, i) => (
              <input key={i} name={campo} placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)} className="input" onChange={handleChange} value={nuevoEvento[campo]} />
            ))}

            {/* Expositores */}
            <div className="col-span-2">
              <p className="font-medium">Expositores:</p>
              {nuevoEvento.expositores.map((ex, i) => (
                <input key={i} value={ex} onChange={(e) => handleArrayChange('expositores', i, e.target.value)} placeholder={`Expositor ${i + 1}`} className="input my-1" />
              ))}
              <button type="button" onClick={() => agregarCampo('expositores')} className="text-blue-600">+ Añadir expositor</button>
            </div>

            {/* Patrocinadores */}
            <div className="col-span-2">
              <p className="font-medium">Patrocinadores:</p>
              {nuevoEvento.patrocinadores.map((pat, i) => (
                <input key={i} value={pat} onChange={(e) => handleArrayChange('patrocinadores', i, e.target.value)} placeholder={`Patrocinador ${i + 1}`} className="input my-1" />
              ))}
              <button type="button" onClick={() => agregarCampo('patrocinadores')} className="text-blue-600">+ Añadir patrocinador</button>
            </div>
          </div>

          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={crearEvento}>Crear evento</button>
        </section>
      )}

      <h1 className="text-3xl font-bold mb-6">Eventos del Bicentenario</h1>
      <Slider {...sliderSettings}>
        {eventosDestacados.map((evento) => (
          <div key={evento.id} className="rounded overflow-hidden">
            <img src={evento.foto} alt={evento.titulo} className="w-full h-64 object-cover rounded-lg" />
            <h3 className="text-xl mt-2 font-semibold text-center">{evento.titulo}</h3>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Eventos;
