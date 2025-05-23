import ListaAsistentes from '../../../components/ListaAsistentes'

export const dynamicParams = false

export async function generateStaticParams() {
  return [
    { id: "9blejkLTWdSGjKPNGoQg" },
    { id: "M3NvUz8RjOqpIhHigleD" },
    { id: "Pn98jLnVxy75k4FBME6q" },
    { id: "TfszmNbaErwnzHgeMzYh" },
    { id: "aXZWZxexyQsBwthOelAh" },
    { id: "hYwt6luI39ogzydq9DkJ" },
    { id: "kWpWHAuLxsOwIWOc3Cl5" },
    { id: "kxcULedBfuKmxDu4ZDQx" },
    { id: "mgMpbHCxb90HYIFOfiXI" },
    { id: "pKcwXLy6O81ODvDWcsxT" },
    { id: "uuPZTAQ9Sl31Z4b4mJtR" },
    { id: "wZCANlnzronaAPO0qq1P" }
  ]
}

export default function AsistenciaPage({ params }) {
  const { id } = params
  return <ListaAsistentes idEvento={id} />
}
