'use client'

import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from 'next/image'
// Ejemplo en un componente para la bd
import { db,auth } from "../../firebase/firebase-config";
import { collection, addDoc,doc,getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'


//aqui terminamos de importar

const Eventos = () => {
  const [usuario, setUsuario] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    modalidad: '',
    costo: '',
    puntuacion: '1',
    ciudad: '',
    departamento: '',
    direccion: '',
    categoria: '',

  });
  const [rol, setRol] = useState(null)

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
      {/*añadi esto para la vista del admin caso prueba*/}
      {rol === 'organizador' && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition z-50"
        >
          ➕ Crear evento
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



      {/* Modal de añadir evento */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setMostrarFormulario(false)}
            >
              ✖
            </button>

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
                  onChange={(e) =>
                    setNuevoEvento({ ...nuevoEvento, [campo]: e.target.value })
                  }
                />
              </div>
            ))}


            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
              onClick={async () => {
                if (
                  !nuevoEvento.titulo ||
                  !nuevoEvento.fecha ||
                  !nuevoEvento.modalidad ||
                  !nuevoEvento.ciudad
                ) {
                  alert("Por favor, completa todos los campos obligatorios.");
                  return;
                }

                try {
                  // 1️⃣ Guardar ubicación y obtener su ID
                  const ubicacionRef = await addDoc(collection(db, "Ubicaciones"), {
                    ciudad: nuevoEvento.ciudad,
                    departamento: nuevoEvento.departamento,
                    direccion: nuevoEvento.direccion,
                  });

                  // 2️⃣ Guardar evento con referencia a la ubicación
                  const eventoRef = await addDoc(collection(db, "Eventos"), {
                    titulo: nuevoEvento.titulo,
                    descripcion: nuevoEvento.descripcion,
                    fecha: nuevoEvento.fecha,
                    modalidad: nuevoEvento.modalidad,
                    costo: nuevoEvento.costo,
                    puntuacion: parseFloat(nuevoEvento.puntuacion),
                    categorias: [parseInt(nuevoEvento.categoriaId)],
                    id_ubicacion: ubicacionRef.id,
                  });

                  // 3️⃣ Crear subcolección de expositores (ejemplo vacío)
                  await addDoc(collection(eventoRef, "Expositores"), {
                    nombre: "Expositor por definir",
                    institucion: "",
                  });

                  // 4️⃣ Crear subcolección de patrocinadores (ejemplo vacío)
                  await addDoc(collection(eventoRef, "Patrocinadores"), {
                    nombre: "Patrocinador por definir",
                    empresa: "",
                  });

                  alert(" Evento creado correctamente con ubicación y subcolecciones");

                  // Limpiar
                  setMostrarFormulario(false);
                  setNuevoEvento({
                    titulo: '',
                    descripcion: '',
                    fecha: '',
                    modalidad: '',
                    costo: '',
                    puntuacion: '1',
                    ciudad: '',
                    lugar: '',
                    departamento: '',
                    categoriaId: '',
                  });
                } catch (error) {
                  console.error("Error al crear evento:", error);
                  alert(" Error al crear el evento");
                }
              }}


            >
              Guardar Evento
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Eventos;