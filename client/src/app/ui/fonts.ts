// 2. Manejo de fuentes
import { Playfair_Display, Merriweather, Poppins, Inter, Geist, Geist_Mono} from 'next/font/google';  

export const playfair_display = Playfair_Display({
    weight: ['400', '700'],
    subsets: ['latin'],
})

export const merriweather = Merriweather({
    weight: ['400', '700'],
    subsets: ['latin'],
})

export const poppins = Poppins({
    weight: ['400', '700'],
    subsets: ['latin'],
})

export const inter = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});