'use client'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReCAPTCHA from 'react-google-recaptcha'
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../../firebase/firebase-config";
// Ejemplo en un componente para la bd
import { collection, setDoc, doc } from "firebase/firestore";
//aqui terminamos de importar

export default function RegistroUsuario() {
  const router = useRouter()
  const [paisesCiudades, setPaisesCiudades] = useState([])
  const [verContrasenia, setVerContrasenia] = useState(false)
  const [verRepetida, setVerRepetida] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [form, setForm] = useState({
    nombre: '', paterno: '', materno: '', nacimiento: '', genero: '',
    email: '', pais: '', ciudad: '', contrasenia: '', confirmar: '', rol: ''
  })
  // Nuevos estados
  const [fuerzaContrasenia, setFuerzaContrasenia] = useState('');
  // Nueva función para evaluar fuerza de la contraseña
  const evaluarFuerza = (password) => {
    let puntos = 0;
    if (/[a-z]/.test(password)) puntos += 1;
    if (/[A-Z]/.test(password)) puntos += 1;
    if (/\d/.test(password)) puntos += 1;
    if (/[^a-zA-Z0-9]/.test(password)) puntos += 1;
    if (password.length >= 8) puntos += 1;

    if (puntos <= 2) return 'Débil';
    if (puntos === 3 || puntos === 4) return 'Media';
    if (puntos === 5) return 'Fuerte';
    return '';
  };


  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(res => res.json())
      .then(data => setPaisesCiudades(data.data))
  }, [])

  const paises = paisesCiudades.map(p => p.country)
  const ciudades = form.pais
    ? paisesCiudades.find(p => p.country === form.pais)?.cities || []
    : []

  // Actualiza handleChange
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.contrasenia !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      setExito(false);
      return;
    }
  
    if (form.contrasenia.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setExito(false);
      return;
    }
  
    try {
      // ✅ Crear documento adicional en Firestore
      await addDoc(collection(db, "Usuarios"), {
        apellidoMat: form.materno,
        apellidoPat: form.paterno,
        ciudad: form.ciudad,
        correo: form.email,
        fechaNac: form.nacimiento,
        genero: form.genero,
        nombre: form.nombre,
        pais: form.pais,
        rol: form.rol ?? 'user',
        contrasenia: form.contrasenia,
      });
  
      setError("");
      setExito(true);
      alert("Usuario registrado correctamente ✅");
    } catch (error) {
      console.error("Error de registro:", error.message);
      setError(error.message);
      setExito(false);
    }
  };
=======
  // ====== ENVIO DE LOS DATOS ====== //
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (form.contrasenia !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
  
    const validacion = validarContraseniaSegura(form.contrasenia)
    if (validacion) {
      setError(validacion)
      return
    }
  
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.contrasenia)
      const user = userCredential.user
  
      // 2. Enviar correo de verificación
      await sendEmailVerification(user)
  
      // 3. Guardar información en Firestore
      const usuarioInfo = {
        nombre: form.nombre,
        apellidoPat: form.paterno,
        apellidoMat: form.materno,
        fechaNac: form.nacimiento,
        genero: form.genero,
        correo: form.email,
        ciudad: form.ciudad,
        pais: form.pais,
        rol: form.rol,
        verificado: false
      }
  
      await setDoc(doc(db, 'Usuarios', user.uid), usuarioInfo)
  
      setExito(true)
      setError('')
  
      Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: 'Te enviamos un correo de verificación',
        confirmButtonText: 'Aceptar'
      })
  
      // Opcional: redirigir
      router.push('/iniciar-sesion')
  
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ocurrió un error')
    }
  }
>>>>>>> 8de5eccb322c4348ac4b25cb7436f5c982ca68af



  return (
    <div className="min-h-screen bg-[#889E73] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Registro de Usuario</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <input name="nombre" placeholder="Nombre" className="input" required onChange={handleChange} />
          <input name="paterno" placeholder="Paterno" className="input" required onChange={handleChange} />
          <input name="materno" placeholder="Materno" className="input" onChange={handleChange} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <input name="email" type="email" placeholder="Correo electrónico" className="input" required onChange={handleChange} />
          <div className="relative group w-full">
            <input
              name="nacimiento"
              type="date"
              className="input"
              required
              onChange={handleChange}
              value={form.nacimiento}
            />
            <div className="absolute top-full left-0 mt-1 w-64 p-2 text-sm text-white bg-gray-700 rounded shadow opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition">
              Por favor, selecciona tu fecha de nacimiento
            </div>
          </div>


          <select name="genero" className="input" required onChange={handleChange}>
            <option value="">Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <select name="pais" className="input" value={form.pais} onChange={handleChange} required>
            <option value="">País</option>
            {paises.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select name="ciudad" className="input" value={form.ciudad} onChange={handleChange} required disabled={!ciudades.length}>
            <option value="">Ciudad</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <input
              name="contrasenia"
              type={verContrasenia ? 'text' : 'password'}
              placeholder="Contraseña"
              className="input"
              required
              onChange={handleChange}
            />
            <span
              onClick={() => setVerContrasenia(!verContrasenia)}
              className="absolute right-3 top-2 cursor-pointer text-gray-600"
            >
              {verContrasenia ? '🙈' : '👁️'}
            </span>
            {/* Aquí mostramos la fuerza */}
            {form.contrasenia && (
              <p className={`mt-1 text-sm ${fuerzaContrasenia === 'Fuerte' ? 'text-green-600' :
                  fuerzaContrasenia === 'Media' ? 'text-yellow-500' :
                    'text-red-600'
                }`}>
                Fuerza: {fuerzaContrasenia}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              name="confirmar"
              type={verRepetida ? 'text' : 'password'}
              placeholder="Repite la contraseña"
              className="input"
              required
              onChange={handleChange}
            />
            <span
              onClick={() => setVerRepetida(!verRepetida)}
              className="absolute right-3 top-2 cursor-pointer text-gray-600"
            >
              {verRepetida ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="relative group w-full">
            <select
              name="rol"
              className="input w-full"
              required
              onChange={handleChange}
            >
              <option value="">Rol</option>
              <option value="usuario">Usuario Casual</option>
              <option value="organizador">Organizador</option>
            </select>

            {/* Tooltip */}
            <div className="absolute top-full left-0 mt-1 w-64 p-2 text-sm text-white bg-gray-700 rounded shadow opacity-0 group-hover:opacity-100 transition">
              {form.rol === '' && 'Seleccione un rol'}
              {form.rol === 'usuario' && 'Puede explorar, comentar y registrar eventos en su agenda'}
              {form.rol === 'organizador' && 'Puede crear, editar y gestionar eventos del sistema'}
            </div>
          </div>
        </div>
        <div className="relative">
          <label className="block text-gray-700">Captcha</label>
          <ReCAPTCHA
            sitekey="6LeQVSYrAAAAANZKNRt-QIAMFMNB-luGKhmcKp5y"  // ✅ Tu site key
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {exito && <p className="text-green-600 text-sm">¡Registro exitoso!</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#889E73] text-white px-6 py-2 rounded-full hover:bg-[#6f825e] transition"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}
