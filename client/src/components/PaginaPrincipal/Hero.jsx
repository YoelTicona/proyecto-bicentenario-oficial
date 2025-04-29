'use client'
import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white dark:text-white clip-bicentenario transition-colors duration-300"
      style={{ backgroundImage: "url('/portada_oscuro.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-5xl font-bold text-shadow-lg">Bicentenario de Bolivia</h1>
        <p className="text-xl mt-4 mb-6 text-shadow">
          “200 años de lucha, identidad y esplendor. ¡Celebremos juntos el Bicentenario!”
        </p>
        <Link href="eventos" className="inline-block">
          <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg">
            Ver eventos
          </button>
        </Link>
      </motion.div>
    </section>
  )
}