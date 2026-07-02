import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'
import IPhoneDock from '@/components/IPhoneDock'
import WalkingCharacter from '@/components/WalkingCharacter'

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Veltrixcraft Store',
  description: 'ร้านค้าอย่างเป็นทางการของ Veltrixcraft',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={`${kanit.className} bg-[#1a1b26] text-white min-h-screen relative pb-24`}>
        <AuthProvider>
          <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>

          <IPhoneDock />
          <LoginModal />
          <WalkingCharacter />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
