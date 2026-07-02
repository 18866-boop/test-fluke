import { db } from '@/lib/firebase-admin'
import { Box, Users, Copy, ShoppingCart, Gavel, ShieldHalf } from 'lucide-react'
import Link from 'next/link'
import StoreProducts from '@/components/StoreProducts'
import NavbarAuthButton from '@/components/NavbarAuthButton'
import HeroServerStatus from '@/components/HeroServerStatus'
import HeroAnimatedLayout from '@/components/HeroAnimatedLayout'
import CopyIpButton from '@/components/CopyIpButton'
import SeasonalBackground from '@/components/SeasonalBackground'

import MainNavbar from '@/components/MainNavbar'

export const revalidate = 0

export default async function Home() {
  const productsSnap = await db.collection('products').orderBy('price', 'asc').get()
  const products = productsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any[]

  return (
    <>
      <SeasonalBackground />
      <MainNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        <HeroAnimatedLayout>
          <div className="flex-1 relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c4bbf0]/20 text-[#c4bbf0] text-sm font-bold mb-4 border border-[#c4bbf0]/30 shadow-[0_0_15px_rgba(196,187,240,0.2)]">Veltrixcraft Store</span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-[#e2dfff] to-[#927fbf] text-transparent bg-clip-text drop-shadow-sm leading-tight">สนับสนุนเซิร์ฟเวอร์<br/>ยกระดับความสนุก</h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">เลือกหมวดหมู่สินค้าและเติมเงินสำหรับเซิร์ฟเวอร์ Veltrixcraft ของเรา สนับสนุนเพื่อรับยศและไอเทมพิเศษมากมาย!</p>
            
            <div className="flex flex-wrap items-center gap-5">
              <CopyIpButton ip="VeltrixCraftmc.com" />
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
