import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Goigoe Wealthcare Portal | Login & Registration',
  description: 'Access your Goigoe Wealthcare Portal account. Secure login and registration portal for managing your healthcare benefits and administrative services.',
  keywords: 'Goigoe Wealthcare Portal, healthcare portal, benefits management, administrative services, login, registration, healthcare benefits',
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
    description: 'Access your Goigoe Wealthcare Portal account. Secure login and registration portal for managing your healthcare benefits and administrative services.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goigoe Wealthcare Portal | Login & Registration',
    description: 'Access your Goigoe Wealthcare Portal account. Secure login and registration portal for managing your healthcare benefits.',
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
