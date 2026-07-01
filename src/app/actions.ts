'use server'

import { prisma } from '@/lib/prisma'
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

  await prisma.product.create({
    data: {
      name,
      description,
      category,
      price,
      imageUrl: imageUrl || null,
      command: command || null
    }
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrl = formData.get('imageUrl') as string
  const command = formData.get('command') as string

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      category,
      price,
      imageUrl: imageUrl || null,
      command: command || null
    }
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function createOrder(data: { productId: number, customerName: string, amount: number, paymentMethod: string }) {
  const product = await prisma.product.findUnique({ where: { id: data.productId } })
  if (!product) throw new Error('Product not found')

  const order = await prisma.order.create({
    data: {
      productId: data.productId,
      customerName: data.customerName,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: 'completed'
    }
  })

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
      await rcon.send(cmd)
      await rcon.end()
      console.log(`RCON executed successfully: ${cmd}`)
    } catch (error) {
      console.error('RCON execution failed:', error)
      // We log the error but still complete the order in DB
    }
  }

  revalidatePath('/admin/orders')
  return order
}
