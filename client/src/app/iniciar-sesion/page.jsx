'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Swal from 'sweetalert2'
import FishDecorativo from '../../components/FishDecorativo'
import ReCAPTCHA from 'react-google-recaptcha'
import { loginUsuario } from '../../services/auth'
import { doc, updateDoc,getDoc,setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

export default function IniciarSesion() {
  const [verContrasenia, setVerContrasenia] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState('')  // 
  const [formData, setFormData] = useState({
    usuario: '',
    contrasenia: ''
  })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const manejarEnvio = async (e) => {
    e.preventDefault();
  
    if (!recaptchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Verificación requerida',
        text: 'Por favor, confirma que no eres un robot.'
      });
      return;
    }
  
    try {
      const user = await loginUsuario({
        email: formData.usuario,
        password: formData.contrasenia
      });
  
      if (!user.emailVerified) {
        Swal.fire({
          icon: 'warning',
          title: 'Correo no verificado',
          text: 'Tu cuenta aún no ha sido verificada. ¿Deseas reenviar el correo de verificación?',
          showCancelButton: true,
          confirmButtonText: 'Sí, reenviar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/iniciar-sesion/verificacion-pendiente');
          }
        });
        return;
      }
  
      // 🔥 Revisamos si existe en Firestore
      const usuarioRef = doc(db, "Usuarios", user.uid);
      const usuarioDoc = await getDoc(usuarioRef);
  
      if (!usuarioDoc.exists()) {
        // 👈 Si NO existe, lo creamos automáticamente
        await setDoc(usuarioRef, {
          nombre: user.displayName || '',
          correo: user.email,
          rol: 'usuario',
          verificado: true
        });
        console.log("✅ Usuario creado en Firestore automáticamente.");
      } else {
        console.log("✅ Usuario encontrado en Firestore.");
      }
  
      Swal.fire({
        icon: 'success',
        title: `Bienvenido`,
        text: `${user.email} \n ¡Has iniciado sesión correctamente!`,
        timer: 2000,
        showConfirmButton: false
      });
  
      setTimeout(() => router.push('/'), 1600);
  
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);
  
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'El usuario no está registrado o la contraseña es incorrecta.\n' + traducirError(error.code)
      });
    }
  };
  
  



  // Función para traducir códigos de error de Firebase
  const traducirError = (codigo) => {
    switch (codigo) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con ese correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo más tarde.';
      case 'auth/invalid-email':
        return 'El correo electrónico ingresado no es válido.';
      default:
        return 'Error desconocido. Intenta de nuevo.';
    }
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#889E73] px-4 overflow-hidden py-10">
      <FishDecorativo />
      <div className="relative z-10 bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-4">
          <Image src="/logo_bicentenario.png" alt="Logo Bicentenario" width={80} height={80} />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">Bicentenario 2025</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          “200 años de lucha, identidad y esplendor. ¡Celebremos juntos el Bicentenario de Bolivia!”
        </p>

        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-gray-700">Usuario o correo</label>
            <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} required className="input" />
          </div>

          <div className="relative">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type={verContrasenia ? 'text' : 'password'}
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              required
              className="input pr-10"
            />
            <span
              onClick={() => setVerContrasenia(!verContrasenia)}
              className="absolute right-3 top-[38px] text-gray-600 cursor-pointer"
            >
              {verContrasenia ? '🙈' : '👁️'}
            </span>
          </div>

          <div className="relative">
            <label className="block text-gray-700">Captcha</label>
            <ReCAPTCHA
              sitekey="6LeQVSYrAAAAANZKNRt-QIAMFMNB-luGKhmcKp5y"  // ✅ Tu site key
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-[#889E73] hover:bg-[#6f825e] rounded transition hover:scale-105"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            ¿No tienes cuenta?{' '}
            <a href="/iniciar-sesion/crear-cuenta" className="text-blue-700 font-semibold">
              Crea una cuenta
            </a>
          </p>
          <p>
            ¿Olvidaste tu contraseña?{' '}
            <a href="/iniciar-sesion/recuperar-acceso" className="text-blue-700 font-semibold">
              Recuperar acceso
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
