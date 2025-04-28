'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

export default function EventosDestacados() {
  return (
    <section className="py-10 px-4" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-6 text-center">Eventos Destacados</h2>

      <div className="relative flex items-center justify-center">
        <button className="absolute left-0 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow">
          ⬅️
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white border p-4 shadow-md w-full max-w-xl text-center rounded"
        >
          <Image
            src="/portada.jpg"
            alt="Evento destacado"
            width={400}
            height={200}
            className="mx-auto rounded mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Concierto del Bicentenario</h3>
          <p className="text-sm mb-4">Un evento musical para celebrar nuestra historia y cultura. ¡No te lo pierdas!</p>
          <Link href="/eventos">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
              Ver más
            </button>
          </Link>
        </motion.div>

        <button className="absolute right-0 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow">
          ➡️
        </button>
      </div>
    </section>
  )
}
