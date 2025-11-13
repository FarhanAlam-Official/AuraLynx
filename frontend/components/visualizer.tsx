'use client'

import { useEffect, useRef } from 'react'

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bars = 30
    const animate = () => {
      ctx.fillStyle = 'rgb(15, 23, 42)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgb(59, 130, 246)'
      const barWidth = canvas.width / bars

      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8
        ctx.fillRect(i * barWidth + 2, canvas.height - height, barWidth - 4, height)
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={100}
      className="w-full rounded-lg border border-slate-600"
    />
  )
}
