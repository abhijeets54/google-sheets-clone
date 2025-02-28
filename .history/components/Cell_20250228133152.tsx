'use client';

import { useState, useRef, useEffect } from 'react';

interface CellProps {
  row: number;
  col: number;
  value: string;
  style: Record<string, any>;
  width: number;
  height: number;
  isSelected: boolean;
  onChange: (value: string) => void;
  onSelect: () => void;
}

export function Cell({ row, col, value, style, width, height, isSelected, onChange, onSelect }: CellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(editValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  return (
    <div
      className={`border-r border-b relative ${isSelected ? 'outline outline-2 outline-blue-500 z-10' : ''}`}
      style={{ 
        width, 
        height,
        ...style
      }}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full px-2 border-none outline-none"
          style={style}
        />
      ) : (
        <div className="w-full h-full px-2 overflow-hidden whitespace-nowrap text-ellipsis flex items-center">
          {value}
        </div>
      )}
    </div>
  );
}