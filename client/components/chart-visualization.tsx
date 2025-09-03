'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement, PointElement, LineElement, Filler } from 'chart.js'
import { Bar as ChartJSBar, Doughnut, Line as ChartJSLine } from 'react-chartjs-2'
import { Download, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend, ArcElement, PointElement, LineElement, Filler)

interface ChartVisualizationProps {
  data: {
    headers: string[]
    rows: any[][]
    fileName: string
    uploadDate: string
  }
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export function ChartVisualization({ data }: ChartVisualizationProps) {
  const [chartType, setChartType] = useState('bar')
  const [xAxis, setXAxis] = useState(data?.headers?.[0] || '')
  const [yAxis, setYAxis] = useState(() => {
    // Find first numeric column for Y-axis
    const numericCol = data?.columnTypes?.find(col => col.type === 'numeric')?.name
    return numericCol || data?.headers?.[1] || ''
  })
  const [showAIInsights, setShowAIInsights] = useState(false)

  const chartData = useMemo(() => {
    if (!data?.headers || !data?.rows) {
      console.log('No data available for chart');
      return [];
    }
    
    const xIndex = data.headers.indexOf(xAxis)
    const yIndex = data.headers.indexOf(yAxis)
    
    if (xIndex === -1 || yIndex === -1) {
      console.log('Invalid axis selection:', { xAxis, yAxis, xIndex, yIndex });
      return [];
    }
    
    const processedData = data.rows
      .map((row, index) => {
        const xValue = row[xIndex]
        const yValue = row[yIndex]
        
        // Convert Y value to number
        let numericY = 0
        if (typeof yValue === 'number') {
          numericY = yValue
        } else if (yValue !== null && yValue !== undefined) {
          const parsed = parseFloat(String(yValue))
          numericY = isNaN(parsed) ? 0 : parsed
        }
        
        return {
          name: xValue ? String(xValue) : `Item ${index + 1}`,
          value: numericY,
          [xAxis]: xValue,
          [yAxis]: numericY,
          originalIndex: index
        }
      })
      .filter(item => item.value !== 0 || item.name) // Keep items with valid names or non-zero values
      .slice(0, 20); // Limit to 20 items for better visualization
    
    console.log('Chart data processed:', {
      totalItems: processedData.length,
      sampleData: processedData.slice(0, 3),
      xAxis,
      yAxis
    });
    
    return processedData;
  }, [data, xAxis, yAxis])

  const chartJSData = {
    labels: chartData.map(item => item.name),
    datasets: [{
      label: yAxis,
      data: chartData.map(item => item.value),
      backgroundColor: COLORS,
      borderColor: COLORS.map(color => color + '80'),
      borderWidth: 2
    }]
  }

  const downloadChart = async (format: 'png' | 'pdf') => {
    const chartElement = document.getElementById('chart-container')
    if (!chartElement) return

    const canvas = await html2canvas(chartElement)
    
    if (format === 'png') {
      const link = document.createElement('a')
      link.download = `${data.fileName}-chart.png`
      link.href = canvas.toDataURL()
      link.click()
    } else {
      const pdf = new jsPDF()
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100)
      pdf.save(`${data.fileName}-chart.pdf`)
    }
  }

  const generateAIInsights = () => {
    if (!chartData.length) return ['No data available for analysis.']
    
    const values = chartData.map(d => d.value).filter(v => !isNaN(v))
    if (!values.length) return ['No numeric data found for analysis.']
    
    const min = Math.min(...values)
    const max = Math.max(...values)
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const topItem = chartData.reduce((max, d) => d.value > max.value ? d : max, chartData[0])
    
    const insights = [
      `📈 Dataset contains ${chartData.length} data points with values ranging from ${min.toFixed(2)} to ${max.toFixed(2)}.`,
      `📊 Average value across all data points is ${avg.toFixed(2)}.`,
      `🏆 Highest performing item is "${topItem.name}" with a value of ${topItem.value}.`,
      `🔍 ${values.filter(v => v > avg).length} items are above average, indicating strong performance distribution.`
    ]
    return insights
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Data Visualization</h2>
            <p className="text-gray-300 text-lg">File: {data.fileName}</p>
          </div>
        <div className="flex gap-2">
          <Button onClick={() => downloadChart('png')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            PNG
          </Button>
          <Button onClick={() => downloadChart('pdf')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Data Summary */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
            Data Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{data?.summary?.totalRows || 0}</div>
              <div className="text-gray-400">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{data?.summary?.totalColumns || 0}</div>
              <div className="text-gray-400">Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{data?.summary?.numericColumns || 0}</div>
              <div className="text-gray-400">Numeric</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{chartData.length}</div>
              <div className="text-gray-400">Chart Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm text-white">Chart Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Bar Chart
                  </div>
                </SelectItem>
                <SelectItem value="line">
                  <div className="flex items-center">
                    <LineChartIcon className="h-4 w-4 mr-2" />
                    Line Chart
                  </div>
                </SelectItem>
                <SelectItem value="pie">
                  <div className="flex items-center">
                    <PieChartIcon className="h-4 w-4 mr-2" />
                    Pie Chart
                  </div>
                </SelectItem>
                <SelectItem value="area">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Area Chart
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm text-white">X-Axis (Categories)</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data?.headers?.map(header => (
                  <SelectItem key={header} value={header}>
                    {header} {data?.columnTypes?.find(c => c.name === header)?.type === 'text' ? '(Text)' : '(Number)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm text-white">Y-Axis (Values)</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data?.headers?.map(header => {
                  const colType = data?.columnTypes?.find(c => c.name === header)
                  return (
                    <SelectItem key={header} value={header}>
                      {header} {colType?.type === 'numeric' ? '(Number) ✓' : '(Text)'}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm text-white">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAIInsights(!showAIInsights)}
              variant={showAIInsights ? "default" : "outline"}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showAIInsights ? 'Hide' : 'Show'} Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                Interactive Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="chart-container">
                {renderChart()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {showAIInsights && (
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generateAIInsights().map((insight, index) => (
                    <div key={index} className="p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg text-sm text-gray-300">
                      {insight}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Data Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Chart Records:</span>
                  <span className="font-medium text-white">{chartData.length}</span>
                </div>
                {chartData.length > 0 && (
                  <>
                    <div className="flex justify-between text-gray-300">
                      <span>Max Value:</span>
                      <span className="font-medium text-white">{Math.max(...chartData.map(d => d.value)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Min Value:</span>
                      <span className="font-medium text-white">{Math.min(...chartData.map(d => d.value)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Average:</span>
                      <span className="font-medium text-white">
                        {(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-gray-300">
                  <span>X-Axis:</span>
                  <span className="font-medium text-blue-400">{xAxis}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Y-Axis:</span>
                  <span className="font-medium text-green-400">{yAxis}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </motion.div>
    </div>
  )
}