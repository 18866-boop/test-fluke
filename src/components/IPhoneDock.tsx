'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Store, ShieldAlert, Users } from 'lucide-react'

export default function IPhoneDock() {
  const pathname = usePathname()
  
  // Hide on admin routes
  if (!pathname || pathname.startsWith('/admin')) return null

  const navItems = [
    { name: 'ร้านค้า', path: '/', icon: Store },
    { name: 'กฎกติกา', path: '/rules', icon: ShieldAlert },
    { name: 'ทีมงาน', path: '/staff', icon: Users },
  ]

  return (
    <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-full flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className="relative px-5 py-3 rounded-full flex flex-col items-center gap-1 transition-all"
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon size={22} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} />
              <span className={`text-[10px] font-medium relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
