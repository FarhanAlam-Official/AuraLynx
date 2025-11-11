import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AuraLynx - AI-Powered Music Creation',
  description: 'Create complete songs from text or voice using free, open-source AI models',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
