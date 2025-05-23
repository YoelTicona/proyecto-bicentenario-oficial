'use client'
import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'

export default function EscanearQR({ idEvento }) {
  const qrRef = useRef(null)
  const scannerRef = useRef(null)
  const hasScannedRef = useRef(false)

  useEffect(() => {
    if (!qrRef.current) return

    const scanner = new Html5Qrcode(qrRef.current.id)
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        if (hasScannedRef.current) return // 🔒 evita múltiples ejecuciones

        try {
          const usuario = JSON.parse(decodedText)

          if (!usuario.uid || !usuario.nombre || !usuario.correo) {
            alert(' QR no válido (datos incompletos)')
          } else {
            const ref = doc(db, 'Eventos', idEvento, 'Asistencias', usuario.uid)
            await setDoc(ref, {
              nombre: usuario.nombre,
              correo: usuario.correo,
              escaneado: true,
              hora_escaneo: Timestamp.now(),
            })
            alert(` Registrado: ${usuario.nombre}`)
          }
        } catch (e) {
          alert(' QR no válido')
        } finally {
          hasScannedRef.current = true
          scanner.stop().catch(() => {})
        }
      },
      (err) => {
        console.warn('Error escaneando:', err)
      }
    )

    return () => {
      scanner.stop().catch(() => {})
    }
  }, [idEvento])

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Escanear QR</h2>
      <div id="reader" ref={qrRef} className="w-full h-64 border" />
    </div>
  )
}
