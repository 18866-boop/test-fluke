import { getManualSupporters, setManualSupporter, deleteManualSupporter } from '@/app/actions'
import { Plus, Trash2, Edit } from 'lucide-react'

export const revalidate = 0

export default async function AdminSupportersPage() {
  const manualSupporters = await getManualSupporters()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">จัดการยอดสนับสนุน (Manual)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to Add/Update */}
        <div className="lg:col-span-1 bg-[#1a1b26] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">เพิ่ม/แก้ไขยอดสนับสนุน</h2>
          <form action={setManualSupporter} className="space-y-4">
            <div>
              <label className="block text-white/60 mb-2 text-sm">ชื่อในเกม (Username)</label>
              <input 
                type="text" 
                name="username" 
                required 
                placeholder="Steve"
                className="w-full bg-[#13141c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-2 text-sm">ยอดเงินสนับสนุน (THB)</label>
              <input 
                type="number" 
                name="amount" 
                required 
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-[#13141c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] outline-none transition-all"
              />
              <p className="text-xs text-white/40 mt-2">ยอดนี้จะถูกนำไปบวกเพิ่มกับยอดสะสมอัตโนมัติ (ถ้ามี)</p>
            </div>
            
            <button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Plus size={18} /> บันทึกข้อมูล
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 bg-[#1a1b26] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/60">
                  <th className="p-4 font-medium">Username</th>
                  <th className="p-4 font-medium">ยอด Manual (THB)</th>
                  <th className="p-4 font-medium">อัปเดตล่าสุด</th>
                  <th className="p-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {manualSupporters.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/40">
                      ยังไม่มีข้อมูลการเพิ่มยอดแบบ Manual
                    </td>
                  </tr>
                ) : (
                  manualSupporters.map((supporter: any) => (
                    <tr key={supporter.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-white font-bold">{supporter.username}</td>
                      <td className="p-4 text-green-400 font-bold">{supporter.amount.toFixed(2)}</td>
                      <td className="p-4 text-white/60 text-sm">
                        {new Date(supporter.updatedAt || supporter.createdAt).toLocaleString('th-TH')}
                      </td>
                      <td className="p-4 text-right">
                        <form action={async () => {
                          'use server'
                          await deleteManualSupporter(supporter.id)
                        }}>
                          <button 
                            type="submit"
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                            title="ลบข้อมูล"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
