import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const BASE_URL = 'https://www.missoulalegends.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EFE6' },
    { media: '(prefers-color-scheme: dark)', color: '#101411' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Missoula Legends | The Definitive Guide to the Garden City",
    template: "%s | Missoula Legends",
  },
  description: "A local guide and directory highlighting the shops, neighborhood favorites, and history of Missoula, Montana.",
  authors: [{ name: 'Trevor Riggs', url: BASE_URL }],
  creator: 'Trevor Riggs',
  publisher: 'Missoula Legends',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Missoula Legends',
    title: 'Missoula Legends | The Definitive Guide to the Garden City',
    description: 'A local guide and directory highlighting the shops, neighborhood favorites, and history of Missoula, Montana.',
    images: [
      {
        url: '/media/missoula-hero-twilight.webp',
        width: 1200,
        height: 630,
        alt: 'Scenic twilight view of Missoula, Montana, showing the city valley and surrounding mountains',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Missoula Legends | The Definitive Guide to the Garden City',
    description: 'A local guide and directory highlighting the shops, neighborhood favorites, and history of Missoula, Montana.',
    images: ['/media/missoula-hero-twilight.webp'],
    creator: '@missoulalegends',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollProgressBar />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KD1J5WFNV0"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KD1J5WFNV0');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
