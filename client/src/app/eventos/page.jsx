'use client'

import { useState } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from 'next/image'

const Eventos = () => {
  const [usuario] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)

  const eventosDestacados = [
    { id: 1, titulo: 'Gala del Bicentenario', foto: '/anuncios/anuncio_1.jpeg' },
    { id: 2, titulo: 'Exposición Histórica', foto: '/anuncios/anuncio_2.jpg' }
  ]

  const eventos = [
    {
      id: 1,
      titulo: 'Feria Cultural de Sucre',
      fecha: '2025-07-15',
      lugar: 'Sucre',
      descripcion: 'Una feria con muestras artísticas, danzas tradicionales y gastronomía nacional.',
      coordinadores: 'Ministerio de Cultura',
      foto: '/anuncios/anuncio_1.jpeg'
    },
    {
      id: 2,
      titulo: 'Conferencia de Historia Boliviana',
      fecha: '2025-06-12',
      lugar: 'La Paz',
      descripcion: 'Expertos disertan sobre los 200 años de historia republicana.',
      coordinadores: 'Universidad Mayor de San Andrés',
      foto: '/anuncios/anuncio_2.jpg'
    }
  ]

  const eventosFiltrados = eventos.filter(e =>
    e.titulo.toLowerCase().includes(busqueda.toLowerCase())
  )

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
        <button className="fixed top-25 right-4 bg-orange-500 text-white rounded-full p-3 shadow-md z-50">
          🔔 Notificaciones
        </button>
      )}

      <h1 className="text-3xl font-bold mb-6">Eventos del Bicentenario</h1>

      {/* Carrusel de destacados */}
      <Slider {...sliderSettings}>
        {eventosDestacados.map((evento) => (
          <div key={evento.id} className="rounded overflow-hidden">
            <img src={evento.foto} alt={evento.titulo} className="w-full h-64 object-cover rounded-lg" />
            <h3 className="text-xl mt-2 font-semibold text-center">{evento.titulo}</h3>
          </div>
        ))}
      </Slider>

      {/* Buscador y filtros */}
      <div className="mt-8">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar eventos..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* Lista de eventos */}
      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        {eventosFiltrados.map((evento) => (
          <div key={evento.id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={evento.foto} className="rounded-md w-full h-48 object-cover" />
            <h3 className="text-xl font-semibold mt-2">{evento.titulo}</h3>
            <p className="text-sm text-gray-500">{evento.fecha} - {evento.lugar}</p>
            <button
              onClick={() => setEventoSeleccionado(evento)}
              className="mt-3 text-green-700 font-medium hover:underline"
            >
              Ver más
            </button>
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setEventoSeleccionado(null)}
            >
              ✖
            </button>
            <img src={eventoSeleccionado.foto} className="rounded-lg mb-4" />
            <h2 className="text-2xl font-bold">{eventoSeleccionado.titulo}</h2>
            <p className="text-sm text-gray-500">{eventoSeleccionado.fecha} - {eventoSeleccionado.lugar}</p>
            <p className="mt-4">{eventoSeleccionado.descripcion}</p>
            <p className="text-sm text-gray-600 mt-4">Organizado por: {eventoSeleccionado.coordinadores}</p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md">
              Registrarse
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Eventos;