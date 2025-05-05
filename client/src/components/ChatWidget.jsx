'use client'
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default function ChatWidget() {
  useEffect(() => {
    const auth = getAuth()

    onAuthStateChanged(auth, async (user) => {
      try {
        let token = null
        if (user) {
          token = await user.getIdToken()
          console.log('🔑 Token recibido en ChatWidget:', token)
        }

        const script = document.createElement('script')
        script.type = 'module'

        script.innerHTML = `
          import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
          createChat({
            webhookUrl: 'https://gatitomin.app.n8n.cloud/webhook/c800fb36-4b01-498e-901d-9c54be521f3e/chat',
            metadata: {
              token: ${JSON.stringify(token)}
            },
            theme: {
              button: {
                icon: '💬',
                position: 'bottom-right py-4 px-4'
              }
            },
            chat: {
              title: 'Agente Bicentenario',
              subtitle: 'Pregúntame sobre la historia de Bolivia'
            }
          });
        `
        document.body.appendChild(script)
      } catch (error) {
        console.warn('❌ Error al cargar el widget de chat:', error.message)
      }
    })
  }, [])

  return (
    <link
      href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
      rel="stylesheet"
    />
  )
}