'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyIpButton({ ip }: { ip: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(ip)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleCopy}
      className="glass-panel px-6 py-3.5 flex items-center gap-3 hover:bg-[#8B5CF6]/20 border border-white/5 hover:border-[#8B5CF6]/50 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-1"
      title="คลิกเพื่อคัดลอก IP"
    >
      <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></span>
      <span className="font-bold text-white tracking-wide">{copied ? 'คัดลอกแล้ว!' : ip}</span>
      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white/50" />}
    </button>
  )
}
