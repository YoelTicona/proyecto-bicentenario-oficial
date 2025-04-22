'use client'

import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from 'next/image'
import { db, auth } from "../../firebase/firebase-config"
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from 'firebase/auth'

const Eventos = () => {
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null)
  const [eventos, setEventos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '', descripcion: '', fecha: '', modalidad: '', costo: '', puntuacion: '1',
    ciudad: '', departamento: '', direccion: '', categoriaId: ''
  })
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroModalidad, setFiltroModalidad] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroCosto, setFiltroCosto] = useState('')
  const [filtroOrden, setFiltroOrden] = useState('')

  const eventosDestacados = [
    { id: 1, titulo: 'Gala del Bicentenario', imagen: '/anuncios/anuncio_1.jpeg' },
    { id: 2, titulo: 'Exposición Histórica', imagen: '/anuncios/anuncio_2.jpg' }
  ]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user)
        const docRef = doc(db, 'Usuarios', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setRol(docSnap.data().rol)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const obtenerEventos = async () => {
      const querySnapshot = await getDocs(collection(db, "Eventos"))
      const eventosFirebase = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setEventos(eventosFirebase)
    }
    obtenerEventos()
  }, [])

  let eventosFiltrados = eventos.filter(e =>
    e.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroCategoria || e.categorias?.includes(parseInt(filtroCategoria))) &&
    (!filtroModalidad || e.modalidad === filtroModalidad) &&
    (!filtroFecha || new Date(e.fecha).toISOString().slice(0, 10) === filtroFecha) &&
    (!filtroCosto || Number(e.costo) <= Number(filtroCosto))
  )

  if (filtroOrden === 'puntuacion') {
    eventosFiltrados = eventosFiltrados.sort((a, b) => b.puntuacion - a.puntuacion)
  } else if (filtroOrden === 'fecha') {
    eventosFiltrados = eventosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  const sliderSettings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000 }

  const handleGuardarEvento = async () => {
    if (!nuevoEvento.titulo || !nuevoEvento.fecha || !nuevoEvento.modalidad || !nuevoEvento.ciudad) {
      alert("Por favor, completa todos los campos obligatorios.")
      return
    }
    try {
      const ubicacionRef = await addDoc(collection(db, "Ubicaciones"), {
        ciudad: nuevoEvento.ciudad,
        departamento: nuevoEvento.departamento,
        direccion: nuevoEvento.direccion,
      })
      const eventoRef = await addDoc(collection(db, "Eventos"), {
        titulo: nuevoEvento.titulo,
        descripcion: nuevoEvento.descripcion,
        fecha: nuevoEvento.fecha,
        modalidad: nuevoEvento.modalidad,
        costo: nuevoEvento.costo,
        puntuacion: parseFloat(nuevoEvento.puntuacion),
        categorias: [parseInt(nuevoEvento.categoriaId)],
        id_ubicacion: ubicacionRef.id,
      })
      await addDoc(collection(eventoRef, "Expositores"), { nombre: "Expositor por definir" })
      await addDoc(collection(eventoRef, "Patrocinadores"), { nombre: "Patrocinador por definir" })
      alert("Evento creado correctamente")
      setMostrarFormulario(false)
    } catch (error) {
      console.error("Error al crear evento:", error)
      alert("Error al crear el evento")
    }
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      {usuario && (
        <button className="fixed top-25 right-4 bg-orange-500 text-white rounded-full p-3 shadow-md z-50">🔔 Notificaciones</button>
      )}
      {rol === 'organizador' && (
        <button onClick={() => setMostrarFormulario(true)} className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition z-50">➕ Crear evento</button>
      )}
      <h1 className="text-3xl font-bold mb-6">Eventos del Bicentenario</h1>
      <Slider {...sliderSettings}>
        {eventosDestacados.map(evento => (
          <div key={evento.id} className="rounded overflow-hidden">
            <img src={evento.imagen} className="rounded-md w-full h-64 object-cover" />
            <h3 className="text-xl mt-2 font-semibold text-center">{evento.titulo}</h3>
          </div>
        ))}
      </Slider>
      <div className="mt-8">
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar eventos..." className="w-full p-3 border rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        <select className="p-2 border rounded" onChange={e => setFiltroCategoria(e.target.value)}><option value="">Categoría</option><option value="1">Infantil</option><option value="2">Historia</option><option value="3">Cultura</option></select>
        <select className="p-2 border rounded" onChange={e => setFiltroModalidad(e.target.value)}><option value="">Modalidad</option><option value="virtual">Virtual</option><option value="presencial">Presencial</option></select>
        <input type="date" className="p-2 border rounded" onChange={e => setFiltroFecha(e.target.value)} />
        <input type="number" className="p-2 border rounded" placeholder="Máximo costo" onChange={e => setFiltroCosto(e.target.value)} />
        <select className="p-2 border rounded" onChange={e => setFiltroOrden(e.target.value)}><option value="">Ordenar</option><option value="puntuacion">Más Relevantes</option><option value="fecha">Más recientes</option></select>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        {eventosFiltrados.map(evento => (
          <div key={evento.id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={evento.foto || evento.imagen || "/anuncios/default.jpg"} className="rounded-md w-full h-48 object-cover" />
            <h3 className="text-xl font-semibold mt-2">{evento.titulo}</h3>
            <p className="text-sm text-gray-500">{new Date(evento.fecha).toLocaleDateString()} - {evento.ciudad || evento.lugar}</p>
            <button onClick={() => setEventoSeleccionado(evento)} className="mt-3 text-green-700 font-medium hover:underline">Ver más</button>
          </div>
        ))}
      </div>

      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setEventoSeleccionado(null)}>✖</button>
            <img src={eventoSeleccionado.foto || eventoSeleccionado.imagen || "/anuncios/default.jpg"} className="rounded-lg mb-4" />
            <h2 className="text-2xl font-bold">{eventoSeleccionado.titulo}</h2>
            <p className="text-sm text-gray-500">{new Date(eventoSeleccionado.fecha).toLocaleDateString()} - {eventoSeleccionado.ciudad || eventoSeleccionado.lugar}</p>
            <p className="mt-4">{eventoSeleccionado.descripcion}</p>
            <p className="text-sm text-gray-600 mt-4">Organizado por: {eventoSeleccionado.coordinadores || 'Sin información'}</p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md">Registrarse</button>
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setMostrarFormulario(false)}>✖</button>
            <h2 className="text-2xl font-bold mb-4">Crear Nuevo Evento</h2>
            {[
              { label: "Título", campo: "titulo" },
              { label: "Descripción", campo: "descripcion" },
              { label: "Fecha (YYYY-MM-DD)", campo: "fecha" },
              { label: "Modalidad", campo: "modalidad" },
              { label: "Costo", campo: "costo" },
              { label: "Puntuación", campo: "puntuacion" },
              { label: "Ciudad", campo: "ciudad" },
              { label: "Departamento", campo: "departamento" },
              { label: "Dirección", campo: "direccion" },
              { label: "Categoría (ID numérico)", campo: "categoriaId" },
            ].map(({ label, campo }) => (
              <div key={campo} className="mb-2">
                <label className="block mb-1">{label}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={nuevoEvento[campo] || ''}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, [campo]: e.target.value })}
                />
              </div>
            ))}
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded" onClick={handleGuardarEvento}>
              Guardar Evento
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Eventos