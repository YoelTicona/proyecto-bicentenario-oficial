'use client'
import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'

export default function EscanearQR({ idEvento }) {
  const qrRef = useRef(null)

  useEffect(() => {
    if (!qrRef.current) return

    const scanner = new Html5Qrcode('reader')
    let isScanning = true

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (!isScanning) return
          isScanning = false // Evita múltiples lecturas

          try {
            const usuario = JSON.parse(decodedText)

            if (!usuario.uid || !usuario.nombre || !usuario.correo) {
              alert('❌ QR inválido o incompleto')
            } else {
              const ref = doc(db, 'Eventos', idEvento, 'Asistencias', usuario.uid)
              await setDoc(ref, {
                nombre: usuario.nombre,
                correo: usuario.correo,
                escaneado: true,
                hora_escaneo: Timestamp.now(),
              })
              alert(`✅ Registrado: ${usuario.nombre || 'Sin nombre'}`)
            }
          } catch (err) {
            alert('⚠️ QR malformado o no válido')
          } finally {
            await scanner.stop().catch(() => {})
          }
        },
        (error) => {
          console.warn('Error escaneando:', error)
        }
      )
      .catch((err) => {
        console.error('No se pudo iniciar el escáner:', err)
      })

    return () => {
      scanner.stop().catch(() => {})
    }
  }, [idEvento])

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">📷 Escanear QR</h2>
      <div id="reader" ref={qrRef} className="w-full h-64 border" />
    </div>
  )
}
