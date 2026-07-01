import { Shield, Book, MessageSquare, AlertTriangle, Box, ArrowLeft } from 'lucide-react'

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      <div className="glass-panel p-8 md:p-12">
        <h1 className="text-4xl font-bold text-[#c4bbf0] mb-8 border-b border-[#c4bbf0]/20 pb-4">กฎกติกาเซิร์ฟเวอร์</h1>
        
        <div className="space-y-6 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. กฎการสื่อสาร (Chat Rules)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>ห้ามใช้คำหยาบคาย ด่าทอ หรือพาดพิงถึงบุพการี</li>
              <li>ห้ามสแปมข้อความซ้ำๆ ก่อกวนผู้อื่น</li>
              <li>ห้ามโฆษณาเซิร์ฟเวอร์อื่นโดยเด็ดขาด</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. กฎการเล่นเกม (Gameplay Rules)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>ห้ามใช้โปรแกรมโกง (Hacks/Cheats) ทุกชนิด หากพบแบนถาวรทันที</li>
              <li>ห้ามใช้บัคของเกมเพื่อเอาเปรียบผู้เล่นอื่น</li>
              <li>ห้ามขโมยของหรือทำลายบ้านของผู้เล่นอื่นในเขตที่ไม่ได้อนุญาต (Griefing)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. กฎเกี่ยวกับการซื้อขาย</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>ห้ามโกงการซื้อขายไอเทมด้วยเงินจริงภายนอกระบบเซิร์ฟเวอร์</li>
              <li>สินค้าที่ซื้อจากร้านค้า (ยศ, ไอเทม) ไม่สามารถขอคืนเงินได้ทุกกรณี</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
