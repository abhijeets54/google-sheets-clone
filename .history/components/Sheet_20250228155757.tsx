'use client';

import { useRef, useEffect, useState } from 'react';
import { Cell } from '@/components/Cell';

interface SheetProps {
  data: any[][];
  onCellChange: (row: number, col: number, value: string) => void;
  onCellSelect: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
}

export function Sheet({ data, onCellChange, onCellSelect, selectedCell }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const [resizingRow, setResizingRow] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  // Generate column headers (A, B, C, ...)
  const columnHeaders = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

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

  return (
    <div className="overflow-auto h-full" ref={sheetRef}>
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
        {Array.from({ length: 100 }, (_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {/* Row header */}
            <div 
              className="w-10 bg-gray-100 border-r border-b flex items-center justify-center sticky left-0 z-10 relative"
              style={{ height: rowHeights[rowIndex] || 25 }}
            >
              {rowIndex + 1}
              <div 
                className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-blue-500"
                onMouseDown={(e) => handleRowResizeStart(e, rowIndex)}
              ></div>
            </div>
            
            {/* Cells */}
            <div className="flex">
              {columnHeaders.map((_, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  value={data[rowIndex]?.[colIndex]?.content || ''}
                  style={data[rowIndex]?.[colIndex]?.style || {}}
                  width={columnWidths[colIndex] || 100}
                  height={rowHeights[rowIndex] || 25}
                  isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                  onChange={(value) => onCellChange(rowIndex, colIndex, value)}
                  onSelect={() => onCellSelect(rowIndex, colIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}