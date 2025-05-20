'use client'
import dynamic from "next/dynamic";
import { useState } from "react";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase-config";


// Usamos dynamic para que funcione en Next.js (solo en cliente)
const QrReader = dynamic(() => import('react-qr-reader').then(mod => mod.QrReader), { ssr: false });

const EscanearQR = ({ idEvento }) => {
  const [resultado, setResultado] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      try {
        const usuario = JSON.parse(data);
        await setDoc(doc(db, "Eventos", idEvento, "Asistencias", usuario.uid), {
          nombre: usuario.nombre,
          correo: usuario.correo,
          escaneado: true,
          hora_escaneo: Timestamp.now()
        });
        setResultado(` Asistencia registrada para ${usuario.nombre}`);
      } catch (error) {
        setResultado(" Error al procesar el QR");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Escanear QR</h2>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      {resultado && <p className="mt-4 text-center">{resultado}</p>}
    </div>
  );
};

export default EscanearQR;
