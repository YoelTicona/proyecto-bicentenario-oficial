'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './../firebase/firebase-config'
import { useRouter } from 'next/navigation'

// Spinner simple
const LoaderSpinner = () => (
  <div className="flex justify-center items-center p-2">
    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
  </div>
)

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Acerca de', href: '/acerca-de' }
]

const Header = () => {
  const pathname = usePathname()
  const auth = getAuth()
  const [usuario, setUsuario] = useState(null)
  const [datosFirestore, setDatosFirestore] = useState(null)
  const [loadingUsuario, setLoadingUsuario] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        setUsuario(user); // Siempre seteamos usuario
        try {
          const ref = doc(db, 'Usuarios', user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setDatosFirestore(snap.data());
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      } else {
        setUsuario(null);
        setDatosFirestore(null);
      }

      setLoadingUsuario(false);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Cierra el men  desplegable al hacer clic fuera de  l.
     * Se utiliza en el evento 'mousedown' del documento.
     * @param {MouseEvent} event - El evento de clic.
     */
    /*******  c978b4ef-75df-4aa9-b1e8-6868ae80ba8e  *******/
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const router = useRouter()

  const cerrarSesion = async () => {
    try {
      await signOut(auth)
      setUsuario(null)
      setMenuOpen(false)
      router.push('/') // 👈 Redirige al inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }


  return (
    <header className="sticky top-0 z-50 bg-[#1d4f3f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo_bicentenario.png" alt="Logo" width={40} height={40} />
          <span className="text-lg font-semibold">Bicentenario Bolivia</span>
        </Link>

        {/* Menú escritorio */}
        <nav className="hidden md:flex space-x-6 text-lg items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-yellow-300 transition relative group ${pathname === link.href ? 'font-bold underline' : ''}`}
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {loadingUsuario ? (
            <LoaderSpinner />
          ) : usuario ? (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 cursor-pointer hover:text-yellow-300"
              >
                {usuario.photoURL ? (
                  <Image src={usuario.photoURL} alt="Foto" width={32} height={32} className="rounded-full" />
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-green-900 font-bold">
                    {usuario.displayName?.charAt(0) || usuario.email.charAt(0)}
                  </span>
                )}
                <span className="text-sm flex items-center gap-1">
                  {usuario.displayName || usuario.email}
                  {!usuario.emailVerified && (
                    <span className="text-xs text-red-400">(No verificado)</span>
                  )}
                </span>

              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-semibold text-sm">Hola {usuario.displayName?.split(' ')[0] || 'usuario'}</p>
                    <p className="text-xs text-gray-600">{usuario.email}</p>
                  </div>
                  <ul className="text-sm">
                    <li className="px-4 py-2 hover:bg-[#c6d4b8] cursor-pointer">
                      <Link href="/perfil">Ver mi perfil</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-[#c6d4b8] cursor-pointer">
                      <Link href="/agenda">Mi agenda</Link>
                    </li>
                    {datosFirestore?.rol === 'organizador' && (
                      <li className="px-4 py-2 hover:bg-[#c6d4b8] cursor-pointer">
                        <Link href="/organizador">Administrar eventos</Link>
                      </li>
                    )}


                    {datosFirestore?.rol === 'superusuario' && (
                      <li className="px-4 py-2 hover:bg-[#c6d4b8] cursor-pointer">
                        <Link href="/superusuario">Panel Superusuario</Link>
                      </li>
                    )}
                    {datosFirestore?.rol === 'superusuario' && (
                      <li className="px-4 py-2 hover:bg-[#c6d4b8] cursor-pointer">
                        <Link href="/superusuario">Panel Dashboard</Link>
                      </li>
                    )}
                    <li className="px-4 py-2 hover:bg-[#c6d4b8] cursor-pointer">
                      <Link href="/contacto">Contáctanos</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer" onClick={cerrarSesion}>
                      Cerrar sesión
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/iniciar-sesion" className="hover:text-yellow-300">
              Iniciar Sesión
            </Link>
          )}
        </nav>

        {/* Botón hamburguesa */}
        <button className="md:hidden text-3xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#1d4f3f] text-white shadow-md z-40 transition-all duration-300 transform origin-top ${menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center py-4 space-y-4 text-lg">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-yellow-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {usuario && !loadingUsuario ? (
            <div className="w-full text-center border-t border-white pt-4">
              <p className="text-sm font-semibold">{usuario.displayName || usuario.email}</p>
              <Link href="/perfil" onClick={() => setMenuOpen(false)} className="block mt-2 text-sm hover:text-yellow-300">
                Ver mi perfil
              </Link>
              <Link href="/agenda" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-yellow-300">
                Mi agenda
              </Link>
              {datosFirestore?.rol === 'organizador' && (
                <Link href="/organizador" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-yellow-300">
                  Administrar eventos
                </Link>
              )}
              {datosFirestore?.rol === 'organizador' && isMobile && (
                <Link href="/organizador" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-yellow-300">
                  Escanear asistentes
                </Link>
              )}
              {['usuario', 'organizador'].includes(datosFirestore?.rol) && (
                <Link href="/qr" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-yellow-300">
                  Ver mi QR
                </Link>
              )}


              {datosFirestore?.rol === 'superusuario' && (
                <li className="px-4 py-2 hover:bg-[#c6d4b8] cursor-pointer">
                  <Link href="/superusuario">Panel Superusuario</Link>
                </li>
              )}
              <Link href="/contacto" onClick={() => setMenuOpen(false)} className="block text-sm hover:text-yellow-300">
                Contáctanos
              </Link>
              <button
                onClick={cerrarSesion}
                className="mt-2 text-sm text-red-400 hover:text-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          ) : !usuario && !loadingUsuario ? (
            <Link href="/iniciar-sesion" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">
              Iniciar Sesión
            </Link>
          ) : <LoaderSpinner />}
        </div>
      </div>
    </header>
  )
}

export default Header