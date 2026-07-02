'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export default function SeasonalBackground() {
  const [season, setSeason] = useState<Season>('winter')
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    // Determine season based on month
    const month = new Date().getMonth() + 1 // 1-12
    if (month === 12 || month === 1 || month === 2) setSeason('winter')
    else if (month >= 3 && month <= 5) setSeason('spring')
    else if (month >= 6 && month <= 8) setSeason('summer')
    else setSeason('autumn')

    // Generate random particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      yOffset: Math.random() * -100, // start above screen
      size: Math.random() * 10 + 5, // size in px
      duration: Math.random() * 10 + 10, // fall duration in seconds
      delay: Math.random() * 5, // start delay
      opacity: Math.random() * 0.5 + 0.2
    }))
    setParticles(newParticles)
  }, [])

  const getParticleStyle = (s: Season) => {
    switch(s) {
      case 'winter': return 'bg-white rounded-full blur-[1px]'
      case 'spring': return 'bg-pink-300 rounded-[50%_0_50%_50%] rotate-45' // Petal shape
      case 'summer': return 'bg-yellow-300 rounded-full blur-[2px] shadow-[0_0_10px_#fde047]' // Firefly
      case 'autumn': return 'bg-orange-400 rounded-[50%_0_50%_0] rotate-[30deg]' // Leaf shape
      default: return 'bg-white rounded-full'
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className={`absolute ${getParticleStyle(season)}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            opacity: p.opacity,
          }}
          initial={{ y: `${p.yOffset}vh`, x: 0, rotate: 0 }}
          animate={{ 
            y: '120vh', 
            x: [0, 20, -20, 0], 
            rotate: 360 
          }}
          transition={{
            y: {
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            },
            x: {
              duration: p.duration / 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay
            },
            rotate: {
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }
          }}
        />
      ))}
    </div>
  )
}
