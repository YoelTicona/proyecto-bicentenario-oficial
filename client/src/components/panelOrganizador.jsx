import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase/firebase-config'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PanelOrganizador() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    const cargarEventos = async () => {
      const user = auth.currentUser
      if (!user) return

      const eventosRef = collection(db, 'Eventos')
      const q = query(eventosRef, where('creadoPor', '==', user.uid))
      const snapshot = await getDocs(q)
      const resultado = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setEventos(resultado)
    }

    cargarEventos()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mis eventos</h2>
      {eventos.map(evento => (
        <div key={evento.id} className="border p-4 mb-2 rounded shadow">
          <h3 className="font-semibold">{evento.descripcion}</h3>
          <p className="text-sm text-gray-600">{evento.fecha}</p>

          <Link
            href={`/escanear/${evento.id}`}
            className="inline-block mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Escanear asistentes
          </Link>
        </div>
      ))}
    </div>
  )
}
