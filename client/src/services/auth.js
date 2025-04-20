const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api'

export const login = async (datos) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const registrarUsuario = async (datos) => {
  const res = await fetch(`${BASE_URL}/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
