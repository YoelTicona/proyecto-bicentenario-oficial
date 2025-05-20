// app/asistencia/[id]/page.jsx
'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '../../../firebase/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export default function AsistenciaPage() {
  const params = useParams();
  const { id } = params;
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAsistencias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Eventos", id, "Asistencias"));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAsistencias(lista);
      } catch (err) {
        console.error("Error cargando asistencias:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) cargarAsistencias();
  }, [id]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Asistentes al evento</h1>
      {loading ? (
        <p>Cargando asistentes...</p>
      ) : asistencias.length === 0 ? (
        <p>No hay registros de asistencia.</p>
      ) : (
        <ul className="space-y-2">
          {asistencias.map(a => (
            <li key={a.id} className="border p-3 rounded shadow">
              <p><strong>Nombre:</strong> {a.nombre}</p>
              <p><strong>Correo:</strong> {a.correo}</p>
              <p><strong>Hora:</strong> {a.hora_escaneo?.toDate?.().toLocaleString() || 'Desconocida'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
