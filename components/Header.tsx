'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileIcon, SaveIcon, DownloadIcon, PlusIcon, MenuIcon, HelpCircleIcon } from 'lucide-react';

interface HeaderProps {
  sheetName: string;
  onSheetNameChange: (name: string) => void;
  onNewSheet: () => void;
  onSave: () => void;
  onExport: () => void;
}

export function Header({ sheetName, onSheetNameChange, onNewSheet, onSave, onExport }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="flex items-center p-2">
        <div className="flex items-center space-x-2">
          <FileIcon className="h-6 w-6 text-green-600" />
          {isEditing ? (
            <Input
              value={sheetName}
              onChange={(e) => onSheetNameChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false);
                }
              }}
              autoFocus
              className="h-8 w-64"
            />
          ) : (
            <h1
              className="text-lg font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              {sheetName}
            </h1>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onSave}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={onNewSheet}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onNewSheet}>New spreadsheet</DropdownMenuItem>
              <DropdownMenuItem onClick={onSave}>Save</DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>Export as CSV</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircleIcon className="h-4 w-4 mr-2" />
                Help & feedback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}