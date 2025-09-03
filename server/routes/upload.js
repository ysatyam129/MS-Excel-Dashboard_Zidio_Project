const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const auth = require('../middleware/auth');
const Upload = require('../models/Upload');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload file with authentication
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📁 Processing file:', req.file.originalname);
    
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Get raw data with proper formatting
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1, 
      defval: null,
      raw: false 
    });
    
    // Filter out completely empty rows
    const filteredData = jsonData.filter(row => 
      row && row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );
    
    if (filteredData.length < 2) {
      return res.status(400).json({ error: 'File must contain headers and at least one data row' });
    }
    
    const headers = filteredData[0].map(h => h ? String(h).trim() : 'Column');
    const rows = filteredData.slice(1).map(row => {
      return headers.map((_, index) => {
        const value = row[index];
        if (value === null || value === undefined || value === '') return null;
        
        // Try to convert to number if it looks like a number
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && isFinite(numValue)) {
          return numValue;
        }
        
        return String(value).trim();
      });
    });
    
    // Detect data types for each column
    const columnTypes = headers.map((header, index) => {
      const columnValues = rows.map(row => row[index]).filter(v => v !== null);
      const numericCount = columnValues.filter(v => typeof v === 'number').length;
      const totalCount = columnValues.length;
      
      return {
        name: header,
        type: numericCount / totalCount > 0.7 ? 'numeric' : 'text',
        hasData: totalCount > 0
      };
    });
    
    const processedData = {
      headers,
      rows,
      columnTypes,
      fileName: req.file.originalname,
      uploadDate: new Date().toISOString(),
      summary: {
        totalRows: rows.length,
        totalColumns: headers.length,
        numericColumns: columnTypes.filter(c => c.type === 'numeric').length,
        textColumns: columnTypes.filter(c => c.type === 'text').length
      }
    };

    console.log('✅ Data processed:', processedData.summary);

    // Save to database
    const uploadRecord = new Upload({
      userId: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      data: processedData,
      headers: processedData.headers,
      rowCount: processedData.rows.length,
      fileSize: req.file.size
    });

    await uploadRecord.save();
    console.log('💾 Saved to database');

    res.json(processedData);
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get upload history
router.get('/history', auth, async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('originalName createdAt rowCount fileSize data');
    
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete upload
router.delete('/:id', auth, async (req, res) => {
  try {
    const upload = await Upload.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }
    
    // Delete file from filesystem
    const fs = require('fs');
    if (fs.existsSync(upload.filePath)) {
      fs.unlinkSync(upload.filePath);
    }
    
    // Delete from database
    await Upload.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Upload deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;