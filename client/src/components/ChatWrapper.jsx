'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatWidget from './ChatWidget';

export default function ChatWrapper() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log('✅ Token obtenido:', token);
        setToken(token);
      }
    });

    return () => unsubscribe();
  }, []);

  return <ChatWidget token={token} />;
}
