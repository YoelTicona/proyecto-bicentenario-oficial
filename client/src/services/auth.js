const BASE_URL = 'http://localhost:8000' // Cambia si subes el backend a Render
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import app from "./../firebase"; // Asegúrate de tener la configuración de Firebase exportada desde aquí

const auth = getAuth(app)

// 🔐 Login de usuario
export const loginUsuario = async ({ email, password }) => {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return { user: cred.user }
}

// Función para registrar usuario y enviar al backend
// 🆕 Registro de usuario autenticado
export const registrarUsuario = async (token, datosUsuario) => {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosUsuario),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Error al registrar usuario')
  return data
};

// 👤 Obtener perfil de usuario autenticado
export const getPerfilUsuario = async (token) => {
  const res = await fetch(`${BASE_URL}/perfil`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'No se pudo obtener el perfil')
  return data
}
