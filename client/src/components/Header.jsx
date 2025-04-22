'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './../firebase'

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
  const [showDropdown, setShowDropdown] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user)
      if (user) {
        try {
          await user.reload() // 🔄 fuerza actualización de sesión Firebase
          const ref = doc(db, 'Usuarios', user.uid)
          const snap = await getDoc(ref)
          console.log("Documento Firestore:", snap.exists(), snap.data())
          if (snap.exists()) {
            setDatosFirestore(snap.data())
          } else {
            console.warn("Documento del usuario no encontrado en Firestore")
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error)
        }
      } else {
        setDatosFirestore(null)
      }
    })
    return () => unsubscribe()
  }, [])
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const cerrarSesion = async () => {
    await signOut(auth)
    setUsuario(null)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#1d4f3f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo_bicentenario.png" alt="Logo" width={40} height={40} />
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

          {usuario ? (
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
                <span className="text-sm">{usuario.displayName || usuario.email}</span>
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

          {usuario ? (
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
          ) : (
            <Link href="/iniciar-sesion" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
