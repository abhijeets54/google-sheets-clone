'use client';

import { useState, useEffect, useRef } from 'react';

interface FormulaBarProps {
  value: string;
  onChange: (value: string) => void;
  cellReference: string;
}

export function FormulaBar({ value, onChange, cellReference }: FormulaBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(inputValue);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } else if (e.key === 'Escape') {
      setInputValue(value);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleBlur = () => {
    onChange(inputValue);
  };

  return (
    <div className="flex items-center border-t border-b border-gray-300 px-2 py-1 bg-white">
      <div className="flex items-center justify-center w-8 h-8 mr-2 text-gray-500">
        <span className="material-icons">functions</span>
      </div>
      <div className="bg-gray-100 px-2 py-1 mr-2 text-gray-700 font-medium min-w-16 flex items-center justify-center">
        {cellReference || ''}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="flex-1 px-2 py-1 outline-none border border-gray-300 focus:border-blue-500"
        placeholder="Enter a value or formula"
      />
    </div>
  );
}