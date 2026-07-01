import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Trash2, Edit } from 'lucide-react'
import { deleteProduct } from '@/app/actions'

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#c4bbf0]">จัดการสินค้า</h1>
        <Link href="/admin/products/new" className="glass-panel px-4 py-2 hover:bg-[#8B5CF6]/20 flex items-center gap-2 border border-white/5 hover:border-[#8B5CF6]/50 transition-all text-white">
          <Plus size={20} /> เพิ่มสินค้า
        </Link>
      </div>
      
      <div className="glass-panel overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#4f3b78]/40 border-b border-white/10">
            <tr>
              <th className="p-4 text-white/80 font-medium">ชื่อสินค้า</th>
              <th className="p-4 text-white/80 font-medium">หมวดหมู่</th>
              <th className="p-4 text-white/80 font-medium">ราคา</th>
              <th className="p-4 text-right text-white/80 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-white">{product.name}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {product.category}
                  </span>
                </td>
                <td className="p-4 text-green-400 font-medium">฿{product.price.toFixed(2)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-400/10 rounded-lg">
                      <Edit size={18} />
                    </Link>
                    <form action={async () => {
                      'use server'
                      await deleteProduct(product.id)
                    }}>
                      <button className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-white/50">ยังไม่มีสินค้าในระบบ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
