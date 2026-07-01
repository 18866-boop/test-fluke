import { createProduct } from '@/app/actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">เพิ่มสินค้าใหม่</h1>
      </div>
      
      <form action={createProduct} className="glass-panel p-6 space-y-4">
        <div>
          <label className="block mb-2 text-sm text-[#c4bbf0]">ชื่อสินค้า</label>
          <input name="name" required className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]" />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-[#c4bbf0]">รายละเอียด</label>
          <textarea name="description" required rows={3} className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-[#c4bbf0]">หมวดหมู่</label>
            <select name="category" className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]">
              <option value="Ranks">ยศถาวร (Ranks)</option>
              <option value="Keys">กุญแจสุ่ม (Keys)</option>
              <option value="Items">ไอเทมพิเศษ (Items)</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-[#c4bbf0]">ราคา (บาท)</label>
            <input name="price" type="number" step="0.01" required className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]" />
          </div>
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-[#c4bbf0]">ลิงก์รูปภาพ (Optional)</label>
          <input name="imageUrl" className="w-full bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf]" placeholder="https://..." />
        </div>

        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
          <label className="block mb-2 text-sm text-blue-300 font-semibold">คำสั่ง RCON (ทำอัตโนมัติเมื่อชำระเงิน)</label>
          <input name="command" className="w-full bg-black/20 border border-blue-500/20 rounded-xl p-3 outline-none focus:border-blue-400 font-mono text-sm text-white" placeholder="เช่น give {player} diamond 64" />
          <p className="text-xs text-blue-200/70 mt-2">* ใช้คำว่า <code>{`{player}`}</code> แทนชื่อในเกมของลูกค้า ระบบจะแทนที่ให้อัตโนมัติ</p>
        </div>
        
        <button type="submit" className="w-full bg-[#927fbf] hover:bg-[#c4bbf0] hover:text-[#363b4e] text-white font-bold py-3 rounded-xl transition-colors mt-4">
          บันทึกสินค้า
        </button>
      </form>
    </div>
  )
}
