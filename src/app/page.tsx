import { db } from '@/lib/firebase-admin'
import { Box, Users, Copy, ShoppingCart, Gavel, ShieldHalf } from 'lucide-react'
import Link from 'next/link'
import StoreProducts from '@/components/StoreProducts'
import NavbarAuthButton from '@/components/NavbarAuthButton'
import HeroServerStatus from '@/components/HeroServerStatus'
import HeroAnimatedLayout from '@/components/HeroAnimatedLayout'

export const revalidate = 0

export default async function Home() {
  const productsSnap = await db.collection('products').orderBy('price', 'asc').get()
  const products = productsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any[]

  return (
    <>
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#c4bbf0] flex items-center gap-3">
            <img src="https://cdn.discordapp.com/attachments/1491091439797403699/1501593391413198980/file_0000000088d47207a07875a29649ad84-removebg-preview.png?ex=6a4525d2&is=6a43d452&hm=738c6c52b0dbf050f610dd979b443fac026d5a8fdce4c0e87aae12a9fc162ef3&" alt="Veltrixcraft Logo" className="w-12 h-12 object-contain" />
            Veltrixcraft
          </Link>
          <NavbarAuthButton />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        <HeroAnimatedLayout>
          <div className="flex-1 relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c4bbf0]/20 text-[#c4bbf0] text-sm font-bold mb-4 border border-[#c4bbf0]/30 shadow-[0_0_15px_rgba(196,187,240,0.2)]">Veltrixcraft Store</span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-[#e2dfff] to-[#927fbf] text-transparent bg-clip-text drop-shadow-sm leading-tight">สนับสนุนเซิร์ฟเวอร์<br/>ยกระดับความสนุก</h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">เลือกหมวดหมู่สินค้าและเติมเงินสำหรับเซิร์ฟเวอร์ Veltrixcraft ของเรา สนับสนุนเพื่อรับยศและไอเทมพิเศษมากมาย!</p>
            
            <div className="flex flex-wrap items-center gap-5">
              <button className="glass-panel px-6 py-3.5 flex items-center gap-3 hover:bg-[#8B5CF6]/20 border border-white/5 hover:border-[#8B5CF6]/50 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-1">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></span>
                <span className="font-bold text-white tracking-wide">Veltrixcraft.com</span>
                <Copy size={16} className="text-white/50" />
              </button>
              <HeroServerStatus />
            </div>
          </div>
          <div className="flex-1 flex justify-center relative z-10">
             <img src="https://skins.mcstats.com/body/front/e275dcd302554980bfa093b0bb3f6330" alt="PENKVIN Avatar" className="filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] animate-[float_6s_ease-in-out_infinite_alternate] hover:scale-105 transition-transform duration-500" />
          </div>
        </HeroAnimatedLayout>

        <StoreProducts products={products} />
        
      </main>

      <footer className="glass-nav mt-auto py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/50 text-sm">
          <p>&copy; 2026 Veltrixcraft. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
