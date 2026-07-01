'use client'
import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

export default function HeroServerStatus() {
  const [players, setPlayers] = useState<number | null>(null)
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('https://api.mcsrvstat.us/3/veltrixcraft.con')
        const data = await res.json()
        if (data.online) setPlayers(data.players.online)
      } catch (err) {}
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-white/70">
      <Users size={18} /> กำลังเล่น {players !== null ? players : '...'} คน
    </div>
  )
}
