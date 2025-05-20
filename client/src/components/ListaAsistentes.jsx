'use client'
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase-config"

const ListaAsistentes = ({ idEvento }) => {
  const [asistentes, setAsistentes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const obtenerAsistencias = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Eventos", idEvento, "Asistencias"))
        const datos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setAsistentes(datos)
        setLoading(false)
      } catch (error) {
        console.error("Error al obtener asistentes:", error)
        setLoading(false)
      }
    }

    obtenerAsistencias()
  }, [idEvento])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Lista de Asistentes</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : asistentes.length === 0 ? (
        <p>No hay asistentes registrados aún.</p>
      ) : (
        <ul className="space-y-2">
          {asistentes.map((a, index) => (
            <li key={a.id} className="border p-2 rounded shadow">
              <strong>{index + 1}. {a.nombre}</strong><br />
              <span className="text-sm text-gray-600">{a.correo}</span><br />
              <span className="text-sm text-green-700">
                 Escaneado el {a.hora_escaneo?.toDate().toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaAsistentes
