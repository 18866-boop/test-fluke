'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Ticket, Star, Settings } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'สินค้า (Products)', href: '/admin/products', icon: Package },
    { name: 'รายการสั่งซื้อ', href: '/admin/orders', icon: ShoppingCart },
    { name: 'โค้ดส่วนลด', href: '/admin/promo-codes', icon: Ticket },
    { name: 'ผู้สนับสนุน (Supporters)', href: '/admin/supporters', icon: Star },
    { name: 'ตั้งค่าระบบ', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 glass-panel m-4 flex flex-col border border-white/5 relative z-10">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-[#c4bbf0]">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#8B5CF6]/20 text-[#c4bbf0] border border-[#8B5CF6]/30' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#c4bbf0]' : 'text-indigo-400'} /> 
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-white/80 hover:text-red-400 transition-all">
            <LogOut size={20} /> ออกจากระบบ
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  )
}
