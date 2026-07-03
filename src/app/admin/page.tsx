import { db } from '@/lib/firebase-admin'
import { DollarSign, Package, ShoppingCart } from 'lucide-react'
import RevenueGraph from '@/components/RevenueGraph'

export const revalidate = 0

export default async function AdminDashboard() {
  const productsSnap = await db.collection('products').get()
  const ordersSnap = await db.collection('orders').get()
  const completedOrdersSnap = await db.collection('orders').where('status', '==', 'completed').get()

  const productsCount = productsSnap.size
  const ordersCount = ordersSnap.size
  const orders = completedOrdersSnap.docs.map((doc: any) => doc.data())
  
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.amount, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#c4bbf0]">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform border border-white/5 shadow-xl">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
            <DollarSign size={32} />
          </div>
          <div>
            <p className="text-sm text-white/50 font-medium">รายได้รวม</p>
            <p className="text-2xl font-bold text-white">฿{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform border border-white/5 shadow-xl">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Package size={32} />
          </div>
          <div>
            <p className="text-sm text-white/50 font-medium">สินค้าทั้งหมด</p>
            <p className="text-2xl font-bold text-white">{productsCount} รายการ</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform border border-white/5 shadow-xl">
          <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
            <ShoppingCart size={32} />
          </div>
          <div>
            <p className="text-sm text-white/50 font-medium">รายการสั่งซื้อ</p>
            <p className="text-2xl font-bold text-white">{ordersCount} รายการ</p>
          </div>
        </div>
      </div>

      <RevenueGraph orders={orders} />
    </div>
  )
}
