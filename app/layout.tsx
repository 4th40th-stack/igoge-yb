import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Goigoe Wealthcare Portal | Login & Registration',
  description: 'Log in to Igoe Administrative Services. Access your COBRA, FSA, and HRA accounts. View transaction history, manage premium billing, and download benefit resources.',
  keywords: 'Igoe login, goIgoe login, Igoe benefits sign in, Igoe COBRA login, Igoe spending account portal, Igoe administrative services participant login',
  authors: [{ name: 'Igoe Administrative Services' }],
  creator: 'Igoe Administrative Services',
  publisher: 'Igoe Administrative Services',
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
    url: 'https://goigoe-wealthcareportal.com',
    siteName: 'Goigoe Wealthcare Portal',
    title: 'Goigoe Wealthcare Portal | Login & Registration',
    description: 'Log in to Igoe Administrative Services. Access your COBRA, FSA, and HRA accounts. View transaction history, manage premium billing, and download benefit resources.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goigoe Wealthcare Portal | Login & Registration',
    description: 'Log in to Igoe Administrative Services. Access your COBRA, FSA, and HRA accounts. View transaction history, manage premium billing, and download benefit resources.',
  },
  icons: {
    icon: '/img/Fav icon.png',
    shortcut: '/img/Fav icon.png',
    apple: '/img/Fav icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
