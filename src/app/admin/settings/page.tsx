'use client'

import { useState, useEffect } from 'react'
import { getStoreSettings, updateStoreSettings } from '@/app/actions'
import { Plus, X, Loader2, Save } from 'lucide-react'

export default function SettingsPage() {
  const [servers, setServers] = useState<string[]>([])
  const [newServer, setNewServer] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getStoreSettings().then(settings => {
      setServers(settings.servers || [])
      setLoading(false)
    })
  }, [])

  const handleAddServer = () => {
    const trimmed = newServer.trim().toLowerCase()
    if (!trimmed) return
    if (servers.includes(trimmed)) return
    
    setServers([...servers, trimmed])
    setNewServer('')
  }

  const handleRemoveServer = (server: string) => {
    setServers(servers.filter(s => s !== server))
  }

  const handleSave = async () => {
    if (servers.length === 0) {
      setMessage('ต้องมีอย่างน้อย 1 เซิร์ฟเวอร์')
      return
    }
    
    setSaving(true)
    setMessage('')
    try {
      await updateStoreSettings(servers)
      setMessage('บันทึกการตั้งค่าสำเร็จ!')
    } catch (err: any) {
      setMessage(`เกิดข้อผิดพลาด: ${err.message}`)
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-white/50" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#c4bbf0]">ตั้งค่าระบบ</h1>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <h2 className="text-xl font-bold">เซิร์ฟเวอร์ที่เปิดรับเติมเงิน</h2>
        <p className="text-white/60 text-sm">เพิ่มรายชื่อเซิร์ฟเวอร์ที่ผู้เล่นสามารถเลือกรับไอเทมได้ในหน้าร้านค้า (ภาษาอังกฤษตัวเล็ก เช่น survival, oneblock)</p>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newServer}
            onChange={(e) => setNewServer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddServer()}
            placeholder="ชื่อเซิร์ฟเวอร์ (เช่น skyblock)" 
            className="flex-1 bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-3 outline-none focus:border-[#927fbf] text-white" 
          />
          <button 
            onClick={handleAddServer}
            className="bg-[#927fbf] hover:bg-[#c4bbf0] hover:text-[#363b4e] text-white px-6 rounded-xl font-bold transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> เพิ่ม
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {servers.map(server => (
            <div key={server} className="flex items-center gap-2 bg-[#1a1b26] border border-[#8B5CF6]/30 px-4 py-2 rounded-xl">
              <span className="font-medium capitalize">{server}</span>
              <button onClick={() => handleRemoveServer(server)} className="text-red-400 hover:text-red-300 transition-colors ml-2">
                <X size={16} />
              </button>
            </div>
          ))}
          {servers.length === 0 && <p className="text-white/50 text-sm">ยังไม่มีเซิร์ฟเวอร์ในระบบ</p>}
        </div>

        <div className="pt-6 border-t border-white/10 mt-6 flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={saving || servers.length === 0}
            className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} บันทึกการตั้งค่า
          </button>
          
          {message && (
            <p className={message.includes('สำเร็จ') ? 'text-green-400' : 'text-red-400'}>{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
