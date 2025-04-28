'use client'

import { motion } from 'framer-motion'

export default function LineaDeTiempo() {
  const eventos = [1991, 2000, 2002, 2024, 2025]

  return (
    <section className="py-10 px-4" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-6 text-center">Línea de Tiempo</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="overflow-x-auto whitespace-nowrap border-t border-b py-6 flex items-center justify-center gap-10"
      >
        {eventos.map((year) => (
          <div key={year} className="flex flex-col items-center">
            <div className="w-8 h-8 bg-green-600 rounded-full mb-2"></div>
            <span className="text-lg font-semibold">{year}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
