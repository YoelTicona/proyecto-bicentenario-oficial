'use client'
import { useEffect, useState } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)

  // Verifica y aplica el modo guardado
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
  }, [])

  // Alternar tema
  const toggleTheme = () => {
    const isDark = !darkMode
    setDarkMode(isDark)

    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 bg-gray-800 text-white dark:bg-yellow-400 dark:text-black p-3 rounded-full shadow-lg transition"
      title="Cambiar modo"
    >
      {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
    </button>
  )
}

export default ThemeToggle
