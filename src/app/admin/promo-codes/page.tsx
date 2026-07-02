import { db } from '@/lib/firebase-admin'
import Link from 'next/link'
import { Plus, Tag, Trash2, Percent, BadgeDollarSign } from 'lucide-react'
import { deletePromoCode } from '@/app/actions'
import DeletePromoButton from './DeletePromoButton'

export const revalidate = 0

export default async function PromoCodesPage() {
  const codesSnap = await db.collection('promo_codes').orderBy('createdAt', 'desc').get()
  const promoCodes = codesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">จัดการโค้ดส่วนลด</h1>
        <Link 
          href="/admin/promo-codes/new" 
          className="bg-[#927fbf] hover:bg-[#c4bbf0] hover:text-[#363b4e] text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> เพิ่มโค้ดส่วนลด
        </Link>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-white/50 font-medium">รหัสโค้ด (Code)</th>
              <th className="p-4 text-white/50 font-medium">ส่วนลด</th>
              <th className="p-4 text-white/50 font-medium">การใช้งาน</th>
              <th className="p-4 text-white/50 font-medium">สถานะ</th>
              <th className="p-4 text-white/50 font-medium text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {promoCodes.map((code) => (
              <tr key={code.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3 font-bold text-lg">
                    <Tag size={20} className="text-indigo-400" />
                    {code.code}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {code.discountType === 'percent' ? (
                      <><Percent size={16} className="text-pink-400" /> {code.discountValue}%</>
                    ) : (
                      <><BadgeDollarSign size={16} className="text-green-400" /> ฿{code.discountValue}</>
                    )}
                  </div>
                </td>
                <td className="p-4 text-white/70">
                  {code.currentUses} / {code.maxUses === 0 ? '∞' : code.maxUses}
                </td>
                <td className="p-4">
                  {code.isActive && (code.maxUses === 0 || code.currentUses < code.maxUses) ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">ใช้งานได้</span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30">ระงับ/เต็ม</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <DeletePromoButton id={code.id} />
                </td>
              </tr>
            ))}
            {promoCodes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50">
                  ยังไม่มีโค้ดส่วนลดในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
