'use client'

import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { auth } from '../firebase/firebase-config'
import { onAuthStateChanged } from 'firebase/auth'

const QrUsuario = () => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario({
          uid: user.uid,
          nombre: user.displayName || "Sin nombre",
          correo: user.email
        })
      }
      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  if (cargando) return <p className="text-center p-4">Cargando QR...</p>
  if (!usuario) return <p className="text-center text-red-500">No estás logueado.</p>

  // ✅ Esta línea debe ir aquí, no arriba
  const qrData = JSON.stringify(usuario)

  return (
    <div className="p-4 flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold mb-2">Tu código QR de asistencia</h2>
      <QRCodeCanvas value={qrData} size={200} />
      <p className="text-sm mt-2 text-gray-600">Muestra este QR al organizador para registrar tu asistencia.</p>
    </div>
  )
}

export default QrUsuario
