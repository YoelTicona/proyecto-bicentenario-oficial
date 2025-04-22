'use client'

import { useState, useEffect } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from 'next/image'
import { db } from "../../firebase/firebase-config"
import { collection, addDoc, getDocs } from "firebase/firestore"
import SkeletonCard from '../../components/SkeletonCard'
import { useRouter } from 'next/navigation'



const Eventos = () => {
  const [usuario] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '', descripcion: '', fecha: '', modalidad: '', costo: '', puntuacion: '1',
    ciudad: '', departamento: '', direccion: '', categoria: ''
  })

  const eventosDestacados = [
    { id: 1, titulo: 'Gala del Bicentenario', imagen: '/anuncios/anuncio_1.jpeg' },
    { id: 2, titulo: 'Exposición Histórica', imagen: '/anuncios/anuncio_2.jpg' }
  ]

  const [eventos, setEventos] = useState([])
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroModalidad, setFiltroModalidad] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroCosto, setFiltroCosto] = useState('')
  const [filtroOrden, setFiltroOrden] = useState('')

  useEffect(() => {
    const obtenerEventos = async () => {
      const querySnapshot = await getDocs(collection(db, "Eventos"))
      const eventosFirebase = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setEventos(eventosFirebase)
    }
    obtenerEventos()
  }, [])
  const router = useRouter()


  let eventosFiltrados = eventos.filter(e =>
    e.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroCategoria || e.categoria === filtroCategoria) &&
    (!filtroModalidad || e.modalidad === filtroModalidad) &&
    (!filtroFecha || (() => typeof e.fecha?.toDate === 'function' ? e.fecha.toDate().toISOString().slice(0, 10) : new Date(e.fecha).toISOString().slice(0, 10))() === filtroFecha) &&
    (!filtroCosto || Number(e.costo) <= Number(filtroCosto))
  )

  if (filtroOrden === 'puntuacion') {
    eventosFiltrados = eventosFiltrados.sort((a, b) => b.puntuacion - a.puntuacion)
  } else if (filtroOrden === 'fecha') {
    eventosFiltrados = eventosFiltrados.sort((a, b) => new Date(typeof b.fecha?.toDate === 'function' ? b.fecha.toDate() : b.fecha) - new Date(typeof a.fecha?.toDate === 'function' ? a.fecha.toDate() : a.fecha))
  }

  const sliderSettings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000 }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      {usuario && (
        <>
          <button className="fixed top-25 right-4 bg-orange-500 text-white rounded-full p-3 shadow-md z-50">🔔 Notificaciones</button>
          <button onClick={() => router.push('/organizador')} className="fixed top-24 right-4 bg-green-600 text-white rounded-full p-3 shadow-md z-50 cursor-pointer">
  ➕ Añadir Evento
</button>

        </>
      )}
      <h1 className="text-3xl font-bold mb-6">Eventos del Bicentenario</h1>

      <Slider {...sliderSettings}>
        {eventosDestacados.map(evento => (
          <div key={evento.id} className="rounded overflow-hidden">
            <img src={evento.imagen || "/anuncios/default.jpg"} className="rounded-md w-full h-48 object-cover" />
            <h3 className="text-xl mt-2 font-semibold text-center">{evento.titulo}</h3>
          </div>
        ))}
      </Slider>

      <div className="mt-8">
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar eventos..." className="w-full p-3 border rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        <select className="p-2 border rounded" onChange={e => setFiltroCategoria(e.target.value)}>
          <option value="">Categoría</option><option value="infantil">Infantil</option><option value="musical">Musical</option><option value="de adultos">De Adultos</option><option value="cívico">Cívico</option><option value="historia">Historia</option><option value="cultura">Cultura</option>
        </select>
        <select className="p-2 border rounded" onChange={e => setFiltroModalidad(e.target.value)}>
          <option value="">Modalidad</option><option value="virtual">Virtual</option><option value="presencial">Presencial</option><option value="hibrido">Híbrido</option>
        </select>
        <input type="date" className="p-2 border rounded" onChange={e => setFiltroFecha(e.target.value)} />
        <input type="number" className="p-2 border rounded" placeholder="Máximo costo" onChange={e => setFiltroCosto(e.target.value)} />
        <select className="p-2 border rounded" onChange={e => setFiltroOrden(e.target.value)}>
          <option value="">Ordenar</option><option value="puntuacion">Más Relevantes</option><option value="fecha">Más recientes</option>
        </select>
      </div>

      

      <div className="grid sm:grid-cols-2 gap-6 mt-8">
  {eventos.length === 0
    ? Array(4).fill().map((_, i) => <SkeletonCard key={i} />)
    : eventosFiltrados.map(evento => (
        <div key={evento.id} className="bg-white p-4 rounded-lg shadow-md">
          <img src={evento.imagen || "/anuncios/default.jpg"} className="rounded-md w-full h-48 object-cover" />
          <h3 className="text-xl font-semibold mt-2">{evento.titulo}</h3>
          <p className="text-sm text-gray-500">
            {(() =>
              typeof evento.fecha?.toDate === 'function'
                ? evento.fecha.toDate().toLocaleDateString("es-BO")
                : new Date(evento.fecha).toLocaleDateString("es-BO")
            )()} - {evento.lugar || evento.ciudad || 'Sin lugar'}
          </p>
          <button onClick={() => setEventoSeleccionado(evento)} className="mt-3 text-green-700 font-medium hover:underline">
            Ver más
          </button>
        </div>
      ))}
</div>


      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setEventoSeleccionado(null)}>✖</button>
            <img src={eventoSeleccionado.imagen || "/anuncios/default.jpg"} className="rounded-lg mb-4" />
            <h2 className="text-2xl font-bold">{eventoSeleccionado.titulo}</h2>
            <p className="text-sm text-gray-500">{(() => typeof eventoSeleccionado.fecha?.toDate === 'function' ? eventoSeleccionado.fecha.toDate().toLocaleDateString("es-BO") : new Date(eventoSeleccionado.fecha).toLocaleDateString("es-BO"))()} - {eventoSeleccionado.lugar || eventoSeleccionado.ciudad}</p>
            <p className="mt-4">{eventoSeleccionado.descripcion}</p>
            <p className="text-sm text-gray-600 mt-4">Organizado por: {eventoSeleccionado.coordinadores || "Sin información"}</p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md">Registrarse</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Eventos
