export interface ExcelData {
  fileName: string
  uploadDate: string
  headers: string[]
  rows: any[][]
  totalRows: number
  totalColumns: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface UploadHistory {
  id: string
  fileName: string
  uploadDate: string
  fileSize: number
  chartCount: number
  userId: string
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area'
  xAxis: string
  yAxis: string
  title?: string
  colors?: string[]
}

export interface AIInsight {
  type: 'trend' | 'outlier' | 'correlation' | 'summary'
  title: string
  description: string
  confidence: number
}