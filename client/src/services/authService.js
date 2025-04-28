import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase-config'

export async function registrarUsuario(correo, contrasenia, nombre, apellido) {
  const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasenia)
  const user = userCredential.user

  await updateProfile(user, {
    displayName: `${nombre} ${apellido}`
  })

  await setDoc(doc(db, 'Usuarios', user.uid), {
    nombre,
    apellido,
    correo,
    rol: 'usuario',
    fechaRegistro: new Date(),
    verificado: user.emailVerified
  })
}

export async function loginUsuario(correo, contrasenia) {
  const userCredential = await signInWithEmailAndPassword(auth, correo, contrasenia)
  return userCredential.user
}

export async function recuperarContrasenia(correo) {
  await sendPasswordResetEmail(auth, correo)
}
