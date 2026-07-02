'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createPromoCode } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function NewPromoCodePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData(e.currentTarget)
      await createPromoCode(formData)
      // Redirect happens in server action on success
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/promo-codes" className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">เพิ่มโค้ดส่วนลด</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm text-[#c4bbf0]">โค้ดส่วนลด (เช่น SUMMER2026)</label>
          <input 
            required 
            name="code" 
            className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf] uppercase font-mono" 
            placeholder="รหัสโค้ด" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-[#c4bbf0]">ประเภทส่วนลด</label>
            <select name="discountType" className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]">
              <option value="percent">เปอร์เซ็นต์ (%)</option>
              <option value="fixed">ราคาคงที่ (บาท)</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-[#c4bbf0]">มูลค่าส่วนลด</label>
            <input 
              required 
              type="number" 
              name="discountValue"
              step="0.01"
              min="0"
              className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]" 
              placeholder="ตัวเลขส่วนลด" 
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-[#c4bbf0]">จำกัดจำนวนครั้ง (0 = ไม่จำกัด)</label>
          <input 
            type="number" 
            name="maxUses"
            defaultValue="0"
            min="0"
            className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#927fbf] hover:bg-[#c4bbf0] hover:text-[#363b4e] text-white font-bold py-3 rounded-xl transition-colors mt-4 flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'บันทึกโค้ดส่วนลด'}
        </button>
      </form>
    </div>
  )
}
