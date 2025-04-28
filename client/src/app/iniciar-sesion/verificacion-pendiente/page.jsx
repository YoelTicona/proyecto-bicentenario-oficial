'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { getAuth, sendEmailVerification } from 'firebase/auth'
import { useEffect, useState } from 'react'

export default function EsperandoVerificacion() {
  const router = useRouter()
  const auth = getAuth()
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const user = auth.currentUser;
    setUsuario(user);

    if (user) {
      enviarCorreoVerificacion(user);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró un usuario autenticado. Por favor vuelve a iniciar sesión.'
      }).then(() => {
        router.push('/iniciar-sesion');
      });
    }
  }, []);

  const enviarCorreoVerificacion = async (user) => {
    try {
      await sendEmailVerification(user);
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Te hemos enviado un nuevo correo de verificación. Revisa tu bandeja de entrada.',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error al reenviar correo:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al reenviar',
        text: 'Ocurrió un problema al intentar enviar el correo. \n Intentelo mas tarde.'
      });
    }
  };

  const manejarReintentar = () => {
    router.push('/iniciar-sesion')
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#889E73] px-4 py-10 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-6">
          <Image src="/logo_bicentenario.png" alt="Logo Bicentenario" width={80} height={80} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verificación pendiente</h1>
        <p className="text-gray-600 mb-6">
          Hemos enviado un correo de verificación a tu dirección de email. 
          <br />
          Por favor, confirma tu cuenta para poder acceder.
        </p>
        <div className="flex flex-col gap-4">
        <button
          onClick={() => enviarCorreoVerificacion(usuario)}
          className="bg-[#fbbf24] text-white px-6 py-2 rounded-full hover:bg-[#f59e0b] transition"
        >
          Reenviar correo de verificación
        </button>



          <button
            onClick={manejarReintentar}
            className="bg-[#889E73] text-white px-6 py-2 rounded-full hover:bg-[#6f825e] transition"
          >
            Reintentar iniciar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
