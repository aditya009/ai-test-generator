import express from 'express';
import ExcelJS from 'exceljs';

const router = express.Router();

router.post('/csv', async (req, res) => {
  try {
    const { testCases, storyId } = req.body;
    
    // Generate CSV content
    const headers = ['ID', 'Title', 'Type', 'Priority', 'Precondition', 'Steps', 'Expected Result'];
    const rows = testCases.map(tc => [
      tc.id,
      tc.title,
      tc.type,
      tc.priority,
      tc.precondition,
      Array.isArray(tc.steps) ? tc.steps.join('; ') : tc.steps,
      tc.expectedResult
    ]);
    
    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${storyId || 'test-cases'}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate CSV', message: error.message });
  }
});

router.post('/excel', async (req, res) => {
  try {
    const { testCases, storyId } = req.body;
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Cases');
    
    // Define columns with headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Precondition', key: 'precondition', width: 30 },
      { header: 'Steps', key: 'steps', width: 50 },
      { header: 'Expected Result', key: 'expectedResult', width: 40 }
    ];
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' }
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 25;
    
    // Add data rows
    testCases.forEach(tc => {
      const row = worksheet.addRow({
        id: tc.id,
        title: tc.title,
        type: tc.type,
        priority: tc.priority,
        precondition: tc.precondition || 'N/A',
        steps: Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.steps,
        expectedResult: tc.expectedResult
      });
      
      // Style data rows
      row.alignment = { vertical: 'top', wrapText: true };
      
      // Color code by priority
      if (tc.priority === 'High') {
        row.getCell('priority').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFEE2E2' }
        };
        row.getCell('priority').font = { color: { argb: 'FFDC2626' }, bold: true };
      } else if (tc.priority === 'Medium') {
        row.getCell('priority').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFEF3C7' }
        };
        row.getCell('priority').font = { color: { argb: 'FFF59E0B' }, bold: true };
      } else {
        row.getCell('priority').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E7FF' }
        };
        row.getCell('priority').font = { color: { argb: 'FF4338CA' }, bold: true };
      }
      
      // Add borders
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      });
    });
    
    // Add filters
    worksheet.autoFilter = {
      from: 'A1',
      to: `G${worksheet.rowCount}`
    };
    
    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${storyId || 'test-cases'}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ error: 'Failed to generate Excel', message: error.message });
  }
});

export default router;
