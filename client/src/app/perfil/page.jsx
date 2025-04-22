'use client'

import { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from './../../firebase'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged} from 'firebase/auth'

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null)
  const [datosFirestore, setDatosFirestore] = useState(null)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({})
  const [foto, setFoto] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user)
        const ref = doc(db, 'Usuarios', user.uid)
        const docSnap = await getDoc(ref)
        if (docSnap.exists()) {
          setDatosFirestore(docSnap.data())
          setForm(docSnap.data())
        }
      }
    })
  
    return () => unsubscribe()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFotoChange = (e) => {
    if (e.target.files[0]) setFoto(e.target.files[0])
  }

  const guardarCambios = async () => {
    try {
      const auth = getAuth()
      const ref = doc(db, 'Usuarios', usuario.uid)
      const actualizaciones = { ...form }

      if (foto) {
        setSubiendo(true)
        const storageRef = ref(storage, `fotos_perfil/${usuario.uid}`)
        await uploadBytes(storageRef, foto)
        const url = await getDownloadURL(storageRef)

        await updateProfile(auth.currentUser, { photoURL: url })
        actualizaciones.fotoPerfil = url
        setUsuario({ ...auth.currentUser, photoURL: url })
        setSubiendo(false)
      }

      await updateDoc(ref, actualizaciones)
      setDatosFirestore(form)
      setEditando(false)
      Swal.fire({ icon: 'success', title: 'Perfil actualizado correctamente' })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar', text: err.message })
    }
  }

  if (!usuario || !datosFirestore) return <p className="text-center py-20">Cargando perfil...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow py-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi perfil</h2>

      <div className="flex flex-col items-center mb-6">
        {usuario.photoURL ? (
          <Image src={usuario.photoURL} alt="Foto" width={80} height={80} className="rounded-full" />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-yellow-400 text-green-900 rounded-full text-2xl font-bold">
            {datosFirestore.nombre?.charAt(0)}
          </div>
        )}

        {editando && (
          <input type="file" accept="image/*" onChange={handleFotoChange} className="mt-2" />
        )}

        <p className="mt-2 font-semibold">{datosFirestore.nombre} {datosFirestore.apellidoPaterno}</p>
        <p className="text-gray-600 text-sm">{usuario.email}</p>
        {!editando && (
          <button
            className="mt-3 text-sm bg-[#889E73] text-white px-4 py-1 rounded-full hover:bg-[#6f825e]"
            onClick={() => setEditando(true)}
          >
            Editar perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {['nombre','apellidoPaterno','apellidoMaterno','genero','fechaNac','pais','ciudad','rol'].map((campo) => (
          <div key={campo}>
            <p className="text-gray-500 capitalize">{campo}</p>
            {editando ? (
              <input
                type="text"
                name={campo}
                value={form[campo] || ''}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="font-medium">{datosFirestore[campo]}</p>
            )}
          </div>
        ))}
      </div>

      {editando && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setEditando(false)}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={guardarCambios}
            className="px-4 py-2 rounded bg-[#889E73] text-white hover:bg-[#6f825e]"
            disabled={subiendo}
          >
            {subiendo ? 'Subiendo...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )
}
