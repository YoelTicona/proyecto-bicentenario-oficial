'use client'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { db, auth } from "../../firebase/firebase-config"
import { collection, addDoc, getDocs, doc, getDoc} from "firebase/firestore"
import SkeletonCard from '../../components/SkeletonCard'
import { useRouter } from 'next/navigation'
import { setDoc, serverTimestamp} from "firebase/firestore";
import Swal from "sweetalert2";

const registrarEnAgenda = async (evento) => {
  const user = getAuth().currentUser;
  if (!user) return Swal.fire("Error", "Debes iniciar sesión", "error");

  try {
    const agendaRef = doc(db, "Usuarios", user.uid, "AgendaUsuario", evento.id);
    await setDoc(agendaRef, {
      idEvento: evento.id,
      fechaInscripcion: serverTimestamp(),
      tituloEvento: evento.titulo,
      fechaEvento: evento.fecha,
      categoria: evento.categoria || "",
      notificacion: false,
      estado: "inscrito"
    });

    Swal.fire("¡Listo!", "Evento registrado en tu agenda", "success");
  } catch (err) {
    Swal.fire("Error al registrar", err.message, "error");
  }
};


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
  const [filtroExpositor, setFiltroExpositor] = useState('')
  const [filtroPatrocinador, setFiltroPatrocinador] = useState('')
  const [filtroPais, setFiltroPais] = useState('')
  const [filtroCiudad, setFiltroCiudad] = useState('')
  const [filtroTags, setFiltroTags] = useState('')

  const [paisesCiudades, setPaisesCiudades] = useState([])

  const [eventosDestacados, setEventosDestacados] = useState([])


  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(res => res.json())
      .then(data => setPaisesCiudades(data.data))
  }, [])

  const paises = paisesCiudades.map(p => p.country)
  const ciudades = nuevoEvento.pais
    ? paisesCiudades.find(p => p.country === nuevoEvento.pais)?.cities || []
    : []

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoEvento(prev => ({ ...prev, [name]: value }))
  }


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user)
        const docRef = doc(db, 'Usuarios', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setRol(docSnap.data().rol)
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Eventos"))

        const eventosConSubcolecciones = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data()

            // Cargar expositores
            const expositoresSnapshot = await getDocs(collection(doc.ref, "Expositores"))
            const expositores = expositoresSnapshot.docs.map(d => d.data())

            // Cargar patrocinadores
            const patrocinadoresSnapshot = await getDocs(collection(doc.ref, "Patrocinadores"))
            const patrocinadores = patrocinadoresSnapshot.docs.map(d => d.data())

            return {
              id: doc.id,
              ...data,
              expositores,
              patrocinadores
            }
          })
        )
        // Obtener los 5 eventos con mayor puntuación
        const destacados = [...eventosConSubcolecciones]
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, 5)
        setEventosDestacados(destacados)


        setEventos(eventosConSubcolecciones)

      } catch (error) {
        console.error("Error al obtener eventos:", error)
      }
    }

    obtenerEventos()
  }, [])
  const router = useRouter()


  let eventosFiltrados = eventos
  .filter(e =>
    e.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroCategoria || e.categoria?.toLowerCase() === filtroCategoria.toLowerCase()) &&
    (!filtroModalidad || e.modalidad?.toLowerCase() === filtroModalidad.toLowerCase()) &&
    (!filtroFecha || (
      (() => {
        const fechaEvento = e.fecha?.toDate ? e.fecha.toDate() : new Date(e.fecha)
        return fechaEvento.toISOString().slice(0, 10) === filtroFecha
      })()
    )) &&
    (!filtroCosto || Number(e.costo) <= Number(filtroCosto)) &&
    (!filtroPais || e.pais?.toLowerCase().includes(filtroPais.toLowerCase())) &&
    (!filtroCiudad || e.ciudad?.toLowerCase().includes(filtroCiudad.toLowerCase())) &&
    (!filtroExpositor || e.expositores?.some(ex =>
      typeof ex?.nombre === "string" &&
      ex.nombre.toLowerCase().includes(filtroExpositor.toLowerCase())
    )) &&
    (!filtroPatrocinador || e.patrocinadores?.some(p =>
      typeof p?.nombre === "string" &&
      p.nombre.toLowerCase().includes(filtroPatrocinador.toLowerCase())
    )) &&
    (!filtroTags || e.tags?.some(tag => {
      const tagsBuscados = filtroTags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
      return tagsBuscados.some(filtro =>
        tag.toLowerCase().includes(filtro)
      )
    }))
  )

  if (filtroOrden === 'puntuacion') {
    eventosFiltrados = [...eventosFiltrados].sort((a, b) => b.puntuacion - a.puntuacion)
  } else if (filtroOrden === 'fecha') {
    eventosFiltrados = [...eventosFiltrados].sort((a, b) => {
      const fechaA = a.fecha?.toDate ? a.fecha.toDate() : new Date(a.fecha)
      const fechaB = b.fecha?.toDate ? b.fecha.toDate() : new Date(b.fecha)
      return fechaB - fechaA
    })
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
  const limpiarFiltros = () => {
    setFiltroCategoria('')
    setFiltroModalidad('')
    setFiltroFecha('')
    setFiltroCosto('')
    setFiltroOrden('')
    setFiltroExpositor('')
    setFiltroPatrocinador('')
    setFiltroPais('')
    setFiltroCiudad('')
    setFiltroTags('')
    setBusqueda('')
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      {rol === 'usuario' && usuario && (
        <button className="fixed top-25 right-4 bg-orange-500 text-white rounded-full p-3 shadow-md z-50">🔔 Notificaciones</button>
      )}
      {rol === 'organizador' && (
        <button onClick={() => router.push('/organizador')} className="fixed top-25 right-4 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition z-50 cursor-pointer shadow-md">
          ➕ Crear evento
        </button>

      )}
      <h1 className="text-3xl font-bold mb-6">Eventos del Bicentenario</h1>
      <Slider {...sliderSettings}>
        {eventosDestacados.map(evento => (
          <div key={evento.id} className="rounded overflow-hidden">
            <img src={evento.imagen || '/anuncios/default.jpg'} className="rounded-md w-full h-64 object-cover" />
            <h4 className="text-lg fonnt-bold mt-2 text-center">{evento.titulo}</h4>
          </div>
        ))}
      </Slider>
      <div className="mt-8">
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar eventos..." className="w-full p-3 border rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        <select className="p-2 border rounded" onChange={e => setFiltroCategoria(e.target.value)}>

          <option value="">Categoria</option>
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

        <select className="p-2 border rounded" onChange={e => setFiltroModalidad(e.target.value)}>
          <option value="">Modalidad</option>
          <option value="virtual">Virtual</option>
          <option value="presencial">Presencial</option>
          <option value="hibrido">Híbrido</option>
        </select>

        <select className="p-2 border rounded" onChange={e => setFiltroOrden(e.target.value)}>
          <option value="">Ordenar</option>
          <option value="puntuacion">Más relevantes</option>
          <option value="fecha">Más recientes</option>
        </select>

        <input type="date" className="p-2 border rounded" onChange={e => setFiltroFecha(e.target.value)} />
        
        {/* NUEVOS FILTROS */}
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Expositor"
          onChange={e => setFiltroExpositor(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Patrocinador"
          onChange={e => setFiltroPatrocinador(e.target.value)}
        />
        {/* Filtro por país */}
<select
  className="p-2 border rounded"
  value={filtroPais}
  onChange={e => {
    setFiltroPais(e.target.value);
    setFiltroCiudad(''); // resetear ciudad
  }}
>
  <option value="">Filtrar por país</option>
  {paises.map((p, i) => (
    <option key={i} value={p}>{p}</option>
  ))}
</select>

{/* Filtro por ciudad */}
<select
  className="p-2 border rounded"
  value={filtroCiudad}
  onChange={e => setFiltroCiudad(e.target.value)}
  disabled={!filtroPais}
>
  <option value="">Filtrar por ciudad</option>
  {
    (paisesCiudades.find(p => p.country === filtroPais)?.cities || [])
      .map((c, i) => <option key={i} value={c}>{c}</option>)
  }
</select>

        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Filtrar por tags"
          onChange={e => setFiltroTags(e.target.value)}
        />
        <input type="number" className="p-2 border rounded" placeholder="Costo del Evento" onChange={e => setFiltroCosto(e.target.value)} />
      </div>

      <div className="flex justify-end mt-2">
      <button
        onClick={limpiarFiltros}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        Limpiar filtros
      </button>
    </div>

      <h2 className="text-3xl font-bold mb-6 py-3">Eventos</h2>
      <div className="grid sm:grid-cols-2 gap-6 mt-8">
      {eventos.length === 0 ? (
        Array(4).fill().map((_, i) => <SkeletonCard key={i} />)
      ) : eventosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 col-span-full mt-6">
          ❗ No se encontraron eventos con los filtros seleccionados.
        </p>
      ) : (
      eventosFiltrados.map(evento => (
          <div key={evento.id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={evento.imagen || "/anuncios/default.jpg"} className="rounded-md w-full h-48 object-cover" />
            <h3 className="text-xl font-semibold mt-2">{evento.titulo}</h3>

            {/* Tags */}
            {evento.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {evento.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {/* Categoría */}
            {evento.categoria && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>Categoría:</strong> {evento.categoria}
              </p>
            )}
            {/* Expositores */}
            {evento.expositores?.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Expositores:</strong> {evento.expositores.map(ex => ex.nombre).join(', ')}
              </p>
            )}
            {/* Patrocinadores */}
            {evento.patrocinadores?.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Patrocinadores:</strong> {evento.patrocinadores.map(p => p.nombre).join(', ')}
              </p>
            )}

            {/* Fecha*/}
            <p className="text-sm text-gray-500">
              <strong>Fecha/Lugar: </strong>
              {(() =>
                typeof evento.fecha?.toDate === 'function'
                  ? evento.fecha.toDate().toLocaleDateString("es-BO")
                  : new Date(evento.fecha).toLocaleDateString("es-BO")
              )()} - {evento.lugar || evento.ciudad || 'Sin lugar'}
            </p>
            {/* Direccion */}
            {evento.direccion && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Dirección:</strong> {evento.direccion}
              </p>
            )}
            {/* Modalidad */}
            {evento.modalidad && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Modalidad:</strong> {evento.modalidad}
              </p>
            )}
            {/* Costo */}
            {evento.costo && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Costo:</strong> <span className="text-red-600">{evento.costo}</span>
              </p>
            )}
            <button onClick={() => setEventoSeleccionado(evento)} className="mt-3 text-green-700 font-medium hover:underline">
              Ver más
            </button>
          </div>
        ))
      )}
    </div>


      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh] shadow-lg">
            <button
              onClick={() => setEventoSeleccionado(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">{eventoSeleccionado.titulo}</h2>

            {eventoSeleccionado.imagen && (
              <img
                src={eventoSeleccionado.imagen}
                alt="Imagen del evento"
                className="w-full h-64 object-cover rounded mb-4"
              />
            )}

            <p className="text-gray-700 mb-2"><strong>Descripción:</strong> {eventoSeleccionado.descripcion}</p>
            <p className="text-gray-700 mb-2"><strong>Fecha y hora:</strong> {new Date(eventoSeleccionado.fecha.toDate()).toLocaleString()}</p>
            <p className="text-gray-700 mb-2"><strong>Modalidad:</strong> {eventoSeleccionado.modalidad}</p>
            {eventoSeleccionado.link && (
              <p className="text-gray-700 mb-2"><strong>Enlace:</strong> <a href={eventoSeleccionado.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{eventoSeleccionado.link}</a></p>
            )}
            <p className="text-gray-700 mb-2"><strong>Dirección:</strong> {eventoSeleccionado.direccion}</p>
            <p className="text-gray-700 mb-2"><strong>Ciudad:</strong> {eventoSeleccionado.ciudad}</p>
            <p className="text-gray-700 mb-2"><strong>País:</strong> {eventoSeleccionado.pais}</p>
            {/* Mapa de Google Maps */}
            {eventoSeleccionado.latitud && eventoSeleccionado.longitud && (
              <div className="mt-4">
                <strong className="block text-gray-700 mb-1">Ubicación en mapa:</strong>
                <div className="rounded overflow-hidden">
                  <iframe
                    title="Mapa del evento"
                    width="100%"
                    height="300"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded border"
                    src={`https://maps.google.com/maps?q=${eventoSeleccionado.latitud},${eventoSeleccionado.longitud}&z=15&output=embed`}
                  ></iframe>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${eventoSeleccionado.latitud},${eventoSeleccionado.longitud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  📍 Abrir en Google Maps
                </a>
              </div>
            )}

            <p className="text-gray-700 mb-2"><strong>Categoría:</strong> {eventoSeleccionado.categoria}</p>
            <p className="text-gray-700 mb-2"><strong>Costo:</strong> {eventoSeleccionado.costo ? `Bs. ${eventoSeleccionado.costo}` : 'Gratuito'}</p>

            {/* Etiquetas */}
            {eventoSeleccionado.tags?.length > 0 && (
              <div className="mb-2">
                <strong className="block text-gray-700">Etiquetas:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {eventoSeleccionado.tags.map((tag, idx) => (
                    <span key={idx} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expositores */}
            {eventoSeleccionado.expositores?.length > 0 && (
              <div className="mb-2">
                <strong className="block text-gray-700">Expositores:</strong>
                <ul className="list-disc list-inside text-gray-700">
                  {eventoSeleccionado.expositores.map((ex, idx) => (
                    <li key={idx}>{ex.nombre}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Patrocinadores */}
            {eventoSeleccionado.patrocinadores?.length > 0 && (
              <div className="mb-2">
                <strong className="block text-gray-700">Patrocinadores:</strong>
                <ul className="list-disc list-inside text-gray-700">
                  {eventoSeleccionado.patrocinadores.map((p, idx) => (
                    <li key={idx}>{p.nombre}</li>
                  ))}
                </ul>
              </div>

            )}
            <button
              onClick={() => registrarEnAgenda(eventoSeleccionado)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Registrar en mi Agenda
            </button>
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