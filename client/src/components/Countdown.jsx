'use client'
import { useEffect, useState } from 'react'
import 'aos/dist/aos.css'
import AOS from 'aos'

const Countdown = () => {
  const targetDate = new Date('2025-08-05T06:00:00-04:00') // Hora Bolivia

  const [timeLeft, setTimeLeft] = useState(null)
  useEffect(() => {
      AOS.init({
        duration: 800,
        once: true,
      })
    }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate - now

      if (difference <= 0) return {
        días: 0, meses: 0, horas: 0, minutos: 0, segundos: 0
      }

      return {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        meses: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / (1000 * 60)) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft()) // primera vez

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) return null // no renderices nada en el primer render (SSR)

  return (
    <section className="text-center" data-aos="fade-up">
  <h2 className="text-3xl font-bold mb-6">Cuenta Regresiva</h2>

  {/* Contenedor de los bloques */}
  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
    {Object.entries(timeLeft).map(([label, value]) => (
      <div
        key={label}
        className="bg-gray-100 p-3 sm:p-4 rounded shadow w-20 sm:w-24 md:w-28"
      >
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-gray-600 capitalize">{label}</div>
      </div>
    ))}
  </div>
</section>
  )
}

export default Countdown
