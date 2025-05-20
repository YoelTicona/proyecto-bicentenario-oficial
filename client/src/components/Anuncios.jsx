import 'aos/dist/aos.css'
import AOS from 'aos'
import Link from 'next/link'
const Anuncios = () => {
    const anuncios = [
      {
        titulo: 'Concurso de Historia Boliviana',
        descripcion: 'Participa y gana premios recordando los momentos clave de nuestra independencia.',
        imagen: '/anuncios/anuncio_1.jpeg',
        link: '#',
      },
      {
        titulo: 'Expo Bicentenario 2025',
        descripcion: 'Del 1 al 5 de agosto en La Paz. Eventos culturales, charlas y exposiciones.',
        imagen: '/anuncios/anuncio_2.jpg',
        link: '#',
      },
      {
        titulo: 'Publica tu historia familiar',
        descripcion: 'Contribuye con tu testimonio para enriquecer el archivo cultural del país.',
        imagen: '/anuncios/anuncio_3.jpg',
        link: '#',
      },
    ]
  
    return (
      <section className="max-w-6xl mx-auto px-6" id="anuncios" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-8">Anuncios</h2>
  
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {anuncios.map((anuncio, index) => (
            <Link
              key={index}
              href={anuncio.link}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition"
            >
              <img
                src={anuncio.imagen}
                alt={anuncio.titulo}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{anuncio.titulo}</h3>
                <p className="text-gray-600 text-sm mt-1">{anuncio.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }
  
  export default Anuncios;  