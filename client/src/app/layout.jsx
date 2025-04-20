import { playfair_display, merriweather } from './ui/fonts';
import "./globals.css";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ThemeToggle from "./../components/ThemeToggle";

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
      <body
        className={`${playfair_display.className} ${merriweather.className} bg-[#fff6db] dark:bg-[#171717] transition-colors duration-300`}
      >
        <ThemeToggle />

        <Header />
        <ThemeToggle />
        <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
        </div>
        {children}
        <Footer />
      </body>
    </html>
  )
}