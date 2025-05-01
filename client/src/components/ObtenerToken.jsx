'use client';

import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../firebase/firebase-config'; // asegúrate de esto

export default function ObtenerToken() {
  useEffect(() => {
    console.log('👀 Ejecutando useEffect de ObtenerToken...');
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        user.getIdToken().then((token) => {
          console.log('🎟️ Token del usuario:', token);
        }).catch((error) => {
          console.error('❌ Error al obtener token:', error);
        });
      } else {
        console.log('⚠️ No hay usuario autenticado');
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
