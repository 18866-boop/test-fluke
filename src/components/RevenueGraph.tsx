'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'

export default function RevenueGraph({ orders }: { orders: any[] }) {
  const [data, setData] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    if (!orders || orders.length === 0) {
      setData([])
      return
    }

    const [year, month] = selectedMonth.split('-').map(Number)
    const daysInMonth = new Date(year, month, 0).getDate()
    
    // Initialize data array with all days of the month
    const monthData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      name: `${i + 1}`,
      revenue: 0
    }))

    // Aggregate orders
    orders.forEach(order => {
      if (order.status === 'completed' && order.createdAt) {
        const orderDate = new Date(order.createdAt)
        if (orderDate.getFullYear() === year && orderDate.getMonth() + 1 === month) {
          const day = orderDate.getDate()
          monthData[day - 1].revenue += order.amount || 0
        }
      }
    })

    setData(monthData)
  }, [orders, selectedMonth])

  return (
    <div className="glass-panel p-6 mt-8 border border-white/5 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">กราฟรายได้รายเดือน</h2>
          <p className="text-sm text-white/50">ยอดรายได้จากคำสั่งซื้อที่เสร็จสมบูรณ์</p>
        </div>
        <input 
          type="month" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[#363b4e]/50 border border-[#c4bbf0]/20 rounded-xl p-2 outline-none focus:border-[#927fbf] text-white"
        />
      </div>

      <div className="h-[300px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickMargin={10} />
              <YAxis stroke="#ffffff50" fontSize={12} tickFormatter={(val) => `฿${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #c4bbf030', borderRadius: '12px' }}
                itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                labelStyle={{ color: '#ffffff80', marginBottom: '4px' }}
                formatter={(value: any) => [`฿${Number(value).toFixed(2)}`, 'รายได้']}
                labelFormatter={(label) => `วันที่ ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4ade80" 
                strokeWidth={3}
                dot={{ fill: '#4ade80', r: 4, strokeWidth: 2, stroke: '#1a1b26' }}
                activeDot={{ r: 6, fill: '#4ade80', stroke: '#fff' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-white/50">
            ไม่มีข้อมูลสำหรับเดือนนี้
          </div>
        )}
      </div>
    </div>
  )
}
