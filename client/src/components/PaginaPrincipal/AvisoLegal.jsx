'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AvisoLegal() {
  const [mostrarAviso, setMostrarAviso] = useState(true)

  if (!mostrarAviso) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 w-full bg-[#1d4f3f] text-white px-6 py-4 text-sm z-50 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className="mb-2 sm:mb-0 text-center">
          Al continuar navegando aceptas nuestros{' '}
          <Link href="/terminos" className="underline hover:text-yellow-300">Términos y Condiciones</Link>{' '}
          y nuestra{' '}
          <Link href="/privacidad" className="underline hover:text-yellow-300">Política de Privacidad</Link>.
        </p>

        <button
          onClick={() => setMostrarAviso(false)}
          className="mt-2 sm:mt-0 bg-yellow-400 text-[#1d4f3f] font-bold px-4 py-1 rounded hover:bg-yellow-300"
        >
          Aceptar
        </button>
      </div>
    </motion.div>
  )
}
