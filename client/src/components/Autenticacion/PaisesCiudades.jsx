const PaisesCiudades = () => {
    const [paisesCiudades, setPaisesCiudades] = useState([])

    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries')
            .then(res => res.json())
            .then(data => setPaisesCiudades(data.data))
    }, [])

    const paises = paisesCiudades.map(p => p.country)
    const ciudades = form.pais
        ? paisesCiudades.find(p => p.country === form.pais)?.cities || []
        : []
}

export default PaisesCiudades;