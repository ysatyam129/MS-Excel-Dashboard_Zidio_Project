'use client'

import { useRef, useEffect } from 'react'

interface ThreeChartProps {
  data: Array<{ name: string; value: number }>
  type: '3d-bar' | '3d-pie' | '3d-scatter' | '3d-line' | '3d-surface' | '3d-cylinder'
}

export function ThreeChart({ data, type }: ThreeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render3DBar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = Math.min(width / data.length * 0.6, 60)
    const spacing = (width - barWidth * data.length) / (data.length + 1)
    
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (height * 0.6)
      const x = spacing + index * (barWidth + spacing)
      const y = height - barHeight - 80
      
      const hue = (index * 360) / data.length
      const gradient = ctx.createLinearGradient(x, y, x + barWidth, y + barHeight)
      gradient.addColorStop(0, `hsl(${hue}, 70%, 65%)`)
      gradient.addColorStop(1, `hsl(${hue}, 70%, 45%)`)
      
      // Front face
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // Top face (3D effect)
      ctx.fillStyle = `hsl(${hue}, 70%, 75%)`
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 15, y - 15)
      ctx.lineTo(x + barWidth + 15, y - 15)
      ctx.lineTo(x + barWidth, y)
      ctx.closePath()
      ctx.fill()
      
      // Right face (3D effect)
      ctx.fillStyle = `hsl(${hue}, 70%, 55%)`
      ctx.beginPath()
      ctx.moveTo(x + barWidth, y)
      ctx.lineTo(x + barWidth + 15, y - 15)
      ctx.lineTo(x + barWidth + 15, y + barHeight - 15)
      ctx.lineTo(x + barWidth, y + barHeight)
      ctx.closePath()
      ctx.fill()
      
      // Labels
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(item.name.substring(0, 8), x + barWidth/2, height - 50)
      ctx.fillText(item.value.toFixed(1), x + barWidth/2, y - 20)
    })
  }

  const render3DPie = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2 - 20
    const radius = Math.min(width, height) * 0.25
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI
      const hue = (index * 360) / data.length
      
      // 3D effect - draw multiple layers
      for (let layer = 10; layer >= 0; layer--) {
        const layerY = centerY + layer * 2
        const brightness = 45 + (layer * 2)
        
        ctx.fillStyle = `hsl(${hue}, 70%, ${brightness}%)`
        ctx.beginPath()
        ctx.moveTo(centerX, layerY)
        ctx.arc(centerX, layerY, radius, currentAngle, currentAngle + sliceAngle)
        ctx.closePath()
        ctx.fill()
      }
      
      // Labels
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius + 30)
      const labelY = centerY + Math.sin(labelAngle) * (radius + 30)
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(item.name.substring(0, 6), labelX, labelY)
      ctx.fillText(`${((item.value/total)*100).toFixed(1)}%`, labelX, labelY + 12)
      
      currentAngle += sliceAngle
    })
  }

  const render3DScatter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    data.forEach((item, index) => {
      const x = (index / (data.length - 1)) * (width - 100) + 50
      const y = height - ((item.value / maxValue) * (height - 100)) - 50
      const size = (item.value / maxValue) * 20 + 10
      const hue = (index * 360) / data.length
      
      // 3D sphere effect
      const gradient = ctx.createRadialGradient(x - size/3, y - size/3, 0, x, y, size)
      gradient.addColorStop(0, `hsl(${hue}, 70%, 75%)`)
      gradient.addColorStop(1, `hsl(${hue}, 70%, 45%)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size, 0, 2 * Math.PI)
      ctx.fill()
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.beginPath()
      ctx.ellipse(x + 5, y + size + 10, size * 0.8, size * 0.3, 0, 0, 2 * Math.PI)
      ctx.fill()
      
      // Labels
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 9px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(item.name.substring(0, 6), x, y + size + 25)
    })
  }

  const render3DLine = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const maxValue = Math.max(...data.map(d => d.value))
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * (width - 100) + 50,
      y: height - ((item.value / maxValue) * (height - 100)) - 50,
      value: item.value,
      name: item.name
    }))
    
    // 3D line with depth
    for (let depth = 5; depth >= 0; depth--) {
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.8 - depth * 0.1})`
      ctx.lineWidth = 4 - depth * 0.5
      ctx.beginPath()
      
      points.forEach((point, index) => {
        const x = point.x - depth * 2
        const y = point.y - depth * 2
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    }
    
    // Points
    points.forEach((point, index) => {
      const hue = (index * 360) / data.length
      const gradient = ctx.createRadialGradient(point.x - 3, point.y - 3, 0, point.x, point.y, 8)
      gradient.addColorStop(0, `hsl(${hue}, 70%, 75%)`)
      gradient.addColorStop(1, `hsl(${hue}, 70%, 45%)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      // Labels
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 9px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(point.name.substring(0, 6), point.x, point.y + 20)
    })
  }

  const render3DCylinder = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const maxValue = Math.max(...data.map(d => d.value))
    const cylinderWidth = Math.min(width / data.length * 0.6, 50)
    const spacing = (width - cylinderWidth * data.length) / (data.length + 1)
    
    data.forEach((item, index) => {
      const cylinderHeight = (item.value / maxValue) * (height * 0.6)
      const x = spacing + index * (cylinderWidth + spacing)
      const y = height - cylinderHeight - 80
      const hue = (index * 360) / data.length
      
      // Cylinder body
      const gradient = ctx.createLinearGradient(x, y, x + cylinderWidth, y)
      gradient.addColorStop(0, `hsl(${hue}, 70%, 45%)`)
      gradient.addColorStop(0.5, `hsl(${hue}, 70%, 65%)`)
      gradient.addColorStop(1, `hsl(${hue}, 70%, 45%)`)
      
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, cylinderWidth, cylinderHeight)
      
      // Top ellipse
      ctx.fillStyle = `hsl(${hue}, 70%, 75%)`
      ctx.beginPath()
      ctx.ellipse(x + cylinderWidth/2, y, cylinderWidth/2, cylinderWidth/6, 0, 0, 2 * Math.PI)
      ctx.fill()
      
      // Bottom ellipse
      ctx.fillStyle = `hsl(${hue}, 70%, 55%)`
      ctx.beginPath()
      ctx.ellipse(x + cylinderWidth/2, y + cylinderHeight, cylinderWidth/2, cylinderWidth/6, 0, 0, 2 * Math.PI)
      ctx.fill()
      
      // Labels
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(item.name.substring(0, 8), x + cylinderWidth/2, height - 50)
      ctx.fillText(item.value.toFixed(1), x + cylinderWidth/2, y - 15)
    })
  }

  useEffect(() => {
    if (!canvasRef.current || !data?.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    
    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
    bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)')
    bgGradient.addColorStop(1, 'rgba(30, 41, 59, 0.9)')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)
    
    switch (type) {
      case '3d-bar':
        render3DBar(ctx, width, height)
        break
      case '3d-pie':
        render3DPie(ctx, width, height)
        break
      case '3d-scatter':
        render3DScatter(ctx, width, height)
        break
      case '3d-line':
        render3DLine(ctx, width, height)
        break
      case '3d-cylinder':
        render3DCylinder(ctx, width, height)
        break
    }
  }, [data, type])

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No data available for 3D visualization</p>
      </div>
    )
  }

  return (
    <div className="w-full h-96 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden p-4 border border-slate-700">
      <canvas 
        ref={canvasRef}
        width={900}
        height={450}
        className="w-full h-full cursor-pointer"
        style={{ background: 'transparent' }}
      />
    </div>
  )
}