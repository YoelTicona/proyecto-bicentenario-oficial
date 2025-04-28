'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AcercaDe() {
    const [mostrarTexto, setMostrarTexto] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMostrarTexto(true)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className=" bg-zinc-100 max-w-6xl w-full space-y-12 px-4 py-12">

                {/* Presentación */}
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1d4f3f] mb-6 animate-fade-in">
                        Proyecto Bicentenario Bolivia
                    </h1>
                    {mostrarTexto && (
                        <p className="text-gray-700 text-lg md:text-xl leading-relaxed animate-fade-in transition-opacity duration-700">
                            Celebramos 200 años de historia, cultura, identidad y resistencia.
                            El Proyecto Bicentenario reúne eventos, actividades educativas, artísticas y cívicas para honrar el legado de Bolivia y proyectarlo hacia el futuro.
                        </p>
                    )}
                </section>

                {/* Galería de imágenes */}
                <section className="grid md:grid-cols-3 gap-6 animate-fade-in">
                    <div className="overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform">
                        <Image src="/acercade1.webp" alt="Historia Bolivia" width={600} height={400} className="w-full h-auto object-cover" />
                    </div>
                    <div className="overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform">
                        <Image src="/acercade2.jpg" alt="Evento Bicentenario" width={600} height={400} className="w-full h-auto object-cover" />
                    </div>
                    <div className="overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform">
                        <Image src="/acercade3.png" alt="Cultura Bolivia" width={600} height={400} className="w-full h-auto object-cover" />
                    </div>
                </section>

                {/* Video de YouTube */}
                <section className="flex justify-center animate-fade-in">
                    <a
                        href="https://youtu.be/Rf3vcCIlOyk?si=HNbUxDBx5Sw4bXzw&t=8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative w-full md:w-2/3 h-0 pb-[56.25%]"
                    >
                        <Image
                            src="/video.png" // una imagen tuya que simule el video
                            alt="Video del Bicentenario"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl shadow-lg hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-4">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4.5 3.5l11 6.5-11 6.5v-13z" />
                                </svg>
                            </div>
                        </div>
                    </a>
                </section>


                {/* Texto final */}
                <section className="text-center animate-fade-in">
                    <h2 className="text-3xl font-bold text-[#1d4f3f] mb-4">
                        Unidos en memoria, identidad y esperanza
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        El Bicentenario de Bolivia es una oportunidad única para fortalecer nuestra cultura, valorar nuestra historia y soñar juntos el país que queremos construir para las futuras generaciones.
                    </p>
                </section>

            </div>
        </div>
    )
}
