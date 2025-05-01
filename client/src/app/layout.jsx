/*import { playfair_display, merriweather } from '../utils/fonts';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import ChatWidget from '../components/ChatWidget';
import ObtenerToken from '../components/ObtenerToken'; 


export const metadata = {
  title: 'BoliVive',
  description: 'Aplicación oficial del Bicentenario de Bolivia',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={`${playfair_display.className} ${merriweather.className} bg-[#fff6db] dark:bg-[#171717] transition-colors duration-300`}
      >
        <ThemeToggle />
        <Header />
        <ObtenerToken /> {/* ✅ Esto ahora sí funciona }
        {children}
        <Footer />
        <ChatWidget />
        
      </body>
    </html>
  );
}*/

import { playfair_display, merriweather } from '../utils/fonts';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import ChatWrapper from '../components/ChatWrapper'; // ✅ Aquí importas el nuevo wrapper

export const metadata = {
  title: 'BoliVive',
  description: 'Aplicación oficial del Bicentenario de Bolivia',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={`${playfair_display.className} ${merriweather.className} bg-[#fff6db] dark:bg-[#171717] transition-colors duration-300`}
      >
        <ThemeToggle />
        <Header />
        {children}
        <Footer />
        <ChatWrapper /> {/* ✅ Aquí sí puedes usar el componente cliente */}
      </body>
    </html>
  );
}

