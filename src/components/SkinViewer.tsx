'use client'

import { useEffect, useRef, useState } from 'react'
import { SkinViewer as SkinViewer3D, IdleAnimation } from 'skinview3d'

export default function SkinViewer({ skinUrl }: { skinUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    let viewer: SkinViewer3D
    
    try {
      viewer = new SkinViewer3D({
        canvas: canvasRef.current,
        width: 200,
        height: 250
      })

      // Try loading the skin manually so we can catch the error
      viewer.loadSkin(skinUrl)
        .then(() => {
          viewer.animation = new IdleAnimation()
          viewer.autoRotate = true
          viewer.autoRotateSpeed = 0.5
          viewer.camera.position.set(0, 15, 45)
        })
        .catch(() => {
          setHasError(true)
        })
    } catch (e) {
      setHasError(true)
    }

    return () => {
      if (viewer) viewer.dispose()
    }
  }, [skinUrl])

  if (hasError) {
    return (
      <div className="w-[200px] h-[250px] flex items-center justify-center border-2 border-dashed border-red-500/50 rounded-xl text-red-400 text-sm p-4 text-center">
        ไม่พบไฟล์สกิน<br/>public/skins/unmyeong.png
      </div>
    )
  }

  return (
    <canvas ref={canvasRef} className="filter drop-shadow-xl" />
  )
}
