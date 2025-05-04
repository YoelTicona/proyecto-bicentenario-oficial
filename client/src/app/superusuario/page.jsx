'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import { db, firebaseConfig } from '../../firebase/firebase-config'
import Swal from 'sweetalert2'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function Superusuario() {
  const [usuarios, setUsuarios] = useState([])
  const [eventos, setEventos] = useState([])
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', correo: '', rol: 'usuario' })
  const [editando, setEditando] = useState(null)

  const obtenerUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, 'Usuarios'))
    const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setUsuarios(datos)
  }

  const obtenerEventos = async () => {
    const querySnapshot = await getDocs(collection(db, 'Eventos'))
    const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setEventos(datos)
  }

  useEffect(() => {
    obtenerUsuarios()
    obtenerEventos()
  }, [])

  const generarContrasena = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
    return Array.from({ length: 10 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
  }

  const guardarUsuario = async () => {
    try {
      const secondaryApp = initializeApp(firebaseConfig, 'Secondary')
      const secondaryAuth = getAuth(secondaryApp)
      const contrasenaTemporal = generarContrasena()
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, nuevoUsuario.correo, contrasenaTemporal)
      await setDoc(doc(db, 'Usuarios', userCredential.user.uid), {
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        verificado: false
      })
      await secondaryAuth.signOut()
      Swal.fire('Éxito', 'Usuario creado correctamente', 'success')
      obtenerUsuarios()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, 'Usuarios', id))
      Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success')
      obtenerUsuarios()
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
    }
  }

  const actualizarUsuario = async () => {
    try {
      await updateDoc(doc(db, 'Usuarios', editando.id), {
        nombre: editando.nombre,
        correo: editando.correo,
        rol: editando.rol
      })
      Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success')
      setEditando(null)
      obtenerUsuarios()
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
    }
  }

  const eventosPorCategoria = eventos.reduce((acc, evento) => {
    const cat = evento.categoria || 'Sin categoría'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel del Superusuario</h1>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-sm font-semibold">Usuarios</h3>
          <p className="text-2xl font-bold text-blue-600">{usuarios.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-sm font-semibold">Eventos</h3>
          <p className="text-2xl font-bold text-green-600">{eventos.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-sm font-semibold">Organizadores</h3>
          <p className="text-2xl font-bold text-emerald-500">{usuarios.filter(u => u.rol === 'organizador').length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-sm font-semibold">Administradores</h3>
          <p className="text-2xl font-bold text-yellow-500">{usuarios.filter(u => u.rol === 'administrador').length}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Usuarios por Rol</h2>
          <Doughnut data={{
            labels: ['Usuarios', 'Organizadores', 'Administradores'],
            datasets: [{
              data: [
                usuarios.filter(u => u.rol === 'usuario').length,
                usuarios.filter(u => u.rol === 'organizador').length,
                usuarios.filter(u => u.rol === 'administrador').length
              ],
              backgroundColor: ['#60a5fa', '#34d399', '#fbbf24']
            }]
          }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Eventos por Categoría</h2>
          <Bar data={{
            labels: Object.keys(eventosPorCategoria),
            datasets: [{
              label: 'Cantidad de eventos',
              data: Object.values(eventosPorCategoria),
              backgroundColor: '#4ade80'
            }]
          }} />
        </div>
      </div>

      {/* Gestión de usuarios */}
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          className="p-2 border rounded w-1/3"
          value={nuevoUsuario.nombre}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
        />
        <input
          type="email"
          placeholder="Correo"
          className="p-2 border rounded w-1/3"
          value={nuevoUsuario.correo}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
        />
        <select
          className="p-2 border rounded w-1/4"
          value={nuevoUsuario.rol}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
        >
          <option value="usuario">Usuario</option>
          <option value="organizador">Organizador</option>
          <option value="administrador">Administrador</option>
        </select>
        <button onClick={guardarUsuario} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">
          Crear
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6">Nombre</th>
              <th className="py-3 px-6">Correo</th>
              <th className="py-3 px-6">Rol</th>
              <th className="py-3 px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id} className="border-t">
                <td className="px-6 py-3">{editando?.id === usuario.id ? (
                  <input
                    value={editando.nombre}
                    onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : usuario.nombre}</td>
                <td className="px-6 py-3">{editando?.id === usuario.id ? (
                  <input
                    value={editando.correo}
                    onChange={(e) => setEditando({ ...editando, correo: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : usuario.correo}</td>
                <td className="px-6 py-3">{editando?.id === usuario.id ? (
                  <select
                    value={editando.rol}
                    onChange={(e) => setEditando({ ...editando, rol: e.target.value })}
                    className="border p-1 rounded"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="organizador">Organizador</option>
                    <option value="administrador">Administrador</option>
                  </select>
                ) : usuario.rol}</td>
                <td className="px-6 py-3 flex gap-2">
                  {editando?.id === usuario.id ? (
                    <>
                      <button onClick={actualizarUsuario} className="text-green-600 cursor-pointer">Guardar</button>
                      <button onClick={() => setEditando(null)} className="text-gray-500 cursor-pointer">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditando(usuario)} className="text-blue-600 cursor-pointer">Editar</button>
                      <button onClick={() => eliminarUsuario(usuario.id)} className="text-red-600 cursor-pointer">Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
