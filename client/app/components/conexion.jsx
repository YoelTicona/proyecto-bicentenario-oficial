// client/pages/index.js
'use client';
import { useEffect, useState } from 'react';

const PruebaBaseDatos = () => {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4001/api/personas')
      .then((res) => res.json())
      .then((data) => setPersonas(data))
      .catch((err) => console.error('Error:', err));
 }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Personas</h1>
      <ul>
        {personas.map((persona) => (
          <li key={persona.id_rol}>
            {persona.nombre} - Apellido Paterno: {persona.apellidopaterno}
          </li>
            ))
        }
      </ul>
    </div>
  );
}
export default PruebaBaseDatos;