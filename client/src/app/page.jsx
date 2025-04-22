'use client'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useEffect, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import Countdown from "./../components/Countdown";
import Anuncios from "./../components/Anuncios";
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [mostrarAviso, setMostrarAviso] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
    const aceptado = localStorage.getItem('terminosAceptados')
    setMostrarAviso(!aceptado)
  }, [])

  const aceptarAviso = () => {
    localStorage.setItem('terminosAceptados', 'true')
    setMostrarAviso(false)
  }

  return (
    <div className="space-y-10 relative">
      {/* HERO DE PRESENTACIÓN */}
      <section
        data-aos="fade-up"
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white dark:text-white clip-bicentenario transition-colors duration-300"
        style={{ backgroundImage: "url('/portada_oscuro.jpg')" }}
      >
        <div className="absolute inset-0 bg-opacity-30"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-shadow-lg fade-in-up">Bicentenario de Bolivia</h1>
          <p className="text-xl mt-2 text-shadow fade-in-up fade-delay-1">
            “200 años de lucha, identidad y esplendor. ¡Celebremos juntos el Bicentenario de Bolivia!"
          </p>
          <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg">
            Ver eventos
          </button>
        </div>
      </section>

      <Countdown />

      <section className="py-5 px-4" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Eventos Destacados</h2>
        <div className="relative flex items-center justify-center">
          <button className="absolute left-0 bg-gray-200 p-2 rounded-full shadow">⬅️</button>
          <div className="bg-white border p-4 shadow-md w-full max-w-xl text-center">
            <Image src="/portada.jpg" alt="Evento" width={400} height={200} className="mx-auto rounded mb-4" />
            <p className="mb-2">Descripción del evento destacado.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Ver más</button>
          </div>
          <button className="absolute right-0 bg-gray-200 p-2 rounded-full shadow">➡️</button>
        </div>
      </section>

      <section className="py-10 px-4" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Línea de Tiempo</h2>
        <div className="overflow-x-auto whitespace-nowrap border-t border-b py-4">
          {[1991, 2000, 2002, 2024, 2025].map((year) => (
            <span key={year} className="inline-block mx-4 text-lg font-semibold">
              ⏺️ {year}
            </span>
          ))}
        </div>
      </section>

      <Anuncios />

      <section className="py-10 px-4 grid md:grid-cols-2 gap-6" data-aos="fade-up">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Normativa</h2>
          {[{
            title: 'Plan Estrategico Nacional del Bicentenario',
            desc: 'Documento que establece las metas, ejes y líneas de acción para la celebración del Bicentenario de Bolivia.',
            file: 'https://bicentenario.bo/wp-content/uploads/2024/06/PLAN-EST-NAL-BICENTENARIO.pdf',
          }, {
            title: 'Decreto Supremo N°4457',
            desc: 'Decreto que instituye la organización, planificación y ejecución del Plan Nacional del Bicentenario.',
            file: 'https://bicentenario.bo/wp-content/uploads/2024/03/Decreto-Sup-N%C2%B0-4457.pdf',
          }, {
            title: 'Ley del Bicentenario N°1347',
            desc: 'Ley que declara el año 2025 como el Año del Bicentenario de Bolivia y establece los principios de su conmemoración.',
            file: 'https://bicentenario.bo/wp-content/uploads/2024/03/LEY-N%C2%B0-1347-Ley-del-Bicentenario.pdf',
          }].map((item, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded shadow flex items-center">
              <Image src="/pdf_ico.png" alt="PDF" width={60} height={60} className="mr-4" />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm mb-2">{item.desc}</p>
                <Link href={item.file} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  Descargar PDF
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Marco Legal</h2>
          {[{
            title: 'Manual de Uso 200 BICENTENARIO DE BOLIVIA',
            desc: 'Guía oficial para el uso correcto del logotipo y marca del Bicentenario en todos los niveles institucionales.',
            file: 'https://bicentenario.bo/wp-content/uploads/2025/02/ManualDeUso_200_BICENTENARIOBOLIVIA-23-2.pdf',
          }, {
            title: 'Decreto Supremo N° 4900',
            desc: 'Norma que reglamenta el uso de la imagen oficial del Bicentenario en eventos y documentos gubernamentales.',
            file: 'https://bicentenario.bo/wp-content/uploads/2025/02/DS-4900-1.pdf',
          }, {
            title: 'Manual de identidad del gobierno',
            desc: 'Documento que define los lineamientos gráficos e institucionales de la imagen del Gobierno en el contexto del Bicentenario.',
            file: 'https://bicentenario.bo/wp-content/uploads/2025/02/Manual_de_Identidad_Imagen_Gobierno_.pdf',
          }].map((item, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded shadow flex items-center">
              <Image src="/pdf_ico.png" alt="PDF" width={60} height={60} className="mr-4" />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm mb-2">{item.desc}</p>
                <Link href={item.file} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  Descargar PDF
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* AVISO DE TÉRMINOS Y PRIVACIDAD */}
      {mostrarAviso && (
        <div className="fixed bottom-0 left-0 w-full bg-[#1d4f3f] text-white px-6 py-4 text-sm z-50 animate-slide-up shadow-lg flex flex-col sm:flex-row justify-between items-center">
          <p className="mb-2 sm:mb-0">
            Al continuar navegando aceptas nuestros{' '}
            <Link href="/terminos" className="underline hover:text-yellow-300">Términos y Condiciones</Link>{' '}
            y nuestra{' '}
            <Link href="/privacidad" className="underline hover:text-yellow-300">Política de Privacidad</Link>.
          </p>
          <button
            onClick={aceptarAviso}
            className="mt-2 sm:mt-0 bg-yellow-400 text-[#1d4f3f] font-bold px-4 py-1 rounded hover:bg-yellow-300"
          >
            Aceptar
          </button>
        </div>
      )}
    </div>
  )
}
