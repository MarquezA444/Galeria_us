import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import FloatingParticles from '@/components/effects/FloatingParticles';
import SplashScreen from '@/components/ui/SplashScreen';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: '400', variable: '--font-playfair' });

export const viewport: Viewport = {
  themeColor: '#FFD700',
};

export const metadata: Metadata = {
  title: 'Nuestro Jardín',
  description: 'Un espacio etéreo para nuestros recuerdos más preciosos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nuestro Jardín'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen selection:bg-romantic-800 selection:text-romantic-100`}>
        <SplashScreen />
        <FloatingParticles />
        <main className="relative z-10 w-full min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
