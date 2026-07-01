import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ClientSkinViewer from '@/components/ClientSkinViewer'

export default function StaffPage() {
  const staffs: Array<{ name: string, role: string, uuid: string, skinUrl?: string }> = [
    { name: 'FNTPGamer', role: 'Admin', uuid: 'c91c7502252c4033820d5210b3085503' },
    { name: 'unmyeong', role: 'Staff', uuid: '5f4025b82e274cf186ef1a7d7accb225' },
    { name: 'Babeu007', role: 'Builder', uuid: 'a2f15424331245fe8d3a4dd167ac2da2' },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Staff': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Builder': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-[#c4bbf0]/20 text-[#c4bbf0] border-[#c4bbf0]/30'
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full relative z-10">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#c4bbf0] mb-4">ทีมงาน Veltrixcraft</h1>
        <p className="text-white/70">ติดต่อสอบถามปัญหา เสนอแนะ หรือขอความช่วยเหลือได้จากทีมงานด้านล่างนี้</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {staffs.map((staff, i) => (
          <div key={i} className="glass-panel p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-[#4f3b78]/40 to-transparent -z-10"></div>
            
            <div className="w-full h-56 flex items-end justify-center mb-6">
              {staff.skinUrl ? (
                <ClientSkinViewer skinUrl={staff.skinUrl} />
              ) : (
                <img 
                  src={`https://skins.mcstats.com/bust/${staff.uuid}`} 
                  alt={`${staff.name} Avatar`}
                  className="h-full object-contain filter drop-shadow-xl"
                />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">{staff.name}</h2>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold border ${getRoleColor(staff.role)}`}>{staff.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
