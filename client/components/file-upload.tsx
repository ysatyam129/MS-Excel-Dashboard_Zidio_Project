'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileSpreadsheet, Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'

interface FileUploadProps {
  onDataUploaded: (data: any) => void
}

export function FileUpload({ onDataUploaded }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload to backend
      const result = await api.uploadFile(file)
      
      if (result.error) {
        throw new Error(result.error)
      }

      clearInterval(interval)
      setUploadProgress(100)
      
      setTimeout(() => {
        onDataUploaded(result)
        setIsUploading(false)
      }, 500)

    } catch (error) {
      console.error('Error uploading file:', error)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onDataUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-2 border-dashed border-slate-600 hover:border-blue-400 transition-all duration-300 bg-slate-800/20 backdrop-blur-sm hover:bg-slate-800/30">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer rounded-lg p-6 transition-all duration-300 ${
              isDragActive ? 'bg-blue-900/20 border-blue-400' : ''
            }`}
          >
            <input {...getInputProps()} />
            
            {isUploading ? (
              <div className="space-y-4">
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-blue-400 mx-auto animate-spin" />
                  <Sparkles className="h-6 w-6 text-purple-400 absolute top-0 right-1/2 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-white">Processing your Excel file...</p>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 animate-pulse"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <FileSpreadsheet className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                </motion.div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">
                    {isDragActive ? (
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Drop your Excel file here
                      </span>
                    ) : (
                      'Upload Excel File'
                    )}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Drag and drop your .xlsx or .xls file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports files up to 10MB • Instant processing • Secure upload
                  </p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Choose File
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}