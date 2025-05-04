"use client"
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const localizer = momentLocalizer(moment);

export default function AgendaUsuario() {
  const [eventos, setEventos] = useState([]);
  const [eventosCalendario, setEventosCalendario] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cargarAgenda = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const usuarioRef = doc(db, "Usuarios", user.uid);
      const usuarioSnap = await getDoc(usuarioRef);
      setUsuario(usuarioSnap.data());

      const agendaRef = collection(db, "Usuarios", user.uid, "AgendaUsuario");
      const agendaSnap = await getDocs(agendaRef);

      const eventosConDetalles = await Promise.all(
        agendaSnap.docs.map(async (registro) => {
          const data = registro.data();
          const eventoDoc = await getDoc(doc(db, "Eventos", data.idEvento));
          const eventoData = eventoDoc.data();

          return {
            id: data.idEvento,
            titulo: eventoData?.titulo,
            categoria: eventoData?.categoria,
            fecha: new Date(eventoData?.fecha?.seconds * 1000),
            hora: eventoData?.hora || "--:--",
            lugar: `${eventoData?.ciudad}, ${eventoData?.pais}`,
            imagen: eventoData?.imagen,
            start: new Date(eventoData?.fecha?.seconds * 1000),
            end: new Date(eventoData?.fecha?.seconds * 1000),
          };
        })
      );

      setEventos(eventosConDetalles);
      setEventosCalendario(eventosConDetalles);
    };

    cargarAgenda();
  }, []);

  const eliminarEvento = async (idEvento) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "Usuarios", user.uid, "AgendaUsuario", idEvento));
      setEventos(prev => prev.filter(e => e.id !== idEvento));
      setEventosCalendario(prev => prev.filter(e => e.id !== idEvento));
      Swal.fire("Eliminado", "El evento ha sido quitado de tu agenda", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Agenda de {usuario?.nombre || "..."}
      </h2>

      <div className="bg-white rounded shadow mb-6 p-4">
        <h3 className="font-semibold mb-2">Calendario</h3>
        <Calendar
          localizer={localizer}
          events={eventosCalendario}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
        />
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-4">Actividades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventos.map((e) => (
            <div
              key={e.id}
              className="border rounded-lg p-3 flex flex-col shadow hover:shadow-lg transition"
            >
              <img
                src={e.imagen || "/placeholder.png"}
                alt="evento"
                className="h-40 object-cover rounded mb-2"
              />
              <h4 className="text-lg font-bold">{e.titulo}</h4>
              <p><strong>Categoría:</strong> {e.categoria}</p>
              <p><strong>Lugar:</strong> {e.lugar}</p>
              <p><strong>Hora:</strong> {e.hora}</p>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => router.push(`/eventos/${e.id}`)}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
                >
                  Abrir
                </button>
                <button
                  onClick={() => eliminarEvento(e.id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
