import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import { meta } from '@/content/aegis';
import './globals.css';

/* Archivo for structure; IBM Plex Mono for every piece of technical data.
   Plex Mono was drawn for technical documentation, which is what this page
   is — it reads as citation rather than as a code editor. */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-archivo',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = { title: meta.title, description: meta.description };
export const viewport = { themeColor: '#0A0E10', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
