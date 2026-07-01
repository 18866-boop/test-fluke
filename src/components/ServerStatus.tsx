'use client'

import { useState, useEffect } from 'react'

export default function ServerStatus() {
  const [players, setPlayers] = useState<number | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('https://api.mcsrvstat.us/3/veltrixcraft.con')
        const data = await res.json()
        setIsOnline(data.online)
        if (data.online) {
          setPlayers(data.players.online)
        }
      } catch (err) {
        console.error("Failed to fetch server status", err)
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-red-500'}`}></div>
      <span className="text-white/80">
        {isOnline ? `กำลังเล่น: ${players !== null ? players : '...'} คน` : 'ออฟไลน์'}
      </span>
    </div>
  )
}
