import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config'

const eventosRef = collection(db, 'Eventos')

export async function obtenerEventos() {
  const q = query(eventosRef, orderBy('fecha', 'asc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function agregarEvento(evento) {
  const nuevoEvento = await addDoc(eventosRef, evento)
  return nuevoEvento.id
}

export async function eliminarEvento(id) {
  await deleteDoc(doc(db, 'Eventos', id))
}
