import Hero from "../components/PaginaPrincipal/Hero"
import Countdown from "../components/PaginaPrincipal/Countdown"
import EventosDestacados from "../components/PaginaPrincipal/EventosDestacados"
import LineaDeTiempo from "../components/PaginaPrincipal/LineaDeTiempo"
import DocumentosLegales from "../components/PaginaPrincipal/DocumentosLegales"
import AvisoLegal from "../components/PaginaPrincipal/AvisoLegal"
import Anuncios from "./../components/PaginaPrincipal/Anuncios"

export default function Home() {
  return (
    <div className="space-y-10 relative">
      <Hero />
      <Countdown />
      <EventosDestacados />
      <LineaDeTiempo />
      <Anuncios />
      <DocumentosLegales />
      <AvisoLegal />
      
    </div>
  )
}
