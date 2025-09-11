'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, Search, Zap, Copy } from 'lucide-react'

interface FormulaDetectorProps {
  data: any
}

export function FormulaDetector({ data }: FormulaDetectorProps) {
  const [showFormulas, setShowFormulas] = useState(false)
  const [detectedFormulas, setDetectedFormulas] = useState<any[]>([])
  const [showGenerator, setShowGenerator] = useState(false)
  const [formulaType, setFormulaType] = useState('')
  const [cellRange, setCellRange] = useState('')
  const [generatedFormula, setGeneratedFormula] = useState('')

  const detectFormulas = () => {
    if (!data?.rows) return

    const formulas: any[] = []
    
    data.rows.forEach((row: any[], rowIndex: number) => {
      row.forEach((cell: any, colIndex: number) => {
        if (typeof cell === 'string' && cell.startsWith('=')) {
          formulas.push({
            row: rowIndex + 1,
            col: String.fromCharCode(65 + colIndex),
            formula: cell,
            type: getFormulaType(cell)
          })
        }
      })
    })

    setDetectedFormulas(formulas)
    setShowFormulas(true)
  }

  const getFormulaType = (formula: string) => {
    if (formula.includes('SUM')) return 'SUM'
    if (formula.includes('AVERAGE')) return 'AVERAGE'
    if (formula.includes('COUNT')) return 'COUNT'
    if (formula.includes('IF')) return 'IF'
    if (formula.includes('VLOOKUP')) return 'VLOOKUP'
    if (formula.includes('MAX')) return 'MAX'
    if (formula.includes('MIN')) return 'MIN'
    return 'OTHER'
  }

  const generateFormula = () => {
    let formula = ''
    const range = cellRange || 'A1:A10'
    
    switch (formulaType) {
      case 'sum':
        formula = `=SUM(${range})`
        break
      case 'average':
        formula = `=AVERAGE(${range})`
        break
      case 'count':
        formula = `=COUNT(${range})`
        break
      case 'max':
        formula = `=MAX(${range})`
        break
      case 'min':
        formula = `=MIN(${range})`
        break
      case 'percentage':
        formula = `=(${range.split(':')[0]}/${range.split(':')[1]})*100`
        break
      case 'growth':
        formula = `=((${range.split(':')[1]}-${range.split(':')[0]})/${range.split(':')[0]})*100`
        break
      case 'if':
        formula = `=IF(${range.split(':')[0]}>0,"Positive","Negative")`
        break
    }
    
    setGeneratedFormula(formula)
  }

  const copyFormula = () => {
    navigator.clipboard.writeText(generatedFormula)
    alert('Formula copied to clipboard!')
  }

  if (!data?.rows) return null

  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-green-400" />
          Formula Detector
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button onClick={detectFormulas}>
            <Search className="h-4 w-4 mr-2" />
            Detect Formulas
          </Button>
          <Button onClick={() => setShowGenerator(!showGenerator)} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Generate Formula
          </Button>
        </div>

        {showGenerator && (
          <div className="bg-black p-4 rounded border border-white mb-4">
            <h4 className="text-white font-medium mb-3">Formula Generator</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-white text-sm mb-1 block">Formula Type:</label>
                <Select value={formulaType} onValueChange={setFormulaType}>
                  <SelectTrigger className="bg-black border-white text-white">
                    <SelectValue placeholder="Select formula type" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white">
                    <SelectItem value="sum" className="text-white hover:bg-gray-800">SUM - Add values</SelectItem>
                    <SelectItem value="average" className="text-white hover:bg-gray-800">AVERAGE - Calculate mean</SelectItem>
                    <SelectItem value="count" className="text-white hover:bg-gray-800">COUNT - Count numbers</SelectItem>
                    <SelectItem value="max" className="text-white hover:bg-gray-800">MAX - Find maximum</SelectItem>
                    <SelectItem value="min" className="text-white hover:bg-gray-800">MIN - Find minimum</SelectItem>
                    <SelectItem value="percentage" className="text-white hover:bg-gray-800">PERCENTAGE - Calculate %</SelectItem>
                    <SelectItem value="growth" className="text-white hover:bg-gray-800">GROWTH - Growth rate</SelectItem>
                    <SelectItem value="if" className="text-white hover:bg-gray-800">IF - Conditional logic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-white text-sm mb-1 block">Cell Range:</label>
                <Input 
                  value={cellRange}
                  onChange={(e) => setCellRange(e.target.value)}
                  placeholder="e.g., A1:A10 or B2:B20"
                  className="bg-black border-white text-white placeholder:text-gray-400"
                />
              </div>
              
              <Button onClick={generateFormula} className="w-full bg-white text-black hover:bg-gray-200">
                Generate Formula
              </Button>
              
              {generatedFormula && (
                <div className="bg-black border border-white p-3 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">Generated Formula:</span>
                    <Button size="sm" variant="ghost" onClick={copyFormula} className="text-white hover:bg-gray-800">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-white text-sm block bg-gray-800 p-2 rounded">
                    {generatedFormula}
                  </code>
                  <p className="text-white text-xs mt-2">
                    Copy this formula and paste it in your Excel cell
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {showFormulas && (
          <div className="space-y-3">
            {detectedFormulas.length === 0 ? (
              <p className="text-gray-400">No formulas found in this sheet</p>
            ) : (
              <>
                <p className="text-green-400 font-medium">
                  Found {detectedFormulas.length} formulas:
                </p>
                {detectedFormulas.map((formula, index) => (
                  <div key={index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 font-mono">
                        {formula.col}{formula.row}
                      </span>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded">
                        {formula.type}
                      </span>
                    </div>
                    <code className="text-yellow-300 text-sm bg-slate-800 p-2 rounded block">
                      {formula.formula}
                    </code>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}