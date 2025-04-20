'use client'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import Countdown from "./../components/Countdown";
import Anuncios from "./../components/Anuncios";
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    })
  }, [])
  return (
    <div className="space-y-10">
      {/* HERO DE PRESENTACIÓN */}
      
      <section
  data-aos="fade-up"
  className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white dark:text-white clip-bicentenario transition-colors duration-300"
  style={{ backgroundImage: "url('/portada_oscuro.jpg')" }}
>

        <div className="absolute inset-0 bg-opacity-30"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-shadow-lg fade-in-up">Bicentenario de Bolivia</h1>
          <p className="text-xl mt-2 text-shadow fade-in-up fade-delay-1">“200 años de lucha, identidad y esplendor. ¡Celebremos juntos el Bicentenario de Bolivia!"</p>
          <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg">
            Ver eventos
          </button>
        </div>
      </section>

      {/* === CUENTA REGRESIVA === */}
      <Countdown/>

      {/* === EVENTOS DESTACADOS === */}
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

      {/* === LÍNEA DE TIEMPO === */}
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

      {/* === ANUNCIOS === */}
      <Anuncios />

      {/* === NORMATIVA Y MARCO DEL BICENTENARIO === */}
      <section className="py-10 px-4 grid md:grid-cols-2 gap-6" data-aos="fade-up">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Normativa</h2>
          {[{
          title: 'Normativa',
          desc: 'Documento legal relacionado al bicentenario.',
          file: '#',
        }, {
          title: 'Marca del Bicentenario',
          desc: 'Uso correcto de marca e identidad gráfica.',
          file: '#',
        }].map((item, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded shadow flex items-center">
            <Image src="/pdf_ico.png" alt="PDF" width={60} height={60} className="mr-4" />
            <div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm mb-2">{item.desc}</p>
              <Link href={"https://bicentenario.bo/wp-content/uploads/2025/02/ManualDeUso_200_BICENTENARIOBOLIVIA-23-2.pdf"} className="text-blue-500 hover:underline">Descargar PDF</Link>
            </div>
          </div>
        ))}
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Marco Legal</h2>
          {[{
          title: 'Normativa',
          desc: 'Documento legal relacionado al bicentenario.',
          file: '',
        }, {
          title: 'Marca del Bicentenario',
          desc: 'Uso correcto de marca e identidad gráfica.',
          file: '#',
        }].map((item, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded shadow flex items-center">
            <Image src="/pdf_ico.png" alt="PDF" width={60} height={60} className="mr-4" />
            <div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm mb-2">{item.desc}</p>
              <Link href={"https://bicentenario.bo/wp-content/uploads/2025/02/ManualDeUso_200_BICENTENARIOBOLIVIA-23-2.pdf"} className="text-blue-500 hover:underline">Descargar PDF</Link>
            </div>
          </div>
        ))}
        </div>
        
      </section>


    </div>
  );
}
