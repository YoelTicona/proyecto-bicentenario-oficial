"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { motion } from "framer-motion";
import Modal from "../Modal";
import { BookMarked } from "lucide-react";

export default function LineaDeTiempo() {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerEventos = async () => {
      const querySnapshot = await getDocs(collection(db, "EventosHistoricos"));
      const eventosArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      eventosArray.sort((a, b) => a.anio - b.anio);
      setEventos(eventosArray);
    };
    obtenerEventos();
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-black">
        <BookMarked className="text-yellow-800" size={32} />
        Línea de Tiempo
      </h2>
      <p className="text-center text-sm text-black italic mb-2">
        Toca los puntos para explorar eventos históricos de Bolivia
      </p>

      <div
        className="bg-cover bg-center px-4 py-10 rounded-3xl shadow-xl border-1 border-yellow-500 mt-6"
        style={{ backgroundImage: "url('/FondoLineaTiempoOscuro.jpg')" }}
      >

        <div className="overflow-x-auto">
          <div className="relative flex items-center gap-12 px-8 min-w-[800px] md:min-w-full pb-10">
            {/* Línea base */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-black z-0 rounded-full" />

            {/* Puntos */}
            {eventos.map((evento, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative z-10 text-center cursor-pointer group rounded-full hover:scale-110 hover:shadow-[0_0_10px_4px_rgba(255,255,255,0.4)]"
                onClick={() => setEventoSeleccionado(evento)}
              >
                <div className="w-8 h-8 bg-[#a67c52] rounded-full shadow-lg border-2 border-white mx-auto transform transition-transform group-hover:scale-110">
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-max px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Haz clic para ver más
                  </div>
                </div>
                <p className="text-lg font-semibold text-white mt-2">{evento.anio}</p>
                <button className="mt-1 text-[10px] bg-white text-[#a67c52] px-2 py-0.5 rounded-full shadow-sm hover:bg-yellow-200 transition">
                  Ver más
                </button>
              </motion.div>

            ))}

            {/* Flecha decorativa */}
            <div className="absolute top-6 right-0 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-black z-10" />
          </div>
        </div>

        {/* Modal de detalles */}
        <Modal
          isOpen={!!eventoSeleccionado}
          onClose={() => setEventoSeleccionado(null)}
          evento={eventoSeleccionado}
        />
      </div>
    </>
  );

}