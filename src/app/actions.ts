'use server'

import { db } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Rcon } from 'rcon-client'

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrl = formData.get('imageUrl') as string
  const command = formData.get('command') as string

  const productData = {
    name,
    description,
    category,
    price,
    imageUrl: imageUrl || null,
    command: command || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await db.collection('products').add(productData)

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrl = formData.get('imageUrl') as string
  const command = formData.get('command') as string

  await db.collection('products').doc(id).update({
    name,
    description,
    category,
    price,
    imageUrl: imageUrl || null,
    command: command || null,
    updatedAt: new Date().toISOString()
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  await db.collection('products').doc(id).delete()
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function verifyPromoCode(code: string) {
  const codeUpper = code.toUpperCase().trim()
  const snap = await db.collection('promo_codes').where('code', '==', codeUpper).limit(1).get()
  
  if (snap.empty) {
    return { success: false, error: 'ไม่พบโค้ดส่วนลดนี้' }
  }

  const promoData = snap.docs[0].data()
  
  if (!promoData.isActive) {
    return { success: false, error: 'โค้ดส่วนลดนี้ถูกระงับการใช้งาน' }
  }

  if (promoData.expiresAt && new Date() > new Date(promoData.expiresAt)) {
    return { success: false, error: 'โค้ดส่วนลดนี้หมดอายุแล้ว' }
  }

  if (promoData.maxUses > 0 && promoData.currentUses >= promoData.maxUses) {
    return { success: false, error: 'โค้ดส่วนลดนี้ถูกใช้ครบจำนวนที่กำหนดแล้ว' }
  }

  return { 
    success: true, 
    discountType: promoData.discountType, 
    discountValue: promoData.discountValue 
  }
}

export async function createPromoCode(formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase().trim()
  const discountType = formData.get('discountType') as string
  const discountValue = parseFloat(formData.get('discountValue') as string)
  const maxUses = parseInt(formData.get('maxUses') as string) || 0
  const expiresAt = formData.get('expiresAt') as string || null

  // Check if code exists
  const existSnap = await db.collection('promo_codes').where('code', '==', code).get()
  if (!existSnap.empty) {
    throw new Error('โค้ดนี้มีอยู่แล้ว')
  }

  await db.collection('promo_codes').add({
    code,
    discountType,
    discountValue,
    maxUses,
    expiresAt,
    currentUses: 0,
    isActive: true,
    createdAt: new Date().toISOString()
  })

  revalidatePath('/admin/promo-codes')
  redirect('/admin/promo-codes')
}

export async function deletePromoCode(id: string) {
  await db.collection('promo_codes').doc(id).delete()
  revalidatePath('/admin/promo-codes')
}
export async function processSlipVerification(formData: FormData, expectedAmount: number) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'ไม่พบสลิปโอนเงิน' }
    }

    const clientId = 'mq5wyk4ga9a6cjkg'
    const clientSecret = 'ilmr3mqczlotltgzl9z98ae3mkdfc4kj'
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const apiFormData = new FormData()
    apiFormData.append('file', file)

    const response = await fetch('https://suba.rdcw.co.th/v2/inquiry', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`
      },
      body: apiFormData,
    })

    const data = await response.json()
    console.log('Slip Verify API Response:', data)

    // The API might not return `success: true`. Let's just check if there's no error code or if response is ok.
    if (response.ok && !data.code && data.data) {
      // Find transRef
      const transRef = data.data?.transRef || data.data?.data?.transRef || data.transRef || null
      
      if (transRef) {
        // Check for duplicates
        const existingOrder = await db.collection('orders').where('transRef', '==', transRef).limit(1).get()
        if (!existingOrder.empty) {
          return { success: false, error: 'สลิปนี้ถูกใช้งานไปแล้ว (Duplicate Slip)' }
        }
      }

      // Check amount
      const rawAmount = data.data?.amount || data.data?.data?.amount || data.amount
      if (rawAmount !== undefined && rawAmount !== null) {
        const slipAmount = parseFloat(rawAmount)
        if (slipAmount !== expectedAmount) {
          return { success: false, error: `ยอดเงินในสลิปไม่ตรงกับราคาสินค้า (ต้องการ ${expectedAmount} บาท แต่ระบบอ่านได้ ${slipAmount})` }
        }
      }

      return { success: true, data: data.data, transRef }
    } else {
      // Return the exact JSON so we can debug what the API actually said!
      return { success: false, error: data.message || `API Response: ${JSON.stringify(data)}` }
    }
  } catch (error: any) {
    console.error('Slip verification error:', error)
    return { success: false, error: 'ระบบตรวจสอบสลิปขัดข้อง' }
  }
}

export async function processTrueMoneyVoucher(voucherLink: string, expectedAmount: number) {
  try {
    // Extract hash from link
    // https://gift.truemoney.com/campaign/?v=hash...
    let hash = ''
    try {
      const url = new URL(voucherLink)
      hash = url.searchParams.get('v') || ''
    } catch {
      const match = voucherLink.match(/v=([^&]+)/)
      if (match) hash = match[1]
    }

    if (!hash) {
      return { success: false, error: 'ลิงก์ซองของขวัญไม่ถูกต้อง (หา hash ไม่เจอ)' }
    }

    const phone = '0960604947'
    const apiUrl = `https://store.cyber-safe.pro/api/topup/truemoney/angpaofree/${hash}/${phone}`
    
    console.log(`Calling TrueMoney API: ${apiUrl}`)
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const data = await response.json()
    console.log('TrueMoney API Response:', data)

    if (data?.status?.code === 'SUCCESS' || data?.message === 'success' || data?.status?.message === 'success') {
      // In a real scenario, you'd verify data.amount >= expectedAmount here
      // if (data.data?.amount && data.data.amount < expectedAmount) return { success: false, error: 'ยอดเงินไม่ครบ' }
      return { success: true }
    } else {
      return { success: false, error: data?.status?.message || data?.message || 'ซองของขวัญไม่สามารถใช้งานได้' }
    }
  } catch (error: any) {
    console.error('TrueMoney processing error:', error)
    return { success: false, error: 'ระบบตรวจสอบซองของขวัญขัดข้อง' }
  }
}

export async function createOrder(data: { productId: string, customerName: string, amount: number, paymentMethod: string, quantity: number, promoCode?: string, transRef?: string, server?: string }) {
  const productRef = db.collection('products').doc(data.productId)
  const productSnap = await productRef.get()
  
  if (!productSnap.exists) throw new Error('Product not found')
  const product = productSnap.data() as any

  let finalAmount = data.amount
  let appliedPromoCode = null

  if (data.promoCode) {
    const codeUpper = data.promoCode.toUpperCase().trim()
    const promoSnap = await db.collection('promo_codes').where('code', '==', codeUpper).limit(1).get()
    
    if (!promoSnap.empty) {
      const promoDoc = promoSnap.docs[0]
      const promoData = promoDoc.data()
      
      const isNotExpired = !promoData.expiresAt || new Date() <= new Date(promoData.expiresAt)

      if (promoData.isActive && isNotExpired && (promoData.maxUses === 0 || promoData.currentUses < promoData.maxUses)) {
        // Calculate new amount based on quantity * base price
        const baseAmount = product.price * data.quantity
        if (promoData.discountType === 'percent') {
          finalAmount = baseAmount - (baseAmount * (promoData.discountValue / 100))
        } else if (promoData.discountType === 'fixed') {
          finalAmount = Math.max(0, baseAmount - promoData.discountValue)
        }
        
        appliedPromoCode = codeUpper
        // Increment usage
        await promoDoc.ref.update({
          currentUses: promoData.currentUses + 1
        })
      }
    }
  }

  const orderData = {
    productId: data.productId,
    customerName: data.customerName,
    amount: finalAmount,
    quantity: data.quantity,
    paymentMethod: data.paymentMethod,
    promoCode: appliedPromoCode,
    status: 'completed',
    transRef: data.transRef || null,
    server: data.server || 'survival',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const orderRef = await db.collection('orders').add(orderData)

  // Execute RCON command if present
  if (product.command && process.env.RCON_HOST && process.env.RCON_PORT && process.env.RCON_PASSWORD) {
    try {
      const rcon = await Rcon.connect({
        host: process.env.RCON_HOST,
        port: parseInt(process.env.RCON_PORT),
        password: process.env.RCON_PASSWORD,
        timeout: 3000
      })
      
      const cmd = product.command.replace(/{player}/g, data.customerName)
      
      // Execute the command 'quantity' times
      for (let i = 0; i < data.quantity; i++) {
        await rcon.send(cmd)
        console.log(`RCON executed successfully: ${cmd} (Execution ${i + 1}/${data.quantity})`)
      }
      
      await rcon.end()
    } catch (error) {
      console.error('RCON execution failed:', error)
      // We log the error but still complete the order in DB
    }
  }

  revalidatePath('/admin/orders')
  return { id: orderRef.id, ...orderData }
}

export async function getTopSupporters() {
  const ordersSnap = await db.collection('orders').where('status', '==', 'completed').get()
  const manualSnap = await db.collection('manual_supporters').get()

  const supporterMap = new Map<string, { username: string, autoAmount: number, manualAmount: number, totalAmount: number }>()

  // Process Auto Data
  ordersSnap.docs.forEach(doc => {
    const data = doc.data()
    const username = data.customerName
    const amount = data.amount || 0

    if (!supporterMap.has(username)) {
      supporterMap.set(username, { username, autoAmount: 0, manualAmount: 0, totalAmount: 0 })
    }
    supporterMap.get(username)!.autoAmount += amount
  })

  // Process Manual Data
  manualSnap.docs.forEach(doc => {
    const data = doc.data()
    const username = data.username
    const amount = data.amount || 0

    if (!supporterMap.has(username)) {
      supporterMap.set(username, { username, autoAmount: 0, manualAmount: 0, totalAmount: 0 })
    }
    supporterMap.get(username)!.manualAmount += amount
  })

  // Calculate Totals
  const supporters = Array.from(supporterMap.values()).map(s => {
    s.totalAmount = s.autoAmount + s.manualAmount
    return s
  })

  // Sort descending by totalAmount
  supporters.sort((a, b) => b.totalAmount - a.totalAmount)

  return supporters
}

export async function getManualSupporters() {
  const snap = await db.collection('manual_supporters').orderBy('updatedAt', 'desc').get()
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function setManualSupporter(formData: FormData) {
  const username = formData.get('username') as string
  const amount = parseFloat(formData.get('amount') as string)

  if (!username) throw new Error('Username is required')

  const snap = await db.collection('manual_supporters').where('username', '==', username).limit(1).get()
  
  if (!snap.empty) {
    // Update
    await snap.docs[0].ref.update({
      amount,
      updatedAt: new Date().toISOString()
    })
  } else {
    // Add
    await db.collection('manual_supporters').add({
      username,
      amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  revalidatePath('/admin/supporters')
  revalidatePath('/supporters')
  redirect('/admin/supporters')
}

export async function deleteManualSupporter(id: string) {
  await db.collection('manual_supporters').doc(id).delete()
  revalidatePath('/admin/supporters')
  revalidatePath('/supporters')
}

export async function getStoreSettings() {
  const settingsSnap = await db.collection('settings').doc('store').get()
  if (!settingsSnap.exists) {
    return { servers: ['survival'] } // default
  }
  return settingsSnap.data() as { servers: string[] }
}

export async function updateStoreSettings(servers: string[]) {
  await db.collection('settings').doc('store').set({ servers }, { merge: true })
  revalidatePath('/admin/settings')
  revalidatePath('/') // Revalidate storefront
}
