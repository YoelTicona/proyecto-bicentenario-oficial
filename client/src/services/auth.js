const BASE_URL = 'http://localhost:8000' // Cambia si subes el backend a Render
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import app from "./firebase"; // Asegúrate de tener la configuración de Firebase exportada desde aquí


// 🔐 Login de usuario
export const loginUsuario = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Credenciales incorrectas')
  return data
}

// 🆕 Registro de usuario autenticado
const auth = getAuth(app);

// Función para registrar usuario y enviar al backend
export const registrarUsuario = async (form) => {
  try {
    // Registrar al usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.contrasenia);
    const user = userCredential.user;

    // Enviar correo de verificación
    await sendEmailVerification(user);

    // Obtener el token del usuario
    const token = await user.getIdToken();

    // Enviar datos al backend
    const response = await fetch(`${BASE_URL}/usuarios/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        uid: user.uid,
        nombre: form.nombre,
        apellidoPaterno: form.paterno,
        apellidoMaterno: form.materno,
        email: form.email,
        fechaNac: form.nacimiento,
        genero: form.genero,
        rol: "usuario",
        verificado: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al registrar usuario en el backend");
    }

    return { ok: true };
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    return { ok: false, error: error.message };
  }
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
