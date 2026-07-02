'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Crown, ShoppingCart, MessageSquare, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-[#c4bbf0] hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Sidebar */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-[100dvh] w-80 max-w-[85vw] bg-[#1a1b26] border-r border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <span className="text-xl font-bold text-white">เมนู</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/50 hover:text-white bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                <Link href="/" onClick={() => setIsOpen(false)} className="block w-full text-left px-5 py-4 rounded-xl font-extrabold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                  HOME
                </Link>
                <Link href="#" onClick={() => setIsOpen(false)} className="block w-full text-left px-5 py-4 rounded-xl font-bold text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                  NEWS
                </Link>
                <Link href="#" onClick={() => setIsOpen(false)} className="block w-full text-left px-5 py-4 rounded-xl font-bold text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                  GUIDES
                </Link>
                <Link href="#" onClick={() => setIsOpen(false)} className="block w-full text-left px-5 py-4 rounded-xl font-bold text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                  RULES
                </Link>
                <Link href="#" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-5 py-4 rounded-xl font-bold text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                  <Crown size={20} /> PATRON
                </Link>
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-5 py-4 rounded-xl font-extrabold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                  <ShoppingCart size={20} /> STORE
                </Link>
                <Link href="#" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-5 py-4 rounded-xl font-extrabold text-white bg-[#5865F2] hover:bg-[#4752C4] transition-colors shadow-lg shadow-[#5865F2]/20 mt-6">
                  <MessageSquare size={20} /> 6,791
                </Link>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('VeltrixCraftmc.com')
                    setIsOpen(false)
                    alert('คัดลอก IP แล้ว!')
                  }} 
                  className="flex items-center gap-3 w-full px-5 py-4 rounded-xl font-extrabold text-green-400 bg-[#13141c] hover:bg-[#20212f] border border-green-500/30 transition-colors mt-2"
                >
                  <Gamepad2 size={20} /> PLAY.VELTRIXCRAFT.COM
                </button>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
