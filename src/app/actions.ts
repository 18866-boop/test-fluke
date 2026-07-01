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

export async function createOrder(data: { productId: string, customerName: string, amount: number, paymentMethod: string, quantity: number }) {
  const productRef = db.collection('products').doc(data.productId)
  const productSnap = await productRef.get()
  
  if (!productSnap.exists) throw new Error('Product not found')
  const product = productSnap.data() as any

  const orderData = {
    productId: data.productId,
    customerName: data.customerName,
    amount: data.amount,
    quantity: data.quantity,
    paymentMethod: data.paymentMethod,
    status: 'completed',
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
