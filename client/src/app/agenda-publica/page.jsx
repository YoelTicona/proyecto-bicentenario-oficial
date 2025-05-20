'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../..//firebase/firebase-config';
import Link from 'next/link';

export default function AgendaPublica() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const obtenerEventos = async () => {
      const querySnapshot = await getDocs(collection(db, 'Eventos'));
      const eventosObtenidos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ordenar por fecha ascendente
    eventosObtenidos.sort((a, b) => {
        const fechaA = a.fecha?.toDate ? a.fecha.toDate() : new Date(a.fecha);
        const fechaB = b.fecha?.toDate ? b.fecha.toDate() : new Date(b.fecha);
        return fechaB - fechaA;
    });
    setEventos(eventosObtenidos);
    };
    obtenerEventos();
  }, []);


  return (
    <div className="min-h-screen bg-[#fffce7] text-black px-6 py-8 relative">
      <h1 className="text-3xl font-bold text-center mb-6">Agenda Pública</h1>

      <Link href="/iniciar-sesion/crear-cuenta" className="fixed top-24 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg z-50">
        + Crea tu agenda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {eventos.map((evento, index) => {

  return (
    <div key={evento.id} className="relative bg-white rounded-xl shadow p-4 transition duration-300 hover:shadow-xl hover:scale-[1.01]">
      <div className="flex items-center gap-4">
        <img
          src={evento.imagen}
          alt="Foto"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="text-xl font-bold">{evento.titulo}</p>
          <p className="text-gray-500">{evento.descripcion}</p>
          <p>{evento.fecha?.toDate().toLocaleString()}</p>
          
        </div>
      </div>

      {/* Número de orden con animación */}
      <span className="absolute bottom-2 right-4 text-red-600 text-lg font-bold transition-transform duration-300 group-hover:scale-125">
        {index + 1}
      </span>
    </div>
  );
})}

      </div>
    </div>
  );
}
