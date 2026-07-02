import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Ticket } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 glass-panel m-4 flex flex-col border border-white/5 relative z-10">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-[#c4bbf0]">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all">
            <LayoutDashboard size={20} className="text-indigo-400" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all">
            <Package size={20} className="text-indigo-400" /> สินค้า (Products)
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all">
            <ShoppingCart size={20} className="text-indigo-400" /> รายการสั่งซื้อ
          </Link>
          <Link href="/admin/promo-codes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all">
            <Ticket size={20} className="text-indigo-400" /> โค้ดส่วนลด
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={20} /> กลับหน้าร้านค้า
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
