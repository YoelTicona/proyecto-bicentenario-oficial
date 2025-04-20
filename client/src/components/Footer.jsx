import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-[#171717] text-gray-300 py-8 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Logo o nombre */}
        <div className="text-center md:text-left">
          <h2 className="text-white font-bold text-lg">Bicentenario Bolivia</h2>
          <p className="mt-1 text-gray-400">© 2025 Gobierno de Bolivia. Todos los derechos reservados.</p>
        </div>

        {/* Enlaces legales */}
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium">
            <a href="/terminos" className="hover:text-white">Términos de Uso</a>
            <a href="/privacidad" className="hover:text-white">Política de Privacidad</a>
          </div>
        </div>

        {/* Redes sociales + powered */}
        <div className="flex flex-col items-center md:items-end space-y-3">
          <div className="flex space-x-4 text-lg">
            <a href="#"><FaFacebookF className="hover:text-white" /></a>
            <a href="#"><FaTwitter className="hover:text-white" /></a>
            <a href="#"><FaYoutube className="hover:text-white" /></a>
            <a href="#"><FaLinkedinIn className="hover:text-white" /></a>
          </div>
          <p className="text-xs text-gray-500">
            Desarrollado por <span className="text-white font-semibold">Equipo BoliVive</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
