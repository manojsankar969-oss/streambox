import { Epilogue, Manrope } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import QueryProvider from '@/components/QueryProvider'
import { FirebaseAuthProvider } from '@/hooks/useFirebaseAuth'

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata = {
  title: 'Digital Cinema - Premium Movie Library',
  description: 'Discover and explore movies, TV shows, actors and more',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${epilogue.variable} ${manrope.variable} dark`}>
      <body className="font-manrope bg-background text-foreground antialiased selection:bg-primary selection:text-black">
        <FirebaseAuthProvider>
          <QueryProvider>
            <ThemeProvider>
              <Navbar />
              <main className="pt-20">
                {children}
              </main>
              <Footer />
            </ThemeProvider>
          </QueryProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}