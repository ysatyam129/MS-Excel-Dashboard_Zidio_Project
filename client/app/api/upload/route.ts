import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Process data
    const processedData = {
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      headers: jsonData[0] as string[],
      rows: jsonData.slice(1),
      totalRows: jsonData.length - 1,
      totalColumns: (jsonData[0] as string[]).length
    }

    // Save file (optional)
    const path = join(process.cwd(), 'uploads', file.name)
    await writeFile(path, buffer)

    return NextResponse.json({
      message: 'File uploaded successfully',
      data: processedData
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}