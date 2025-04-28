export default function Privacidad() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-zinc-100 rounded-2xl shadow-lg max-w-6xl w-full p-8 md:p-12 leading-loose text-gray-800 text-justify">

        {/* Título principal */}
        <h1 className="text-4xl font-bold mb-10 text-center text-[#1d4f3f]">
          Política de Privacidad
        </h1>

        {/* Tabla de contenido */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">Contenido</h2>
          <ul className="list-disc list-inside text-center space-y-2 text-lg text-[#1d4f3f]">
            <li><a href="#recopilacion">1. Recopilación de Información</a></li>
            <li><a href="#uso">2. Uso de la Información</a></li>
            <li><a href="#compartir">3. Compartir Información</a></li>
            <li><a href="#proteccion">4. Protección de Datos</a></li>
            <li><a href="#derechos">5. Derechos del Usuario</a></li>
            <li><a href="#cookies">6. Uso de Cookies</a></li>
            <li><a href="#modificaciones">7. Modificaciones</a></li>
            <li><a href="#contacto">8. Contacto</a></li>
          </ul>
        </div>

        {/* Contenido en columnas */}
        <div className="columns-1 md:columns-2 gap-16 space-y-8 md:border-l-2 md:border-gray-300 md:pl-10">
          <section id="recopilacion">
            <h2 className="text-2xl font-semibold mb-2">1. Recopilación de Información</h2>
            <p>
              <span className="text-4xl font-bold float-left leading-none mr-2 text-[#1d4f3f]">E</span>n nuestra plataforma no recopilamos datos personales sensibles. La información solicitada, como nombre y correo electrónico, se utiliza únicamente para fines de autenticación y personalización de la experiencia del usuario.
            </p>
          </section>

          <section id="uso">
            <h2 className="text-2xl font-semibold mb-2">2. Uso de la Información</h2>
            <p>
              La información proporcionada será utilizada exclusivamente para mejorar su experiencia en la plataforma del Proyecto Bicentenario, enviar notificaciones relevantes y facilitar su participación en eventos oficiales.
            </p>
          </section>

          <section id="compartir">
            <h2 className="text-2xl font-semibold mb-2">3. Compartir Información</h2>
            <p>
              No compartimos, vendemos ni alquilamos la información personal de nuestros usuarios a terceros. La excepción será en cumplimiento de obligaciones legales o requerimientos de autoridades competentes.
            </p>
          </section>

          <section id="proteccion">
            <h2 className="text-2xl font-semibold mb-2">4. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra pérdida, robo, uso indebido o acceso no autorizado.
            </p>
          </section>

          <section id="derechos">
            <h2 className="text-2xl font-semibold mb-2">5. Derechos del Usuario</h2>
            <p>
              Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento. Puede solicitarlo escribiéndonos a los canales oficiales de contacto.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-semibold mb-2">6. Uso de Cookies</h2>
            <p>
              Utilizamos cookies esenciales para el funcionamiento de la plataforma. Estas cookies no recopilan información personal sensible y son utilizadas para mantener su sesión activa y mejorar el servicio.
            </p>
          </section>

          <section id="modificaciones">
            <h2 className="text-2xl font-semibold mb-2">7. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar esta Política de Privacidad para adaptarla a cambios legales o mejoras en la plataforma. Las modificaciones serán publicadas oportunamente.
            </p>
          </section>

          <section id="contacto">
            <h2 className="text-2xl font-semibold mb-2">8. Contacto</h2>
            <p>
              Si tiene preguntas o desea ejercer sus derechos de privacidad, puede comunicarse con nosotros a través de los canales oficiales del Proyecto Bicentenario de Bolivia.
            </p>
          </section>
        </div>

        {/* Footer de actualización */}
        <p className="text-center text-gray-500 text-sm mt-16">
          Última actualización: Abril 2025
        </p>
      </div>
    </div>
  )
}
