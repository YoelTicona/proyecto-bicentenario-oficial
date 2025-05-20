'use client'

import { useParams } from 'next/navigation'
import EscanearQR from '../../../components/EscanearQR'

export default function EscanearEventoPage() {
  const { id } = useParams()

  return (
    <main className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Escanear QR para el Evento</h1>
      <EscanearQR idEvento={id} />
    </main>
  )
}
