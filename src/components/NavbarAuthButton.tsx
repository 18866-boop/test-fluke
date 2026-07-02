'use client'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'

export default function NavbarAuthButton() {
  const auth = useAuth()
  
  // To avoid hydration mismatch errors with localStorage, we return null until mounted
  // but AuthProvider handles mounting for us, if user is initially null it will render null then update.
  if (!auth) return null
  
  const { user, setLoginModalOpen, logout } = auth

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {user.username.toLowerCase() === 'fntpgamer' && (
          <Link href="/admin" className="text-white/50 hover:text-white transition-colors" title="Admin Dashboard">
            <Settings size={20} />
          </Link>
        )}
        <div className="flex items-center gap-2 bg-[#363b4e] px-3 py-1.5 rounded-full border border-white/10">
          <img src={`https://mc-heads.net/avatar/${user.uuid || user.username}/32`} alt={user.username} className="w-6 h-6 rounded-md bg-black/20" />
          <span className="text-sm font-semibold">{user.username}</span>
        </div>
        <button onClick={logout} className="text-white/50 hover:text-red-400 transition-colors" title="ออกจากระบบ">
          <LogOut size={20} />
        </button>
      </div>
    )
  }

  return (
    <button 
      onClick={() => setLoginModalOpen(true)}
      className="bg-[#927fbf] hover:bg-[#c4bbf0] hover:text-[#363b4e] text-white px-6 py-2 rounded-full font-semibold transition-all"
    >
      เข้าสู่ระบบ
    </button>
  )
}
