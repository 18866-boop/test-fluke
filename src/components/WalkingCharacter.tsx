'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function WalkingCharacter() {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (windowWidth === 0) return null

  // We will animate the character walking from left to right, then right to left.
  return (
    <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-50 overflow-hidden">
      <motion.div
        className="absolute bottom-0 h-24 w-24"
        animate={{
          x: [ -100, windowWidth, windowWidth, -100, -100 ],
          scaleX: [ 1, 1, -1, -1, 1 ] // Flip the character when turning around
        }}
        transition={{
          duration: 20, // 20 seconds for a full round trip
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <motion.img
          src="https://starlightskins.lunareclipse.studio/render/default/c91c7502252c4033820d5210b3085503/full"
          alt="FNTPGamer"
          className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          animate={{
            y: [0, -10, 0] // Bobbing up and down to simulate walking
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
      </motion.div>
    </div>
  )
}
