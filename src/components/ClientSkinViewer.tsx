'use client'

import dynamic from 'next/dynamic'

const SkinViewer = dynamic(() => import('@/components/SkinViewer'), { ssr: false })

export default function ClientSkinViewer({ skinUrl }: { skinUrl: string }) {
  return <SkinViewer skinUrl={skinUrl} />
}
