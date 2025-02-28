'use client';

import { useState, useRef } from 'react';

interface ToolbarProps {
  onFormatChange: (tool: string, value?: any) => void;
  cellFormatting: {
    bold: boolean;
    italic: boolean;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    textAlign: string;
  };
  onSave: () => void;
  onFindReplace: (findText: string, replaceText: string) => void;
  onRemoveDuplicates: () => void;
}

export function Toolbar({
  onFormatChange,
  cellFormatting,
  onSave,
  onFindReplace,
  onRemoveDuplicates
}: ToolbarProps) {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const fontSizeOptions = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48];
  
  const handleFindReplaceSubmit = () => {
    onFindReplace(findText, replaceText);
    setShowFindReplace(false);
  };

  const colorOptions = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
    '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
    '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'
  ];

  const handleColorSelect = (color: string) => {
    if (showColorPicker === 'text') {
      onFormatChange('textColor', color);
    } else if (showColorPicker === 'background') {
      onFormatChange('backgroundColor', color);
    }
    setShowColorPicker(null);
  };

  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="border-b border-gray-300 bg-gray-100 flex flex-wrap items-center px-2 py-1">
      {/* File operations */}
      <div className="mr-4 flex items-center">
        <button
          onClick={onSave}
          className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded"
        >
          Save
        </button>
      </div>

      <div className="border-r border-gray-300 h-6 mx-2"></div>

      {/* Font formatting */}
      <div className="flex items-center">
        <button
          onClick={() => onFormatChange('bold')}
          className={`p-1 rounded ${cellFormatting.bold ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Bold"
        >
          <span className="material-icons text-gray-700">format_bold</span>
        </button>
        <button
          onClick={() => onFormatChange('italic')}
          className={`p-1 rounded ${cellFormatting.italic ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Italic"
        >
          <span className="material-icons text-gray-700">format_italic</span>
        </button>
        
        <div className="relative ml-2">
          <select
            value={cellFormatting.fontSize}
            onChange={(e) => onFormatChange('fontSize', parseInt(e.target.value))}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {fontSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-r border-gray-300 h-6 mx-2"></div>

      {/* Text alignment */}
      <div className="flex items-center">
        <button
          onClick={() => onFormatChange('alignLeft')}
          className={`p-1 rounded ${cellFormatting.textAlign === 'left' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Align left"
        >
          <span className="material-icons text-gray-700">format_align_left</span>
        </button>
        <button
          onClick={() => onFormatChange('alignCenter')}
          className={`p-1 rounded ${cellFormatting.textAlign === 'center' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Align center"
        >
          <span className="material-icons text-gray-700">format_align_center</span>
        </button>
        <button
          onClick={() => onFormatChange('alignRight')}
          className={`p-1 rounded ${cellFormatting.textAlign === 'right' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Align right"
        >
          <span className="material-icons text-gray-700">format_align_right</span>
        </button>
      </div>

      <div className="border-r border-gray-300 h-6 mx-2"></div>

      {/* Color controls */}
      <div className="flex items-center">
        <div className="relative">
          <button
            className="p-1 rounded hover:bg-gray-200 flex items-center"
            onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
            title="Text color"
          >
            <span className="material-icons text-gray-700">format_color_text</span>
            <div className="w-4 h-4 ml-1 border border-gray-400" style={{ backgroundColor: cellFormatting.textColor }}></div>
          </button>
          {showColorPicker === 'text' && (
            <div 
              ref={colorPickerRef}
              className="absolute top-10 left-0 z-10 bg-white border border-gray-300 shadow-lg p-2 rounded"
              style={{ width: '220px' }}
            >
              <div className="grid grid-cols-10 gap-1">
                {colorOptions.map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 cursor-pointer border border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative ml-2">
          <button
            className="p-1 rounded hover:bg-gray-200 flex items-center"
            onClick={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
            title="Background color"
          >
            <span className="material-icons text-gray-700">format_color_fill</span>
            <div className="w-4 h-4 ml-1 border border-gray-400" style={{ backgroundColor: cellFormatting.backgroundColor }}></div>
          </button>
          {showColorPicker === 'background' && (
            <div 
              ref={colorPickerRef}
              className="absolute top-10 left-0 z-10 bg-white border border-gray-300 shadow-lg p-2 rounded"
              style={{ width: '220px' }}
            >
              <div className="grid grid-cols-10 gap-1">
                {colorOptions.map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 cursor-pointer border border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-r border-gray-300 h-6 mx-2"></div>

      {/* Data operations */}
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="p-1 rounded hover:bg-gray-200"
            title="More options"
          >
            <span className="material-icons text-gray-700">more_horiz</span>
          </button>
          {showMoreOptions && (
            <div className="absolute top-10 left-0 z-10 bg-white border border-gray-300 shadow-lg p-2 rounded w-48">
              <button
                onClick={() => {
                  setShowFindReplace(true);
                  setShowMoreOptions(false);
                }}
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
              >
                Find and replace
              </button>
              <button
                onClick={() => {
                  onRemoveDuplicates();
                  setShowMoreOptions(false);
                }}
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
              >
                Remove duplicates
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Find and Replace Modal */}
      {showFindReplace && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-96">
            <h3 className="text-lg font-medium mb-4">Find and Replace</h3>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Find</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Replace with</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowFindReplace(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFindReplaceSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={!findText}
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function useEffect(arg0: () => () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}
