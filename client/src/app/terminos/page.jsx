const Terminos = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg max-w-6xl w-full p-8 md:p-12 leading-loose text-gray-800 text-justify">

        {/* Título principal */}
        <h1 className="text-4xl font-bold mb-10 text-center text-[#1d4f3f]">
          Términos y Condiciones de Uso
        </h1>

        {/* Tabla de contenidos */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">Contenido</h2>
          <ul className="list-disc list-inside text-center space-y-2 text-lg text-[#1d4f3f]">
            <li><a href="#objeto">1. Objeto del Proyecto</a></li>
            <li><a href="#registro">2. Registro y Participación</a></li>
            <li><a href="#uso">3. Uso Aceptable</a></li>
            <li><a href="#propiedad">4. Propiedad Intelectual</a></li>
            <li><a href="#eventos">5. Participación en Eventos</a></li>
            <li><a href="#privacidad">6. Privacidad y Protección de Datos</a></li>
            <li><a href="#modificaciones">7. Modificaciones</a></li>
            <li><a href="#limitaciones">8. Limitaciones de Responsabilidad</a></li>
            <li><a href="#ley">9. Ley Aplicable y Jurisdicción</a></li>
          </ul>
        </div>

        {/* Contenido en columnas */}
        <div className="columns-1 md:columns-2 gap-16 space-y-8 md:border-l-2 md:border-gray-300 md:pl-10">
          <section id="objeto">
            <h2 className="text-2xl font-semibold mb-2">1. Objeto del Proyecto</h2>
            <p>
              <span className="text-4xl font-bold float-left leading-none mr-2 text-[#1d4f3f]">E</span>sta plataforma busca promover, informar y difundir actividades, eventos, cultura e historia en el marco de los 200 años de independencia de Bolivia, facilitando la participación activa de la ciudadanía.
            </p>
          </section>

          <section id="registro">
            <h2 className="text-2xl font-semibold mb-2">2. Registro y Participación</h2>
            <p>
              El usuario debe registrarse mediante un correo válido para acceder a funciones específicas. Es responsable de mantener su cuenta segura y aceptar las condiciones del servicio.
            </p>
          </section>

          <section id="uso">
            <h2 className="text-2xl font-semibold mb-2">3. Uso Aceptable</h2>
            <p>
              Al usar la plataforma, el usuario se compromete a:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Actuar con respeto y conforme a la ley.</li>
              <li>No utilizar información de manera indebida.</li>
              <li>No comprometer la seguridad de los sistemas.</li>
            </ul>
          </section>

          <section id="propiedad">
            <h2 className="text-2xl font-semibold mb-2">4. Propiedad Intelectual</h2>
            <p>
              Todo contenido pertenece al Comité del Bicentenario o a sus legítimos autores. La reproducción no autorizada será considerada infracción de derechos.
            </p>
          </section>

          <section id="eventos">
            <h2 className="text-2xl font-semibold mb-2">5. Participación en Eventos</h2>
            <p>
              Al registrarse en eventos, el usuario acepta las reglas establecidas para cada actividad. La organización se reserva el derecho de modificar las condiciones por causas de fuerza mayor.
            </p>
          </section>

          <section id="privacidad">
            <h2 className="text-2xl font-semibold mb-2">6. Privacidad y Protección de Datos</h2>
            <p>
              Respetamos la privacidad de los usuarios. Todos los datos serán tratados de acuerdo a las leyes de protección vigentes y utilizados exclusivamente para fines del proyecto Bicentenario.
            </p>
          </section>

          <section id="modificaciones">
            <h2 className="text-2xl font-semibold mb-2">7. Modificaciones</h2>
            <p>
              Estos términos pueden ser actualizados en cualquier momento. Cualquier cambio será informado en esta misma plataforma.
            </p>
          </section>

          <section id="limitaciones">
            <h2 className="text-2xl font-semibold mb-2">8. Limitaciones de Responsabilidad</h2>
            <p>
              No garantizamos que el acceso sea continuo o libre de errores. La utilización del sitio es responsabilidad exclusiva del usuario.
            </p>
          </section>

          <section id="ley">
            <h2 className="text-2xl font-semibold mb-2">9. Ley Aplicable y Jurisdicción</h2>
            <p>
              Este documento se rige conforme a las leyes bolivianas, con jurisdicción en los tribunales del Estado Plurinacional de Bolivia.
            </p>
          </section>
        </div>

        {/* Footer fecha actualización */}
        <p className="text-center text-gray-500 text-sm mt-16">
          Última actualización: Abril 2025
        </p>
      </div>
    </div>
  )
}

export default Terminos;
