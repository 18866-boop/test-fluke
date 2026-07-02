'use client'
import { useEffect, useState, memo } from 'react'

type Season = 'winter' | 'spring' | 'summer' | 'autumn'

const SeasonalBackground = memo(() => {
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
    // Reduce particle count slightly for better performance on mobile
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `-${Math.random() * 20}s`,
      size: `${Math.random() * 10 + 5}px`,
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
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute top-[-20px] ${getParticleStyle(season)}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `seasonalFall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes seasonalFall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(180deg);
          }
          100% {
            transform: translateY(100vh) translateX(-20px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
})

SeasonalBackground.displayName = 'SeasonalBackground'

export default SeasonalBackground
