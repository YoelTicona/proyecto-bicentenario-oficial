'use client'

import { useEffect, useState, useRef } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase-config'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function EventosDestacados() {
  const [eventos, setEventos] = useState([])
  const carouselRef = useRef(null)

  useEffect(() => {
    const obtenerEventosDestacados = async () => {
      try {
        const eventosRef = collection(db, "Eventos");
        const q = query(eventosRef, where("categoria", "==", "Academico"));
        const querySnapshot = await getDocs(q);
  
        const eventosFiltrados = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setEventos(eventosFiltrados);
      } catch (error) {
        console.error("Error al obtener eventos académicos:", error);
      }
    };
  
    obtenerEventosDestacados();
  }, []);

  // 🎞 Autoplay cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' })

        // Vuelve al inicio si llega al final
        if (
          carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
          carouselRef.current.scrollWidth
        ) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [eventos])

  return (
    <section className="py-12 px-6 bg-[#fff8e1]">
      <h2 className="text-2xl font-bold text-center mb-2">🎉 Eventos Destacados</h2>
      <p className="text-center italic mb-8 text-gray-600">Celebrando la historia y cultura boliviana</p>

      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
      >


        {eventos.map((evento) => (
          <motion.div
          key={evento.id}
          whileHover={{ scale: 1.05 }}
          className="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-xl shadow-lg p-4 flex-shrink-0"
        >
            <Image
              src={evento.imagen || '/placeholder.jpg'}
              alt={evento.titulo}
              width={400}
              height={250}
              className="rounded-md mb-4 object-cover h-48 w-full"
            />
            <h3 className="text-lg font-semibold">{evento.titulo}</h3>
            <p className="text-sm text-gray-700 mt-2 mb-4 line-clamp-3">{evento.descripcion}</p>
            <Link href={`/eventos/${evento.id}`}>
              <span className="text-blue-600 hover:underline">Ver más →</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
