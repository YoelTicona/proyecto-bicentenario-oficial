'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Eventos', href: '/eventos' },
    { label: 'Agenda', href: '/agenda' },
    { label: 'Contactos', href: '/contactos' },
    { label: 'Iniciar Sesión', href: '/iniciar-sesion' },
  ]


  return (
    <header className="sticky top-0 z-50 bg-green-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        {/* Logo + título */}
        <div className="flex items-center gap-4">
          <Image src="/logo_bicentenario.png" alt="Logo" width={40} height={40} />
          <h1 className="text-lg font-bold">Bicentenario Bolivia</h1>
        </div>

        {/* Menú escritorio */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href} className="hover:text-yellow-300 transition duration-300 relative group">
              {item.label}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menú móvil horizontal debajo del header */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-green-800 text-white shadow-md z-40 transition-all duration-300 transform origin-top ${menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center py-4 space-y-4 text-lg">
        {navItems.map((item, i) => (
  <Link
    key={i}
    href={item.href}
    className="hover:text-yellow-300 transition"
    onClick={() => setMenuOpen(false)}
  >
    {item.label}
  </Link>
))}

        </div>
      </div>
    </header>
  )
}

export default Header
