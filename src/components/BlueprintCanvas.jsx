import { useEffect, useRef } from 'react'

export default function BlueprintCanvas({id , name = 'Plano', points = [], width = 520, height = 360 }) {
  const ref = useRef(null)

  const autoIdRef = useRef(`blueprint-canvas-${Math.random().toString(36).slice(2, 9)}`)
  const canvasId = id || autoIdRef.current

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0b1220'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    
    ctx.strokeStyle = 'rgba(148,163,184,0.15)'
    ctx.lineWidth = 1
    const step = 40
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    if (points.length > 1) {
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#93c5fd'
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.stroke()
    }


    ctx.fillStyle = '#fca5a5' 
    for (const p of points) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [points])

  return (
    <canvas
      id ={canvasId}
      ref={ref}
      width={width}
      height={height}
      style={{
        background: '#0b1220',
        border: '1px solid #334155',
        borderRadius: 12,
        width: '100%',
        maxWidth: width,
      }}
      data-testid="blueprint-canvas"
    />
  )
}
