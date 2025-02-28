'use client';

import { useRef, useEffect, useState } from 'react';
import { Cell } from '@/components/Cell';
import { Toolbar } from '@/components/Toolbar';
import { FormulaBar } from '@/components/FormulaBar';
import { evaluateFormula } from '@/utils/formulaEvaluator';

interface CellData {
  content: string;
  formula?: string;
  style: Record<string, any>;
  dataType?: 'text' | 'number' | 'date' | 'formula';
}

interface SheetProps {
  initialData?: Record<string, CellData>;
  onSave?: (data: Record<string, CellData>) => void;
}

export function Sheet({ initialData = {}, onSave }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Record<string, CellData>>(initialData);
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const [resizingRow, setResizingRow] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ startRow: number; startCol: number; endRow: number; endCol: number } | null>(null);
  const [dragStartCell, setDragStartCell] = useState<{ row: number; col: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [numRows, setNumRows] = useState(100);
  const [numCols, setNumCols] = useState(26);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [cellFormatting, setCellFormatting] = useState({
    bold: false,
    italic: false,
    fontSize: 12,
    textColor: '#000000',
    backgroundColor: 'transparent',
    textAlign: 'left'
  });

  // Generate column headers (A, B, C, ...)
  const columnHeaders = Array.from({ length: numCols }, (_, i) => String.fromCharCode(65 + i));

  useEffect(() => {
    // Recalculate all formula cells whenever data changes
    const newData = { ...data };
    let hasUpdates = false;

    Object.keys(newData).forEach(cellKey => {
      const cellData = newData[cellKey];
      if (cellData?.formula) {
        try {
          const result = evaluateFormula(cellData.formula, newData);
          
          if (cellData.content !== result) {
            cellData.content = result;
            hasUpdates = true;
          }
        } catch (error) {
          // If formula evaluation fails, show error
          if (cellData.content !== '#ERROR!') {
            cellData.content = '#ERROR!';
            hasUpdates = true;
          }
        }
      }
    });

    if (hasUpdates) {
      setData(newData);
    }
  }, [data]);

  // Update cell formatting when active tool changes
  useEffect(() => {
    if (selectedCell && activeTool) {
      updateCellFormatting(selectedCell.row, selectedCell.col, activeTool);
    }
  }, [activeTool, selectedCell]);

  // Update cell formatting state when cell selection changes
  useEffect(() => {
    if (selectedCell) {
      const cellKey = `${selectedCell.row},${selectedCell.col}`;
      const currentCell = data[cellKey];
      
      if (currentCell?.style) {
        setCellFormatting({
          bold: currentCell.style.fontWeight === 'bold',
          italic: currentCell.style.fontStyle === 'italic',
          fontSize: currentCell.style.fontSize || 12,
          textColor: currentCell.style.color || '#000000',
          backgroundColor: currentCell.style.backgroundColor || 'transparent',
          textAlign: currentCell.style.textAlign || 'left'
        });
      } else {
        setCellFormatting({
          bold: false,
          italic: false,
          fontSize: 12,
          textColor: '#000000',
          backgroundColor: 'transparent',
          textAlign: 'left'
        });
      }
    }
  }, [selectedCell, data]);

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
    
    // Reset the selected range
    if (!isDragging) {
      setSelectedRange(null);
    }
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const cellKey = `${row},${col}`;
    const isFormula = value.startsWith('=');
    
    setData(prevData => {
      const newData = { ...prevData };
      
      if (!newData[cellKey]) {
        newData[cellKey] = { content: '', style: {} };
      }
      
      if (isFormula) {
        newData[cellKey] = {
          ...newData[cellKey],
          formula: value,
          dataType: 'formula',
          content: ''  // Will be updated by formula evaluator
        };
        
        try {
          newData[cellKey].content = evaluateFormula(value, newData);
        } catch (error) {
          newData[cellKey].content = '#ERROR!';
        }
      } else {
        // Determine data type
        if (!isNaN(Number(value)) && value.trim() !== '') {
          newData[cellKey] = {
            ...newData[cellKey],
            content: value,
            dataType: 'number',
            formula: undefined
          };
        } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value) || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
          newData[cellKey] = {
            ...newData[cellKey],
            content: value,
            dataType: 'date',
            formula: undefined
          };
        } else {
          newData[cellKey] = {
            ...newData[cellKey],
            content: value,
            dataType: 'text',
            formula: undefined
          };
        }
      }
      
      return newData;
    });
  };

  const updateCellFormatting = (row: number, col: number, tool: string, value?: any) => {
    const cellKey = `${row},${col}`;
    
    setData(prevData => {
      const newData = { ...prevData };
      
      if (!newData[cellKey]) {
        newData[cellKey] = { content: '', style: {} };
      }
      
      switch (tool) {
        case 'bold':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            fontWeight: newData[cellKey].style.fontWeight === 'bold' ? 'normal' : 'bold'
          };
          setCellFormatting(prev => ({ ...prev, bold: !prev.bold }));
          break;
        case 'italic':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            fontStyle: newData[cellKey].style.fontStyle === 'italic' ? 'normal' : 'italic'
          };
          setCellFormatting(prev => ({ ...prev, italic: !prev.italic }));
          break;
        case 'fontSize':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            fontSize: value
          };
          setCellFormatting(prev => ({ ...prev, fontSize: value }));
          break;
        case 'textColor':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            color: value
          };
          setCellFormatting(prev => ({ ...prev, textColor: value }));
          break;
        case 'backgroundColor':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            backgroundColor: value
          };
          setCellFormatting(prev => ({ ...prev, backgroundColor: value }));
          break;
        case 'alignLeft':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            textAlign: 'left'
          };
          setCellFormatting(prev => ({ ...prev, textAlign: 'left' }));
          break;
        case 'alignCenter':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            textAlign: 'center'
          };
          setCellFormatting(prev => ({ ...prev, textAlign: 'center' }));
          break;
        case 'alignRight':
          newData[cellKey].style = {
            ...newData[cellKey].style,
            textAlign: 'right'
          };
          setCellFormatting(prev => ({ ...prev, textAlign: 'right' }));
          break;
      }
      
      return newData;
    });
  };

  const handleColumnResizeStart = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    setResizingCol(colIndex);
    setStartX(e.clientX);
    setStartWidth(columnWidths[colIndex] || 100);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingCol !== null) {
        const newWidth = Math.max(50, startWidth + (e.clientX - startX));
        setColumnWidths(prev => ({ ...prev, [resizingCol]: newWidth }));
      }
    };
    
    const handleMouseUp = () => {
      setResizingCol(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRowResizeStart = (e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault();
    setResizingRow(rowIndex);
    setStartY(e.clientY);
    setStartHeight(rowHeights[rowIndex] || 25);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingRow !== null) {
        const newHeight = Math.max(25, startHeight + (e.clientY - startY));
        setRowHeights(prev => ({ ...prev, [resizingRow]: newHeight }));
      }
    };
    
    const handleMouseUp = () => {
      setResizingRow(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent, row: number, col: number) => {
    if (e.buttons === 1) { // Left mouse button
      setDragStartCell({ row, col });
      setIsDragging(true);
      setSelectedRange({
        startRow: row,
        startCol: col,
        endRow: row,
        endCol: col
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent, row: number, col: number) => {
    if (isDragging && dragStartCell) {
      setSelectedRange({
        startRow: dragStartCell.row,
        startCol: dragStartCell.col,
        endRow: row,
        endCol: col
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartCell(null);
  };

  const isCellInSelectedRange = (row: number, col: number) => {
    if (!selectedRange) return false;
    
    const { startRow, startCol, endRow, endCol } = selectedRange;
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  };

  const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    handleCellSelect(row, col);
  };

  const handleInsertRow = () => {
    if (selectedCell) {
      // Insert a row above the selected cell
      setNumRows(numRows + 1);
      
      // Shift all data below the selected row down by 1
      const newData = { ...data };
      
      // Iterate from bottom to top to avoid overwriting
      for (let r = numRows - 1; r >= selectedCell.row; r--) {
        for (let c = 0; c < numCols; c++) {
          const oldKey = `${r},${c}`;
          const newKey = `${r + 1},${c}`;
          
          if (newData[oldKey]) {
            newData[newKey] = { ...newData[oldKey] };
            delete newData[oldKey];
          }
        }
      }
      
      setData(newData);
    }
    
    setShowContextMenu(false);
  };

  const handleDeleteRow = () => {
    if (selectedCell && numRows > 1) {
      // Delete the selected row
      // Shift all data below the selected row up by 1
      const newData = { ...data };
      
      for (let r = selectedCell.row; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const oldKey = `${r},${c}`;
          delete newData[oldKey];
          
          if (r < numRows - 1) {
            const nextKey = `${r + 1},${c}`;
            if (newData[nextKey]) {
              newData[`${r},${c}`] = { ...newData[nextKey] };
              delete newData[nextKey];
            }
          }
        }
      }
      
      setData(newData);
      setNumRows(numRows - 1);
    }
    
    setShowContextMenu(false);
  };

  const handleInsertColumn = () => {
    if (selectedCell) {
      // Insert a column to the left of the selected cell
      setNumCols(numCols + 1);
      
      // Shift all data to the right of the selected column rightward by 1
      const newData = { ...data };
      
      // Iterate from right to left to avoid overwriting
      for (let c = numCols - 1; c >= selectedCell.col; c--) {
        for (let r = 0; r < numRows; r++) {
          const oldKey = `${r},${c}`;
          const newKey = `${r},${c + 1}`;
          
          if (newData[oldKey]) {
            newData[newKey] = { ...newData[oldKey] };
            delete newData[oldKey];
          }
        }
      }
      
      setData(newData);
    }
    
    setShowContextMenu(false);
  };

  const handleDeleteColumn = () => {
    if (selectedCell && numCols > 1) {
      // Delete the selected column
      // Shift all data to the right of the selected column leftward by 1
      const newData = { ...data };
      
      for (let c = selectedCell.col; c < numCols; c++) {
        for (let r = 0; r < numRows; r++) {
          const oldKey = `${r},${c}`;
          delete newData[oldKey];
          
          if (c < numCols - 1) {
            const nextKey = `${r},${c + 1}`;
            if (newData[nextKey]) {
              newData[`${r},${c}`] = { ...newData[nextKey] };
              delete newData[nextKey];
            }
          }
        }
      }
      
      setData(newData);
      setNumCols(numCols - 1);
    }
    
    setShowContextMenu(false);
  };

  const handleFindAndReplace = (findText: string, replaceText: string) => {
    if (selectedRange) {
      const { startRow, startCol, endRow, endCol } = selectedRange;
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      
      const newData = { ...data };
      
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const cellKey = `${r},${c}`;
          if (newData[cellKey] && newData[cellKey].content.includes(findText)) {
            newData[cellKey] = {
              ...newData[cellKey],
              content: newData[cellKey].content.replace(new RegExp(findText, 'g'), replaceText)
            };
          }
        }
      }
      
      setData(newData);
    }
  };

  const handleRemoveDuplicates = () => {
    if (selectedRange) {
      const { startRow, startCol, endRow, endCol } = selectedRange;
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      
      const newData = { ...data };
      const seen = new Set();
      const rowsToDelete = new Set();
      
      // Identify duplicate rows
      for (let r = minRow; r <= maxRow; r++) {
        let rowContent = '';
        
        for (let c = minCol; c <= maxCol; c++) {
          const cellKey = `${r},${c}`;
          rowContent += newData[cellKey]?.content || '';
        }
        
        if (seen.has(rowContent)) {
          rowsToDelete.add(r);
        } else {
          seen.add(rowContent);
        }
      }
      
      // Delete duplicate rows (from bottom to top to avoid index shifting issues)
      const sortedRowsToDelete = Array.from(rowsToDelete).sort((a, b) => b - a);
      
      for (const rowToDelete of sortedRowsToDelete) {
        // Shift all rows below up by 1
        for (let r = rowToDelete; r < numRows - 1; r++) {
          for (let c = 0; c < numCols; c++) {
            const currentKey = `${r},${c}`;
            const nextKey = `${r + 1},${c}`;
            
            if (newData[nextKey]) {
              newData[currentKey] = { ...newData[nextKey] };
            } else {
              delete newData[currentKey];
            }
          }
        }
        
        // Clean up the last row
        for (let c = 0; c < numCols; c++) {
          delete newData[`${numRows - 1},${c}`];
        }
        
        setNumRows(numRows - 1);
      }
      
      setData(newData);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(data);
    }
  };
  
  // Handle document key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      
      const { row, col } = selectedCell;
      
      // Navigation with arrow keys
      if (e.key === 'ArrowUp' && row > 0) {
        setSelectedCell({ row: row - 1, col });
      } else if (e.key === 'ArrowDown' && row < numRows - 1) {
        setSelectedCell({ row: row + 1, col });
      } else if (e.key === 'ArrowLeft' && col > 0) {
        setSelectedCell({ row, col: col - 1 });
      } else if (e.key === 'ArrowRight' && col < numCols - 1) {
        setSelectedCell({ row, col: col + 1 });
      }
      
      // Copy with Ctrl+C
      if (e.ctrlKey && e.key === 'c' && selectedRange) {
        e.preventDefault();
        const { startRow, startCol, endRow, endCol } = selectedRange;
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);
        
        let copyText = '';
        
        for (let r = minRow; r <= maxRow; r++) {
          let rowText = '';
          
          for (let c = minCol; c <= maxCol; c++) {
            const cellKey = `${r},${c}`;
            rowText += data[cellKey]?.content || '';
            
            if (c < maxCol) {
              rowText += '\t';
            }
          }
          
          copyText += rowText;
          
          if (r < maxRow) {
            copyText += '\n';
          }
        }
        
        navigator.clipboard.writeText(copyText);
      }
      
      // Paste with Ctrl+V
      if (e.ctrlKey && e.key === 'v' && selectedCell) {
        e.preventDefault();
        
        navigator.clipboard.readText().then(clipText => {
          const rows = clipText.split('\n');
          const newData = { ...data };
          
          rows.forEach((rowText, rowOffset) => {
            const cols = rowText.split('\t');
            
            cols.forEach((cellText, colOffset) => {
              const targetRow = row + rowOffset;
              const targetCol = col + colOffset;
              
              if (targetRow < numRows && targetCol < numCols) {
                const cellKey = `${targetRow},${targetCol}`;
                
                // Determine data type
                let dataType: 'text' | 'number' | 'date' | 'formula' = 'text';
                
                if (cellText.startsWith('=')) {
                  dataType = 'formula';
                } else if (!isNaN(Number(cellText)) && cellText.trim() !== '') {
                  dataType = 'number';
                } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cellText) || /^\d{4}-\d{2}-\d{2}$/.test(cellText)) {
                  dataType = 'date';
                }
                
                newData[cellKey] = {
                  content: cellText,
                  style: newData[cellKey]?.style || {},
                  dataType
                };
                
                if (dataType === 'formula') {
                  newData[cellKey].formula = cellText;
                  try {
                    newData[cellKey].content = evaluateFormula(cellText, newData);
                  } catch (error) {
                    newData[cellKey].content = '#ERROR!';
                  }
                }
              }
            });
          });
          
          setData(newData);
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, selectedRange, data, numRows, numCols]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu) {
        setShowContextMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showContextMenu]);

  return (
    <div className="flex flex-col h-full border border-gray-300 bg-white">
      <Toolbar 
        onFormatChange={(tool, value) => {
          setActiveTool(tool);
          if (value !== undefined) {
            selectedCell && updateCellFormatting(selectedCell.row, selectedCell.col, tool, value);
          }
        }}
        cellFormatting={cellFormatting}
        onSave={handleSave}
        onFindReplace={handleFindAndReplace}
        onRemoveDuplicates={handleRemoveDuplicates}
      />
      
      <FormulaBar 
        value={selectedCell ? data[`${selectedCell.row},${selectedCell.col}`]?.formula || data[`${selectedCell.row},${selectedCell.col}`]?.content || '' : ''}
        onChange={value => {
          if (selectedCell) {
            handleCellChange(selectedCell.row, selectedCell.col, value);
          }
        }}
        cellReference={selectedCell ? `${columnHeaders[selectedCell.col]}${selectedCell.row + 1}` : ''}
      />
      
      <div className="overflow-auto h-full" ref={sheetRef} onMouseUp={handleMouseUp}>
        <div className="inline-block min-w-full">
          <div className="flex">
            {/* Top-left corner cell */}
            <div className="w-10 h-8 bg-gray-100 border-r border-b flex items-center justify-center sticky top-0 left-0 z-20"></div>
            
            {/* Column headers */}
            <div className="flex sticky top-0 z-10 bg-gray-100">
              {columnHeaders.map((header, colIndex) => (
                <div 
                  key={colIndex} 
                  className="border-r border-b flex items-center justify-center relative bg-gray-100"
                  style={{ width: columnWidths[colIndex] || 100, height: 32 }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenuPosition({ x: e.clientX, y: e.clientY });
                    setShowContextMenu(true);
                    setSelectedCell({ row: -1, col: colIndex });
                  }}
                >
                  {header}
                  <div 
                    className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500"
                    onMouseDown={(e) => handleColumnResizeStart(e, colIndex)}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row headers and cells */}
          {Array.from({ length: numRows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {/* Row header */}
              <div 
                className="w-10 bg-gray-100 border-r border-b flex items-center justify-center sticky left-0 z-10 relative"
                style={{ height: rowHeights[rowIndex] || 25 }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenuPosition({ x: e.clientX, y: e.clientY });
                  setShowContextMenu(true);
                  setSelectedCell({ row: rowIndex, col: -1 });
                }}
              >
                {rowIndex + 1}
                <div 
                  className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-blue-500"
                  onMouseDown={(e) => handleRowResizeStart(e, rowIndex)}
                ></div>
              </div>
              
              {/* Cells */}
              <div className="flex">
                {columnHeaders.map((_, colIndex) => {
                  const cellKey = `${rowIndex},${colIndex}`;
                  const cellData = data[cellKey] || { content: '', style: {} };
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`relative ${isCellInSelectedRange(rowIndex, colIndex) ? 'bg-blue-100' : ''}`}
                      onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                      onMouseMove={(e) => handleMouseMove(e, rowIndex, colIndex)}
                      onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                    >
                      <Cell
                        row={rowIndex}
                        col={colIndex}
                        value={cellData.content || ''}
                        style={cellData.style || {}}
                        width={columnWidths[colIndex] || 100}
                        height={rowHeights[rowIndex] || 25}
                        isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                        onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
                        onSelect={() => handleCellSelect(rowIndex, colIndex)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Context menu */}
      {showContextMenu && (
        <div 
          className="absolute bg-white shadow-lg border border-gray-300 rounded z-50"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <ul>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleInsertRow}>Insert row</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteRow}>Delete row</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleInsertColumn}>Insert column</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteColumn}>Delete column</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleRemoveDuplicates()}>Remove duplicates</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setShowContextMenu(false)}>Cancel</li>
          </ul>
        </div>
      )}
    </div>
  );
}