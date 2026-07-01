'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function HeroAnimatedLayout({ children }: { children: ReactNode }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="glass-panel p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 mb-16 relative overflow-hidden"
    >
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#4f3b78]/20 rounded-full blur-[100px] pointer-events-none"></div>
      {children}
    </motion.section>
  )
}
