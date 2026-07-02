'use client'

import { Trash2 } from 'lucide-react'
import { deletePromoCode } from '@/app/actions'
import { useTransition } from 'react'

export default function DeletePromoButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      onClick={() => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโค้ดส่วนลดนี้?')) {
          startTransition(() => {
            deletePromoCode(id)
          })
        }
      }}
      disabled={isPending}
      className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
      title="ลบ"
    >
      <Trash2 size={20} />
    </button>
  )
}
