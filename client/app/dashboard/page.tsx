'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { FileUpload } from '@/components/file-upload'
import { ChartVisualization } from '@/components/chart-visualization'
import { ThreeChart } from '@/components/three-chart'
import { AuthGuard } from '@/components/auth-guard'
import { BarChart3, FileSpreadsheet, TrendingUp, Users, Clock, Download, Sparkles, Zap, Mail, Phone, Building2, Heart, Trash2, Plus, Layout, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [uploadHistory, setUploadHistory] = useState([])
  const [currentData, setCurrentData] = useState(null)
  const [showThreeD, setShowThreeD] = useState(false)
  const [threeDType, setThreeDType] = useState<'3d-bar' | '3d-pie' | '3d-scatter' | '3d-line' | '3d-surface' | '3d-cylinder'>('3d-bar')
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalCharts: 0,
    totalUsers: 1,
    lastUpload: null
  })
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    // Get current user with error handling
    try {
      const currentUser = api.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to get current user:', error)
      setUser(null)
    }
    
    // Load upload history from MongoDB
    loadUploadHistory()
  }, [])

  const loadUploadHistory = async () => {
    try {
      const history = await api.getUploadHistory()
      const historyArray = Array.isArray(history) ? history : []
      setUploadHistory(historyArray)
      setStats({
        totalUploads: historyArray.length,
        totalCharts: historyArray.length * 2,
        totalUsers: 1,
        lastUpload: historyArray[0]?.createdAt
      })
    } catch (error) {
      console.error('Error loading upload history:', error)
      setUploadHistory([])
    }
  }

  const handleDataUploaded = (data: any) => {
    // Sanitize data before logging to prevent log injection
    const sanitizedFileName = data?.fileName?.replace(/[\r\n]/g, '') || 'unknown'
    console.log('Data uploaded:', { fileName: sanitizedFileName, rowCount: data?.rows?.length })
    setCurrentData(data)
    // Reload history from MongoDB
    loadUploadHistory()
  }

  const loadHistoryItem = (item: any) => {
    setCurrentData(item.data)
  }

  const exportAllCharts = async () => {
    if (!currentData) {
      alert('No data available for export!')
      return
    }

    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      const dashboardElement = document.querySelector('main')
      if (dashboardElement) {
        const canvas = await html2canvas(dashboardElement)
        
        // PNG Export
        const link = document.createElement('a')
        link.download = `${currentData.fileName}-dashboard.png`
        link.href = canvas.toDataURL()
        link.click()
        
        // PDF Export
        const pdf = new jsPDF('l', 'mm', 'a4')
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 10, 10, 277, 190)
        pdf.save(`${currentData.fileName}-dashboard.pdf`)
        
        alert('✅ Charts exported successfully in PNG & PDF format!')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Export failed! Please try again.')
    }
  }

  const deleteHistoryItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return
    }

    try {
      await api.deleteUpload(itemId)
      await loadUploadHistory()
      
      // Clear current data if deleted item was being viewed
      if (currentData?.fileName === itemName) {
        setCurrentData(null)
      }
      
      alert('✅ File successfully deleted!')
    } catch (error) {
      console.error('Delete error:', error)
      alert('❌ Failed to delete file! Please try again.')
    }
  }

  const handleNewAnalysis = () => {
    setCurrentData(null)
    setShowThreeD(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewTemplates = () => {
    setShowTemplates(true)
  }

  const loadTemplate = (template: any) => {
    setCurrentData(template.data)
    setShowTemplates(false)
    alert(`✅ Template "${template.name}" loaded successfully!`)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Analytics Dashboard</h1>
          <p className="text-gray-300 text-lg">Welcome back, {user?.name}! Transform your Excel data into stunning visualizations</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Uploads</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUploads}</div>
              <p className="text-xs text-gray-400">Excel files processed</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Charts Created</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalCharts}</div>
              <p className="text-xs text-gray-400">Visualizations generated</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-gray-400">Currently online</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Last Upload</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.lastUpload ? new Date(stats.lastUpload).toLocaleDateString() : 'None'}
              </div>
              <p className="text-xs text-gray-400">Most recent activity</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!currentData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
                      Upload Excel File
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Drag & drop your Excel file to instantly create stunning 2D & 3D visualizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload onDataUploaded={handleDataUploaded} />
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={() => setShowThreeD(false)}
                    variant={!showThreeD ? "default" : "outline"}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    2D Charts
                  </Button>
                  <Button 
                    onClick={() => setShowThreeD(true)}
                    variant={showThreeD ? "default" : "outline"}
                    className="bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    3D Visualization
                  </Button>
                </div>
                
                {showThreeD ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {/* 3D Chart Type Selector */}
                    <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-green-400" />
                          3D Chart Types
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                          <Button
                            onClick={() => setThreeDType('3d-bar')}
                            variant={threeDType === '3d-bar' ? 'default' : 'outline'}
                            className={`text-xs ${threeDType === '3d-bar' ? 'bg-blue-600' : 'border-slate-600 text-gray-300'}`}
                          >
                            📊 3D Bars
                          </Button>
                          <Button
                            onClick={() => setThreeDType('3d-pie')}
                            variant={threeDType === '3d-pie' ? 'default' : 'outline'}
                            className={`text-xs ${threeDType === '3d-pie' ? 'bg-green-600' : 'border-slate-600 text-gray-300'}`}
                          >
                            🥧 3D Pie
                          </Button>
                          <Button
                            onClick={() => setThreeDType('3d-scatter')}
                            variant={threeDType === '3d-scatter' ? 'default' : 'outline'}
                            className={`text-xs ${threeDType === '3d-scatter' ? 'bg-purple-600' : 'border-slate-600 text-gray-300'}`}
                          >
                            🔵 3D Scatter
                          </Button>
                          <Button
                            onClick={() => setThreeDType('3d-line')}
                            variant={threeDType === '3d-line' ? 'default' : 'outline'}
                            className={`text-xs ${threeDType === '3d-line' ? 'bg-orange-600' : 'border-slate-600 text-gray-300'}`}
                          >
                            📈 3D Line
                          </Button>
                          <Button
                            onClick={() => setThreeDType('3d-cylinder')}
                            variant={threeDType === '3d-cylinder' ? 'default' : 'outline'}
                            className={`text-xs ${threeDType === '3d-cylinder' ? 'bg-red-600' : 'border-slate-600 text-gray-300'}`}
                          >
                            🏛️ 3D Cylinder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* 3D Visualization */}
                    <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-green-400" />
                          3D Interactive Visualization - {threeDType.replace('3d-', '').toUpperCase()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ThreeChart 
                          data={currentData?.rows?.slice(0, 10).map((row, index) => ({
                            name: row?.[0] || `Item ${index + 1}`,
                            value: typeof row?.[1] === 'number' ? row[1] : (parseFloat(row?.[1]) || 0)
                          })) || []}
                          type={threeDType}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <ChartVisualization data={currentData} />
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Upload History</CardTitle>
                <CardDescription className="text-gray-400">
                  Recent Excel files and analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadHistory.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No uploads yet. Upload your first Excel file to get started.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Array.isArray(uploadHistory) && uploadHistory.map((item: any, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => loadHistoryItem(item)}
                        >
                          <p className="font-medium text-sm truncate text-white">{item.originalName}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()} • {item.rowCount} rows
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => loadHistoryItem(item)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteHistoryItem(item._id || item.id, item.originalName)
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm ">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full bg-black text-white border-black hover:bg-gray-900" 
                  onClick={() => exportAllCharts()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Charts
                </Button>
                <Button 
                  className="w-full bg-black text-white border-black hover:bg-gray-900"
                  onClick={handleNewAnalysis}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
                <Button 
                  className="w-full bg-black text-white border-black hover:bg-gray-900"
                  onClick={handleViewTemplates}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  View Templates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Layout className="h-6 w-6 mr-2 text-blue-400" />
                Chart Templates
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Sales Performance",
                    description: "Monthly sales data with trend analysis",
                    type: "Bar Chart",
                    data: {
                      fileName: "Sales_Template.xlsx",
                      rows: [
                        ["Month", "Sales", "Target"],
                        ["Jan", 45000, 40000],
                        ["Feb", 52000, 45000],
                        ["Mar", 48000, 50000],
                        ["Apr", 61000, 55000],
                        ["May", 58000, 60000],
                        ["Jun", 67000, 65000]
                      ]
                    },
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    name: "Budget Analysis",
                    description: "Department-wise budget allocation",
                    type: "Pie Chart",
                    data: {
                      fileName: "Budget_Template.xlsx",
                      rows: [
                        ["Department", "Budget"],
                        ["Marketing", 25000],
                        ["Development", 40000],
                        ["Sales", 30000],
                        ["HR", 15000],
                        ["Operations", 20000]
                      ]
                    },
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    name: "Employee Performance",
                    description: "Quarterly performance metrics",
                    type: "Line Chart",
                    data: {
                      fileName: "Performance_Template.xlsx",
                      rows: [
                        ["Employee", "Q1", "Q2", "Q3", "Q4"],
                        ["John", 85, 88, 92, 90],
                        ["Sarah", 78, 82, 85, 88],
                        ["Mike", 92, 89, 94, 96],
                        ["Lisa", 80, 85, 87, 89]
                      ]
                    },
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    name: "Product Analytics",
                    description: "Product sales and inventory data",
                    type: "Scatter Plot",
                    data: {
                      fileName: "Product_Template.xlsx",
                      rows: [
                        ["Product", "Sales", "Inventory"],
                        ["Product A", 1200, 150],
                        ["Product B", 800, 200],
                        ["Product C", 1500, 100],
                        ["Product D", 600, 300],
                        ["Product E", 1000, 180]
                      ]
                    },
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    name: "Financial Report",
                    description: "Revenue and expense tracking",
                    type: "Area Chart",
                    data: {
                      fileName: "Financial_Template.xlsx",
                      rows: [
                        ["Month", "Revenue", "Expenses"],
                        ["Jan", 75000, 45000],
                        ["Feb", 82000, 48000],
                        ["Mar", 78000, 52000],
                        ["Apr", 91000, 55000],
                        ["May", 88000, 58000],
                        ["Jun", 95000, 60000]
                      ]
                    },
                    color: "from-indigo-500 to-purple-500"
                  },
                  {
                    name: "Customer Satisfaction",
                    description: "Survey results and ratings",
                    type: "Radar Chart",
                    data: {
                      fileName: "Customer_Template.xlsx",
                      rows: [
                        ["Category", "Rating"],
                        ["Service Quality", 4.5],
                        ["Product Quality", 4.2],
                        ["Delivery Speed", 3.8],
                        ["Customer Support", 4.0],
                        ["Value for Money", 4.3]
                      ]
                    },
                    color: "from-teal-500 to-blue-500"
                  }
                ].map((template, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer"
                    onClick={() => loadTemplate(template)}
                  >
                    <Card className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-all duration-300 h-full">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} p-3 mb-3`}>
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                            {template.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {template.data.rows.length - 1} rows
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Professional Footer */}
      <footer className="bg-slate-900/95 border-t border-slate-700 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Zidio Development
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional Excel Analytics Platform with cutting-edge data visualization and AI-powered insights.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Heart className="h-4 w-4 text-red-400" />
                <span>Built with passion for data excellence</span>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:yadavsatyamsingh078@gmail.com" className="text-sm">
                    yadavsatyamsingh078@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+919310433939" className="text-sm">
                    +91 9310433939
                  </a>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Platform Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Interactive 2D & 3D Visualizations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>AI-Powered Data Insights</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span>Professional Export (PNG/PDF)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>Real-time Chart Generation</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 <span className="text-blue-400 font-medium">Zidio Development</span>. All rights reserved.
              </div>
              <div className="text-sm text-gray-400">
                Developed with <Heart className="h-3 w-3 text-red-400 inline mx-1" /> by Satyam Singh Yadav
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </AuthGuard>
  )
}