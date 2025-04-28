import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

export const loginUsuario = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;  // Devuelve solo el user
  } catch (error) {
    throw error;
  }
};
