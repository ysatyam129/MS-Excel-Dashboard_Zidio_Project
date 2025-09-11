'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle, X } from 'lucide-react'

export function DashboardHelper() {
  const [showHelper, setShowHelper] = useState(false)

  return (
    <div>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowHelper(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-full w-14 h-14 shadow-2xl"
          size="icon"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>

      {showHelper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Dashboard Help</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHelper(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">1. Upload Excel File</h3>
                <p className="text-gray-400 text-sm">Click Upload Excel File or drag & drop your .xlsx/.xls file</p>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">2. Choose Chart Type</h3>
                <p className="text-gray-400 text-sm">Select from 2D charts (Bar, Line, Pie, Area) or 3D visualizations</p>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">3. Customize Axes</h3>
                <p className="text-gray-400 text-sm">Pick X-axis (categories) and Y-axis (values) from your data columns</p>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">4. Export Results</h3>
                <p className="text-gray-400 text-sm">Download individual charts or export all charts in PNG/PDF format</p>
              </div>
            </div>

            <div className="border-t border-slate-700 p-4 bg-slate-900/50">
              <Button
                onClick={() => setShowHelper(false)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}