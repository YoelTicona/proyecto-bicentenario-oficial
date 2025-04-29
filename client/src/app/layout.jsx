import { playfair_display, merriweather } from '../utils/fonts';
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import Script from "next/script"; // ✅ importar Script de Next.js

export const metadata = {
  title: "BoliVive",
  description: "Aplicación oficial del Bicentenario de Bolivia",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* ✅ Estilos del chat de n8n */}
        <link
          href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${playfair_display.className} ${merriweather.className} bg-[#fff6db] dark:bg-[#171717] transition-colors duration-300`}
      >
        {/* ✅ Script del chat */}
        <Script type="module" id="n8n-chat">
          {`
            import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
            createChat({
              webhookUrl: 'https://gatitomin.app.n8n.cloud/webhook/c800fb36-4b01-498e-901d-9c54be521f3e/chat'
            });
          `}
        </Script>

        <ThemeToggle />
        <Header />
        <ThemeToggle />

        <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
