import MainNavbar from '@/components/MainNavbar'
import SeasonalBackground from '@/components/SeasonalBackground'
import { getTopSupporters } from '@/app/actions'
import { Crown, Trophy, Medal } from 'lucide-react'

export const revalidate = 0

async function getUuid(username: string): Promise<string> {
  try {
    const res = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`, {
      next: { revalidate: 86400 } // cache for 24 hours
    })
    if (!res.ok) return username // fallback to username if fails
    const data = await res.json()
    return data.uuid || username
  } catch (error) {
    return username
  }
}

export default async function SupportersPage() {
  const supporters = await getTopSupporters()
  // Fetch UUIDs for all supporters to use with mcstats.com
  const supportersWithUuids = await Promise.all(
    supporters.map(async (supporter) => {
      const uuid = await getUuid(supporter.username)
      return { ...supporter, uuid }
    })
  )

  const top3 = supportersWithUuids.slice(0, 3)
  const rest = supportersWithUuids.slice(3, 10)

  // Reorder top 3 for podium (Rank 2, Rank 1, Rank 3)
  const podiumOrder = [
    top3[1] || null,
    top3[0] || null,
    top3[2] || null
  ]

  return (
    <>
      <SeasonalBackground />
      <MainNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10 w-full min-h-screen">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 text-[#c4bbf0] text-sm font-bold mb-4 border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]">Top Donators</span>
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 drop-shadow-sm">
            ทำเนียบผู้สนับสนุนสูงสุด
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            ขอขอบคุณผู้เล่นทุกคนที่สนับสนุนเซิร์ฟเวอร์ Veltrixcraft ของเราให้เปิดต่อไปได้ 
            ยอดสนับสนุนจะถูกสะสมโดยอัตโนมัติจากการซื้อสินค้าในร้านค้า
          </p>
        </div>

        {/* Podium Section */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-8 md:gap-0 mt-24 mb-24 min-h-[400px]">
          {/* Rank 2 */}
          <div className="flex flex-col items-center w-full md:w-1/3 drop-shadow-2xl order-2 md:order-1 relative z-20 group">
            <div className="relative mb-4 group-hover:-translate-y-2 transition-transform duration-500 min-h-[300px] flex flex-col items-center justify-end">
              <div className="text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)] mb-2">
                <Medal size={48} />
              </div>
              {podiumOrder[0] ? (
                <img 
                  src={`https://skins.mcstats.com/body/front/${podiumOrder[0].uuid}`} 
                  alt={podiumOrder[0].username} 
                  className="w-32 h-[260px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              ) : (
                <div className="w-32 h-[260px] flex items-center justify-center opacity-30">
                  <span className="text-white font-bold">รอผู้สนับสนุน</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-b from-gray-300 to-gray-500 w-full rounded-t-2xl p-6 text-center shadow-[0_-10px_30px_rgba(209,213,219,0.2)] border-t border-white/20 h-[140px] flex flex-col justify-end relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-20 mix-blend-overlay"></div>
              {podiumOrder[0] ? (
                <>
                  <h3 className="text-2xl font-black text-black drop-shadow-sm truncate">{podiumOrder[0].username}</h3>
                  <p className="text-black/80 font-bold mt-1">{podiumOrder[0].totalAmount.toLocaleString()} THB</p>
                </>
              ) : (
                <h3 className="text-xl font-black text-black/50 drop-shadow-sm">ว่าง</h3>
              )}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-black/20 text-6xl font-black">2</div>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center w-full md:w-1/3 drop-shadow-[0_0_50px_rgba(234,179,8,0.3)] order-1 md:order-2 relative z-30 group">
            <div className="relative mb-4 group-hover:-translate-y-2 transition-transform duration-500 min-h-[380px] flex flex-col items-center justify-end">
              <div className="text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)] mb-2">
                <Crown size={64} />
              </div>
              {podiumOrder[1] ? (
                <img 
                  src={`https://skins.mcstats.com/body/front/${podiumOrder[1].uuid}`} 
                  alt={podiumOrder[1].username} 
                  className="w-40 h-[300px] object-contain drop-shadow-[0_15px_30px_rgba(234,179,8,0.4)]"
                />
              ) : (
                <div className="w-40 h-[300px] flex items-center justify-center opacity-30">
                  <span className="text-white font-bold">รอผู้สนับสนุน</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-600 w-full rounded-t-3xl p-8 text-center shadow-[0_-20px_50px_rgba(234,179,8,0.4)] border-t-2 border-yellow-200 h-[180px] flex flex-col justify-end relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] opacity-20 mix-blend-overlay"></div>
              {podiumOrder[1] ? (
                <>
                  <h3 className="text-3xl font-black text-black drop-shadow-sm truncate">{podiumOrder[1].username}</h3>
                  <p className="text-black/90 font-black mt-2 text-xl">{podiumOrder[1].totalAmount.toLocaleString()} THB</p>
                </>
              ) : (
                <h3 className="text-2xl font-black text-black/50 drop-shadow-sm">ว่าง</h3>
              )}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-black/10 text-8xl font-black">1</div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center w-full md:w-1/3 drop-shadow-xl order-3 md:order-3 relative z-10 group">
            <div className="relative mb-4 group-hover:-translate-y-2 transition-transform duration-500 min-h-[260px] flex flex-col items-center justify-end">
              <div className="text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)] mb-2">
                <Medal size={40} />
              </div>
              {podiumOrder[2] ? (
                <img 
                  src={`https://skins.mcstats.com/body/front/${podiumOrder[2].uuid}`} 
                  alt={podiumOrder[2].username} 
                  className="w-28 h-[220px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              ) : (
                <div className="w-28 h-[220px] flex items-center justify-center opacity-30">
                  <span className="text-white font-bold">รอผู้สนับสนุน</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-b from-amber-600 to-amber-900 w-full rounded-t-2xl p-4 text-center shadow-[0_-10px_30px_rgba(217,119,6,0.2)] border-t border-amber-500/50 h-[110px] flex flex-col justify-end relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay"></div>
              {podiumOrder[2] ? (
                <>
                  <h3 className="text-xl font-black text-white drop-shadow-sm truncate">{podiumOrder[2].username}</h3>
                  <p className="text-amber-200 font-bold mt-1">{podiumOrder[2].totalAmount.toLocaleString()} THB</p>
                </>
              ) : (
                <h3 className="text-lg font-black text-white/50 drop-shadow-sm">ว่าง</h3>
              )}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-black/20 text-5xl font-black">3</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="glass-nav mt-20 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/50 text-sm">
          <p>&copy; 2026 Veltrixcraft. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
