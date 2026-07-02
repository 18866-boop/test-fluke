'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { X, Monitor, Gamepad2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginModal() {
  const auth = useAuth()
  const [platform, setPlatform] = useState<'java' | 'bedrock'>('java')
  const [username, setUsername] = useState('')

  if (!auth) return null

  const { isLoginModalOpen, setLoginModalOpen, login } = auth

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const name = username.trim()
    if (!name) return

    if (platform === 'java') {
      setLoading(true)
      try {
        const res = await fetch(`https://api.ashcon.app/mojang/v2/user/${name}`)
        if (!res.ok) {
          setError('ไม่พบชื่อผู้เล่นนี้ในระบบ (Java Edition)')
          setLoading(false)
          return
        }
        const data = await res.json()
        login(name, platform, data.uuid)
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการตรวจสอบชื่อ')
        setLoading(false)
        return
      }
      setLoading(false)
    } else {
      login(name, platform)
    }
  }

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#1a1b26] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(139,92,246,0.15)]"
          >
            <button 
              onClick={() => setLoginModalOpen(false)}
              className="absolute right-5 top-5 text-white/40 hover:text-white hover:rotate-90 transition-all duration-300 bg-white/5 hover:bg-white/10 p-2 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c4bbf0] mb-2">Veltrixcraft</h2>
              <p className="text-white/60 text-sm">เลือกแพลตฟอร์มและใส่ชื่อในเกมของคุณ</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setPlatform('java')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                    platform === 'java' 
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
                      : 'bg-[#2A2D3E] text-white/70 hover:bg-[#32364a]'
                  }`}
                >
                  <Monitor size={18} /> Java Edition
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setPlatform('bedrock')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                    platform === 'bedrock' 
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
                      : 'bg-[#2A2D3E] text-white/70 hover:bg-[#32364a]'
                  }`}
                >
                  <Gamepad2 size={18} /> Bedrock Edition
                </motion.button>
              </div>

              <div className="space-y-2">
                <label className="block text-white/80 font-medium text-sm ml-1">ชื่อในเกม (Username)</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Steve"
                  className="w-full bg-[#13141c] border border-white/10 text-white placeholder-white/30 rounded-xl px-5 py-4 outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all shadow-inner"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'กำลังตรวจสอบ...' : (
                    <>
                      <span>เข้าสู่ระบบ</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
                {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
