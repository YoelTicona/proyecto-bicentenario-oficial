'use client'

import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc,setDoc } from 'firebase/firestore'
import { db ,firebaseConfig} from '../../firebase/firebase-config'
import Swal from 'sweetalert2'
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'



export default function Superusuario() {
    const [usuarios, setUsuarios] = useState([])
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', correo: '', rol: 'usuario' })
    const [editando, setEditando] = useState(null)

    const obtenerUsuarios = async () => {
        const querySnapshot = await getDocs(collection(db, "Usuarios"))
        const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setUsuarios(datos)
    }

    useEffect(() => {
        obtenerUsuarios()
    }, [])

    function generarContrasena() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
        let contrasena = ''
        for (let i = 0; i < 10; i++) {
            contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
        }
        return contrasena
    }
    const guardarUsuario = async () => {
        try {
          // Crear una app secundaria de Firebase SOLO para crear el usuario
          const secondaryApp = initializeApp(firebaseConfig, "Secondary");
      
          const secondaryAuth = getAuth(secondaryApp);
      
          const contrasenaTemporal = generarContrasena();
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, nuevoUsuario.correo, contrasenaTemporal);
      
          await setDoc(doc(db, "Usuarios", userCredential.user.uid), {
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo,
            rol: nuevoUsuario.rol,
            verificado: false,
          });
      
          // Opcional: Puedes enviar correo de verificación, o enviarle la contraseña
      
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario creado correctamente.',
          });
      
          // Después de crear, cerramos la sesión secundaria
          await secondaryAuth.signOut();
      
        } catch (error) {
          console.error("Error creando usuario:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el usuario. ' + error.message,
          });
        }
      }
      

    const eliminarUsuario = async (id) => {
        try {
            await deleteDoc(doc(db, "Usuarios", id))
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success')
            obtenerUsuarios()
        } catch (error) {
            console.error("Error eliminando usuario:", error)
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
        }
    }

    const actualizarUsuario = async () => {
        try {
            await updateDoc(doc(db, "Usuarios", editando.id), {
                nombre: editando.nombre,
                correo: editando.correo,
                rol: editando.rol
            })
            Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success')
            setEditando(null)
            obtenerUsuarios()
        } catch (error) {
            console.error("Error actualizando usuario:", error)
            Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Crear Nuevo Usuario</h1>

            {/* Formulario de creación */}
            <div className="flex gap-4 mb-8">
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
                <button onClick={guardarUsuario} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Crear
                </button>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id} className="border-t">
                                <td className="px-6 py-4">{editando?.id === usuario.id ? (
                                    <input
                                        value={editando.nombre}
                                        onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                                        className="border p-1 rounded"
                                    />
                                ) : usuario.nombre}</td>
                                <td className="px-6 py-4">{editando?.id === usuario.id ? (
                                    <input
                                        value={editando.correo}
                                        onChange={(e) => setEditando({ ...editando, correo: e.target.value })}
                                        className="border p-1 rounded"
                                    />
                                ) : usuario.correo}</td>
                                <td className="px-6 py-4">{editando?.id === usuario.id ? (
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
                                <td className="px-6 py-4 flex gap-2">
                                    {editando?.id === usuario.id ? (
                                        <>
                                            <button onClick={actualizarUsuario} className="text-green-600">Guardar</button>
                                            <button onClick={() => setEditando(null)} className="text-gray-500">Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditando(usuario)} className="text-blue-600">Editar</button>
                                            <button onClick={() => eliminarUsuario(usuario.id)} className="text-red-600">Eliminar</button>
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
