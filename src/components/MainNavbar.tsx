'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MobileMenu from './MobileMenu'
import NavbarAuthButton from './NavbarAuthButton'

export default function MainNavbar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'ร้านค้า', path: '/' },
    { name: 'กฎกติกา', path: '/rules' },
    { name: 'ทีมงาน', path: '/staff' },
    { name: 'Top Donators', path: '/supporters' },
  ]

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link href="/" className="text-2xl font-bold text-[#c4bbf0] flex items-center gap-3 hover:text-white transition-colors">
            <img src="https://media.discordapp.net/attachments/1491091439797403699/1501593391413198980/file_0000000088d47207a07875a29649ad84-removebg-preview.png?ex=6a472012&is=6a45ce92&hm=87c41c7e7d7183d58f74e43b38328962248f5a6570f88d00f4d62144975a7fd8" alt="Veltrixcraft Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
            Veltrixcraft
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link 
                key={item.path}
                href={item.path} 
                className={`px-4 py-2 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'bg-transparent border border-transparent text-white/70 hover:text-white hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Right: Auth Button */}
        <div className="flex items-center">
          <NavbarAuthButton />
        </div>
      </div>
    </nav>
  )
}
