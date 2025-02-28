'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/Sheet';
import { Toolbar } from '@/components/Toolbar';
import { Header } from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { generateEmptySheet } from '@/lib/sheet-utils';

export default function Home() {
  const { toast } = useToast();
  const [sheetData, setSheetData] = useLocalStorage('sheet-data', generateEmptySheet(26, 100));
  const [selectedCell, setSelectedCell] = useState<{ col: number; row: number } | null>(null);
  const [cellContent, setCellContent] = useState<string>('');
  const [sheetName, setSheetName] = useLocalStorage('sheet-name', 'Untitled spreadsheet');

  useEffect(() => {
    if (selectedCell && sheetData[selectedCell.row] && sheetData[selectedCell.row][selectedCell.col]) {
      setCellContent(sheetData[selectedCell.row][selectedCell.col].content || '');
    } else {
      setCellContent('');
    }
  }, [selectedCell, sheetData]);

  const handleCellChange = (row: number, col: number, value: string) => {
    const newSheetData = [...sheetData];
    if (!newSheetData[row]) {
      newSheetData[row] = [];
    }
    if (!newSheetData[row][col]) {
      newSheetData[row][col] = { content: '', style: {} };
    }
    newSheetData[row][col].content = value;
    setSheetData(newSheetData);
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleCellStyleChange = (style: Record<string, any>) => {
    if (!selectedCell) return;
    
    const newSheetData = [...sheetData];
    if (!newSheetData[selectedCell.row]) {
      newSheetData[selectedCell.row] = [];
    }
    if (!newSheetData[selectedCell.row][selectedCell.col]) {
      newSheetData[selectedCell.row][selectedCell.col] = { content: '', style: {} };
    }
    
    newSheetData[selectedCell.row][selectedCell.col].style = {
      ...newSheetData[selectedCell.row][selectedCell.col].style,
      ...style
    };
    
    setSheetData(newSheetData);
  };

  const handleNewSheet = () => {
    if (confirm('Create a new sheet? All unsaved changes will be lost.')) {
      setSheetData(generateEmptySheet(26, 100));
      setSheetName('Untitled spreadsheet');
      toast({
        title: "New sheet created",
        description: "Started a fresh spreadsheet",
      });
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem('sheet-data', JSON.stringify(sheetData));
    toast({
      title: "Spreadsheet saved",
      description: "Your changes have been saved locally",
    });
  };

  const handleExport = () => {
    const csvContent = sheetData.map(row => {
      if (!row) return '';
      return row.map(cell => {
        if (!cell) return '';
        return `"${(cell.content || '').replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${sheetName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Spreadsheet exported",
      description: "Your spreadsheet has been exported as CSV",
    });
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Header 
        sheetName={sheetName} 
        onSheetNameChange={setSheetName} 
        onNewSheet={handleNewSheet}
        onSave={handleSave}
        onExport={handleExport}
      />
      <Toolbar 
        selectedCell={selectedCell} 
        cellContent={cellContent}
        onCellContentChange={(value) => {
          setCellContent(value);
          if (selectedCell) {
            handleCellChange(selectedCell.row, selectedCell.col, value);
          }
        }}
        onStyleChange={handleCellStyleChange}
      />
      <div className="flex-1 overflow-auto">
        <Sheet 
          data={sheetData} 
          onCellChange={handleCellChange}
          onCellSelect={handleCellSelect}
          selectedCell={selectedCell}
        />
      </div>
    </main>
  );
}