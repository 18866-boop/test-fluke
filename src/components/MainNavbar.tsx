import Link from 'next/link'

import MobileMenu from './MobileMenu'
import NavbarAuthButton from './NavbarAuthButton'

export default function MainNavbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link href="/" className="text-2xl font-bold text-[#c4bbf0] flex items-center gap-3 hover:text-white transition-colors mr-6">
            <img src="https://media.discordapp.net/attachments/1491091439797403699/1501593391413198980/file_0000000088d47207a07875a29649ad84-removebg-preview.png?ex=6a472012&is=6a45ce92&hm=87c41c7e7d7183d58f74e43b38328962248f5a6570f88d00f4d62144975a7fd8" alt="Veltrixcraft Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
            Veltrixcraft
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-white/80 hover:text-white font-medium transition-colors">ร้านค้า</Link>
            <Link href="/supporters" className="text-white/80 hover:text-[#c4bbf0] font-bold transition-colors flex items-center gap-1">
              Top Donators
            </Link>
          </div>
        </div>
        <NavbarAuthButton />
      </div>
    </nav>
  )
}
