'use client'

import { useState } from 'react'
import generatePayload from 'promptpay-qr'
import { X, CreditCard, Gift, Loader2, Check } from 'lucide-react'
import { createOrder } from '@/app/actions'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

export default function StoreProducts({ products }: { products: any[] }) {
  const auth = useAuth()
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'promptpay'|'truewallet'>('promptpay')
  const [voucherLink, setVoucherLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Generate PromptPay QR
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0
  const qrCode = selectedProduct ? generatePayload('0812345678', { amount: totalPrice }) : ''
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`

  const handleProductClick = (product: any) => {
    if (!auth?.user) {
      auth?.setLoginModalOpen(true)
    } else {
      setSelectedProduct(product)
      setQuantity(1)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth?.user) return

    setLoading(true)
    
    // Fake payment processing delay
    await new Promise(r => setTimeout(r, 2000))
    
    await createOrder({
      productId: selectedProduct.id,
      customerName: auth.user.username,
      amount: totalPrice,
      paymentMethod,
      quantity
    })
    
    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      setSelectedProduct(null)
      setSuccess(false)
      setVoucherLink('')
    }, 4000)
  }

  const categories = ['Ranks', 'Keys', 'Items']

  return (
    <>
      {categories.map((category, catIdx) => {
        const catProducts = products.filter(p => p.category === category)
        if (catProducts.length === 0) return null
        
        return (
          <motion.div 
            key={category} 
            className="mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 flex items-center gap-3">
              {category === 'Ranks' ? 'ยศถาวร' : category === 'Keys' ? 'กุญแจสุ่ม' : 'ไอเทมพิเศษ'} 
              <span className="text-white/30 text-sm font-normal">({category})</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {catProducts.map(product => (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  key={product.id} 
                  onClick={() => handleProductClick(product)} 
                  className="glass-panel p-6 cursor-pointer border border-white/5 hover:border-[#927fbf]/50 hover:bg-[#927fbf]/10 transition-colors duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c4bbf0]/0 to-[#c4bbf0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {product.imageUrl && (
                    <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                      <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#c4bbf0] mb-2 relative z-10">{product.name}</h3>
                  <p className="text-white/60 mb-4 h-12 overflow-hidden relative z-10 text-sm leading-relaxed">{product.description}</p>
                  <div className="text-2xl font-extrabold relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">฿{product.price.toFixed(2)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      })}

      {products.length === 0 && (
        <div className="text-center py-20 text-white/50">
          <p className="text-xl">ยังไม่มีสินค้าในร้านค้า</p>
        </div>
      )}

      {/* Checkout Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#1a1b26] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative shadow-[0_0_50px_rgba(139,92,246,0.15)] max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => !loading && !success && setSelectedProduct(null)} className="absolute top-5 right-5 text-white/40 hover:text-white hover:rotate-90 transition-all duration-300 bg-white/5 hover:bg-white/10 p-2 rounded-full">
                <X size={20} />
              </button>
              
              {success ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                    className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  >
                    <Check size={48} strokeWidth={3} />
                  </motion.div>
                  <h2 className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">ชำระเงินสำเร็จ!</h2>
                  <p className="text-white/70">ขอบคุณที่สนับสนุน Veltrixcraft ไอเทมจะถูกส่งเข้าตัวละคร <strong className="text-white">{auth?.user?.username}</strong> เร็วๆ นี้</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                    {selectedProduct.imageUrl && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                      </div>
                    )}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c4bbf0]">สั่งซื้อ {selectedProduct.name}</h2>
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mt-2 gap-3 sm:gap-0">
                        <p className="text-xl font-semibold text-[#8B5CF6]">฿{totalPrice.toFixed(2)}</p>
                        {selectedProduct.category !== 'Ranks' && (
                          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                            <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">-</button>
                            <span className="font-bold text-white w-6 text-center">{quantity}</span>
                            <button type="button" onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleCheckout} className="space-y-5">
                    <div className="bg-[#13141c] p-4 rounded-2xl flex items-center gap-4 mb-4 border border-white/5 shadow-inner">
                      <div className="relative">
                        <img src={`https://mc-heads.net/avatar/${auth?.user?.username}/64`} alt="Avatar" className="w-14 h-14 rounded-xl bg-[#2A2D3E]" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#13141c]"></div>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">สั่งซื้อให้ตัวละคร</p>
                        <p className="font-bold text-lg text-white">{auth?.user?.username}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3 text-white/80 ml-1">ช่องทางชำระเงิน</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => setPaymentMethod('promptpay')} className={`flex-1 p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'promptpay' ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-[#2A2D3E] border-white/5 text-white/50 hover:bg-[#32364a]'}`}>
                          <CreditCard size={24} className={paymentMethod === 'promptpay' ? 'text-[#8B5CF6]' : ''} /> 
                          <span className="font-semibold">PromptPay</span>
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => setPaymentMethod('truewallet')} className={`flex-1 p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'truewallet' ? 'bg-[#f68b1f]/20 border-[#f68b1f] text-white shadow-[0_0_15px_rgba(246,139,31,0.2)]' : 'bg-[#2A2D3E] border-white/5 text-white/50 hover:bg-[#32364a]'}`}>
                          <Gift size={24} className={paymentMethod === 'truewallet' ? 'text-[#f68b1f]' : ''} /> 
                          <span className="font-semibold">ซองของขวัญ</span>
                        </motion.button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {paymentMethod === 'promptpay' && (
                        <motion.div 
                          key="promptpay"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white p-6 rounded-2xl flex flex-col items-center border border-[#8B5CF6]/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden"
                        >
                          <img src={qrImage} alt="PromptPay QR" className="w-56 h-56 mb-4" />
                          <p className="text-gray-900 text-base font-bold bg-[#8B5CF6]/10 px-4 py-2 rounded-full text-[#8B5CF6]">สแกนเพื่อจ่าย ฿{totalPrice.toFixed(2)}</p>
                        </motion.div>
                      )}

                      {paymentMethod === 'truewallet' && (
                        <motion.div 
                          key="truewallet"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 rounded-2xl border border-[#f68b1f]/30 bg-[#f68b1f]/10 overflow-hidden"
                        >
                          <label className="block text-sm font-medium mb-2 text-[#f68b1f] ml-1">ลิงก์ซองของขวัญ TrueWallet</label>
                          <input required value={voucherLink} onChange={e => setVoucherLink(e.target.value)} className="w-full bg-[#13141c] border border-white/10 rounded-xl p-4 outline-none focus:border-[#f68b1f] focus:ring-1 focus:ring-[#f68b1f] text-white transition-all shadow-inner" placeholder="https://gift.truemoney.com/campaign/?v=..." />
                          <p className="text-xs text-white/60 mt-3 flex items-start gap-1">
                            <span className="text-[#f68b1f] font-bold">*</span>
                            สร้างซองของขวัญแบบ "แบ่งจำนวนเงินเท่ากัน" และใส่ยอด ฿{totalPrice.toFixed(2)} เป๊ะๆ
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading} 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-bold py-4 rounded-xl mt-6 flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {loading ? <><Loader2 className="animate-spin" /> กำลังตรวจสอบข้อมูล...</> : 'ยืนยันการชำระเงิน'}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
