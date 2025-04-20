'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1e1f25] to-[#2b2c32] flex flex-col items-center justify-center px-4 text-white">
      <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
        {/* Luna + texto agrupado */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start">
          <div className="relative mb-4">
            <div className="w-60 h-60 bg-gradient-to-tr from-gray-400 to-gray-200 rounded-full shadow-inner flex items-center justify-center text-6xl font-bold text-[#2b2c32]">
              404
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1">Hmmm...</h2>
          <p className="text-gray-400 max-w-xs">
            Parece que esta página no existe, tal vez un desarrollador se quedó dormido 💤
          </p>

          <div className="flex justify-center md:justify-start gap-4 mt-6">
            <Link
              href="/"
              className="bg-[#f7901e] hover:bg-[#e57b04] text-white px-5 py-2 rounded-full font-semibold"
            >
              Inicio
            </Link>
            <Link
              href="/contactos"
              className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-[#2b2c32] font-semibold"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Astronauta */}
        <div className="w-64 md:w-96 animate-float">
          <Image src="/astronauta.png" width={500} height={500} alt="Astronauta flotando" />
        </div>
      </div>
    </div>
  )
}