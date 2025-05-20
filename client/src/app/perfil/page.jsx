'use client'

import { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from './../../firebase/firebase-config'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'
import { Camera } from 'lucide-react'


export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null)
  const [datosFirestore, setDatosFirestore] = useState(null)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({})
  const [foto, setFoto] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [paisesCiudades, setPaisesCiudades] = useState([])
  const [fotoPreview, setFotoPreview] = useState(null)
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dw8uxuhxl/image/upload'
  const CLOUDINARY_UPLOAD_PRESET = 'foto_peril_usuarios'


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

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(res => res.json())
      .then(data => setPaisesCiudades(data.data))
  }, [])

  const paises = paisesCiudades.map(p => p.country)
  const ciudades = form.pais
    ? paisesCiudades.find(p => p.country === form.pais)?.cities || []
    : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      setFotoPreview(URL.createObjectURL(file))
    }
  }


  const guardarCambios = async () => {
    try {
      const auth = getAuth()
      const userDocRef = doc(db, 'Usuarios', usuario.uid)
      const actualizaciones = { ...form }
  
      if (foto) {
        setSubiendo(true)
  
        // Cloudinary upload
        const formData = new FormData()
        formData.append('file', foto)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  
        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
        })
  
        const data = await response.json()
        const url = data.secure_url
  
        await updateProfile(auth.currentUser, { photoURL: url })
        actualizaciones.fotoPerfil = url
        setUsuario({ ...auth.currentUser, photoURL: url })
        setSubiendo(false)
      }
  
      await updateDoc(userDocRef, actualizaciones)
      setDatosFirestore(form)
      setEditando(false)
      Swal.fire({ icon: 'success', title: 'Perfil actualizado correctamente' })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar', text: err.message })
    }
  }
  

  if (!usuario || !datosFirestore) return <p className="text-center py-20">Cargando perfil...</p>

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 rounded-lg shadow-lg bg-[#fff8e1] border border-yellow-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Mi perfil</h2>

      <div className="flex flex-col items-center mb-6">
        {editando ? (
          <label htmlFor="foto" className=" w-full h-full flex items-center justify-center">
            <div className="rounded-full overflow-hidden w-24 h-24 border-2 border-white shadow-lg relative justify-center">
              {editando && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer">
                  <Camera className="text-white w-6 h-6" />
                </div>
              )}
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : usuario.photoURL ? (
                <Image
                  src={usuario.photoURL}
                  alt="Foto"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-yellow-400 text-white text-3xl font-bold">
                  {datosFirestore.nombre?.charAt(0)}
                </div>
              )}
            </div>
            {editando && (
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            )}
          </label>
        ) : (
          usuario.photoURL ? (
            <Image
              src={usuario.photoURL}
              alt="Foto"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-yellow-400 text-white rounded-full text-3xl font-bold shadow">
              {datosFirestore.nombre?.charAt(0)}
            </div>
          )
        )}


        <p className="mt-3 text-xl font-semibold text-gray-800">{datosFirestore.nombre}</p>
        <p className="text-gray-600">{usuario.email}</p>

        {!editando && (
          <button
            onClick={() => setEditando(true)}
            className="mt-3 bg-[#889E73] hover:bg-[#6f825e] text-white px-5 py-2 rounded-full text-sm"
          >
            Editar perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm text-gray-800">
        {['nombre', 'apellidoPat', 'apellidoMat', 'fechaNac'].map((campo) => (
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

        {/* Género */}
        <div>
          <p className="text-gray-500">Género</p>
          {editando ? (
            <select
              name="genero"
              value={form.genero || ''}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecciona una opción</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          ) : (
            <p className="font-medium">{datosFirestore.genero}</p>
          )}
        </div>

        {/* Rol */}
        <div>
          <p className="text-gray-500">Rol</p>
          {editando ? (
            <select
              name="rol"
              value={form.rol || ''}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="usuario">Usuario</option>
              <option value="organizador">Organizador</option>
            </select>
          ) : (
            <p className="font-medium">{datosFirestore.rol}</p>
          )}
        </div>

        {/* País */}
        <div>
          <p className="text-gray-500">País</p>
          {editando ? (
            <select
              name="pais"
              value={form.pais || ''}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">País</option>
              {paises.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          ) : (
            <p className="font-medium">{datosFirestore.pais}</p>
          )}
        </div>

        {/* Ciudad */}
        <div>
          <p className="text-gray-500">Ciudad</p>
          {editando ? (
            <select
              name="ciudad"
              value={form.ciudad || ''}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Ciudad</option>
              {ciudades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : (
            <p className="font-medium">{datosFirestore.ciudad}</p>
          )}
        </div>
      </div>

      {editando && (
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setEditando(false)}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={guardarCambios}
            className="px-4 py-2 rounded bg-[#889E73] text-white hover:bg-[#6f825e] cursor-pointer"
            disabled={subiendo}
          >
            {subiendo ? 'Subiendo...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )

}
