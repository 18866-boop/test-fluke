'use client'

import { useEffect, useState } from 'react'

export default function Snowflakes() {
  const [flakes, setFlakes] = useState<Array<{ id: number, left: string, animationDuration: string, animationDelay: string, opacity: number, size: string }>>([])

  useEffect(() => {
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `-${Math.random() * 20}s`,
      opacity: Math.random() * 0.5 + 0.2,
      size: `${Math.random() * 10 + 5}px`
    }))
    setFlakes(newFlakes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {flakes.map((flake) => (
        <img
          key={flake.id}
          src="https://skins.mcstats.com/skull/c91c7502252c4033820d5210b3085503"
          alt="FNTP Snowflake"
          className="absolute top-[-40px] drop-shadow-lg"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration} linear infinite`,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes snowfall {
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
}
