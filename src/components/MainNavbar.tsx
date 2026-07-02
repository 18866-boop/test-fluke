import Link from 'next/link'
import { Box } from 'lucide-react'
import MobileMenu from './MobileMenu'
import NavbarAuthButton from './NavbarAuthButton'

export default function MainNavbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link href="/" className="text-2xl font-bold text-[#c4bbf0] flex items-center gap-3">
            <Box size={32} className="text-[#927fbf]" />
            Veltrixcraft
          </Link>
        </div>
        <NavbarAuthButton />
      </div>
    </nav>
  )
}
