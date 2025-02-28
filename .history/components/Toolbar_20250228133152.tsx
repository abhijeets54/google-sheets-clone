'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  PaintBucket,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ToolbarProps {
  selectedCell: { row: number; col: number } | null;
  cellContent: string;
  onCellContentChange: (value: string) => void;
  onStyleChange: (style: Record<string, any>) => void;
}

export function Toolbar({ selectedCell, cellContent, onCellContentChange, onStyleChange }: ToolbarProps) {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('11');

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    onStyleChange({ fontFamily: font });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    onStyleChange({ fontSize: `${size}px` });
  };

  return (
    <div className="border-b bg-background p-1 flex items-center space-x-1">
      <Input
        value={cellContent}
        onChange={(e) => onCellContentChange(e.target.value)}
        placeholder="Enter cell content"
        className="h-8 w-64"
        disabled={!selectedCell}
      />

      <div className="h-5 border-r mx-1"></div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Type className="h-4 w-4 mr-1" />
            {fontFamily}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'].map((font) => (
            <DropdownMenuItem key={font} onClick={() => handleFontFamilyChange(font)}>
              <span style={{ fontFamily: font }}>{font}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            {fontSize}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36'].map((size) => (
            <DropdownMenuItem key={size} onClick={() => handleFontSizeChange(size)}>
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-5 border-r mx-1"></div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onStyleChange({ fontWeight: 'bold' })}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onStyleChange({ fontStyle: 'italic' })}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onStyleChange({ textDecoration: 'underline' })}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="h-5 border-r mx-1"></div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onStyleChange({ textAlign: 'left' })}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onStyleChange({ textAlign: 'center' })}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onStyleChange({ textAlign: 'right' })}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="h-5 border-r mx-1"></div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <PaintBucket className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-5 gap-1">
            {[
              '#ffffff', '#f8f9fa', '#f1f3f4', '#e8eaed', '#dadce0',
              '#fce8e6', '#feefe3', '#fef7e0', '#fef8e1', '#fce8e6',
              '#e6f4ea', '#e8f0fe', '#edf2fa', '#f3e8fd', '#f4e4e8',
              '#ffcccc', '#ffe0b2', '#fff9c4', '#dcedc8', '#b3e5fc',
              '#d7aefb', '#fdcfe8', '#f28b82', '#fbbc04', '#fff475',
            ].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => onStyleChange({ backgroundColor: color })}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Type className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-5 gap-1">
            {[
              '#000000', '#434343', '#666666', '#999999', '#b7b7b7',
              '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff', '#980000',
              '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff',
              '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#e6b8af',
              '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3',
            ].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => onStyleChange({ color })}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}