'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileImage, FileText, Package } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useToast } from '@/hooks/use-toast'

interface ChartExportPanelProps {
  data: any
}

export function ChartExportPanel({ data }: ChartExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportIndividualChart = async (chartType: string, format: 'png' | 'pdf') => {
    setIsExporting(true)
    try {
      const chartElement = document.querySelector(`[data-chart-type="${chartType}"]`) as HTMLElement
      if (!chartElement) {
        alert(`Chart type ${chartType} not found!`)
        return
      }

      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#1e293b',
        scale: 2
      })

      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `${data.fileName}-${chartType}.png`
        link.href = canvas.toDataURL()
        link.click()
      } else {
        const pdf = new jsPDF()
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 190
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, 270))
        pdf.text(`${chartType.toUpperCase()} - ${data.fileName}`, 10, imgHeight + 20)
        pdf.save(`${data.fileName}-${chartType}.pdf`)
      }

      alert(`✅ ${chartType} chart exported as ${format.toUpperCase()}!`)
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Export failed!')
    } finally {
      setIsExporting(false)
    }
  }

  const exportAllCharts = async () => {
    setIsExporting(true)
    try {
      const chartElements = document.querySelectorAll('[data-chart-type]')
      const pdf = new jsPDF('p', 'mm', 'a4')
      let isFirstPage = true
      let exportCount = 0

      for (const element of chartElements) {
        const chartType = element.getAttribute('data-chart-type')
        if (!chartType || chartType === 'chart-controls') continue

        const canvas = await html2canvas(element as HTMLElement, {
          backgroundColor: '#1e293b',
          scale: 2
        })

        // PNG Export
        const link = document.createElement('a')
        link.download = `${data.fileName}-${chartType}.png`
        link.href = canvas.toDataURL()
        link.click()

        // Add to PDF
        if (!isFirstPage) pdf.addPage()
        
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 190
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, 270))
        pdf.text(`${chartType.toUpperCase()} - ${data.fileName}`, 10, imgHeight + 20)
        
        isFirstPage = false
        exportCount++
      }

      if (exportCount > 0) {
        pdf.save(`${data.fileName}-all-charts.pdf`)
        alert(`✅ ${exportCount} charts exported successfully!`)
      } else {
        alert('❌ No charts found to export!')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Export failed!')
    } finally {
      setIsExporting(false)
    }
  }

  const availableCharts = [
    { type: '2d-bar', name: 'Bar Chart', icon: '📊' },
    { type: '2d-line', name: 'Line Chart', icon: '📈' },
    { type: '2d-pie', name: 'Pie Chart', icon: '🥧' },
    { type: '2d-area', name: 'Area Chart', icon: '📉' },
    { type: '3d-bar', name: '3D Bar Chart', icon: '🏗️' },
    { type: '3d-pie', name: '3D Pie Chart', icon: '🎯' },
    { type: '3d-scatter', name: '3D Scatter', icon: '🔵' },
    { type: '3d-line', name: '3D Line Chart', icon: '📊' },
    { type: '3d-cylinder', name: '3D Cylinder', icon: '🏛️' }
  ]

  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Package className="h-5 w-5 mr-2 text-blue-400" />
          Chart Export Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export All Button */}
        <Button 
          onClick={exportAllCharts}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export All Charts (PNG + PDF)'}
        </Button>

        {/* Individual Chart Export */}
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Export Individual Charts:</h4>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {availableCharts.map((chart) => (
              <div key={chart.type} className="flex items-center justify-between bg-slate-700/30 p-2 rounded">
                <span className="text-gray-300 text-sm flex items-center">
                  <span className="mr-2">{chart.icon}</span>
                  {chart.name}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportIndividualChart(chart.type, 'png')}
                    disabled={isExporting}
                    className="text-xs px-2 py-1 h-6"
                  >
                    <FileImage className="h-3 w-3 mr-1" />
                    PNG
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportIndividualChart(chart.type, 'pdf')}
                    disabled={isExporting}
                    className="text-xs px-2 py-1 h-6"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}