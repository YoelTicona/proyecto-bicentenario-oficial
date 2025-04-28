'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DocumentosLegales() {
  const normativa = [
    {
      title: 'Plan Estratégico Nacional del Bicentenario',
      desc: 'Metas y líneas de acción para la celebración nacional.',
      file: 'https://bicentenario.bo/wp-content/uploads/2024/06/PLAN-EST-NAL-BICENTENARIO.pdf',
    },
    {
      title: 'Decreto Supremo N°4457',
      desc: 'Organización y planificación del Bicentenario.',
      file: 'https://bicentenario.bo/wp-content/uploads/2024/03/Decreto-Sup-N%C2%B0-4457.pdf',
    },
    {
      title: 'Ley del Bicentenario N°1347',
      desc: 'Declaratoria oficial del Año del Bicentenario.',
      file: 'https://bicentenario.bo/wp-content/uploads/2024/03/LEY-N%C2%B0-1347-Ley-del-Bicentenario.pdf',
    },
  ]

  const marcoLegal = [
    {
      title: 'Manual de Uso 200 Bicentenario Bolivia',
      desc: 'Guía de identidad gráfica y uso del logotipo oficial.',
      file: 'https://bicentenario.bo/wp-content/uploads/2025/02/ManualDeUso_200_BICENTENARIOBOLIVIA-23-2.pdf',
    },
    {
      title: 'Decreto Supremo N°4900',
      desc: 'Reglamenta el uso de la imagen oficial.',
      file: 'https://bicentenario.bo/wp-content/uploads/2025/02/DS-4900-1.pdf',
    },
    {
      title: 'Manual de Identidad de Gobierno',
      desc: 'Lineamientos de imagen institucional para eventos oficiales.',
      file: 'https://bicentenario.bo/wp-content/uploads/2025/02/Manual_de_Identidad_Imagen_Gobierno_.pdf',
    },
  ]

  return (
    <section className="py-10 px-4 grid md:grid-cols-2 gap-6" data-aos="fade-up">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-100 p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Normativa</h2>
        {normativa.map((doc, i) => (
          <div key={i} className="flex items-center p-4 bg-white rounded shadow mb-4">
            <Image src="/pdf_ico.png" alt="PDF" width={60} height={60} className="mr-4" />
            <div>
              <h3 className="font-semibold text-lg">{doc.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{doc.desc}</p>
              <Link href={doc.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Descargar PDF
              </Link>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-100 p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Marco Legal</h2>
        {marcoLegal.map((doc, i) => (
          <div key={i} className="flex items-center p-4 bg-white rounded shadow mb-4">
            <Image src="/pdf_ico.png" alt="PDF" width={60} height={60} className="mr-4" />
            <div>
              <h3 className="font-semibold text-lg">{doc.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{doc.desc}</p>
              <Link href={doc.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Descargar PDF
              </Link>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
