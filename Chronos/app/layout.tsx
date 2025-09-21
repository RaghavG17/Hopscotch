import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { AuthProvider } from '@/lib/auth-context'
import { UserProgressProvider } from '@/context/UserProgressContext'
import { ConfigInitializer } from '@/components/config-initializer'
import './globals.css'

export const metadata: Metadata = {
  title: 'LifeLine - Turn Your Life Into a Visual Story',
  description: 'Build interactive timelines of your milestones, get AI-powered goal suggestions, and connect with others who share your aspirations.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ConfigInitializer />
        <AuthProvider>
          <UserProgressProvider>
            {children}
          </UserProgressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
