import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

export function TagInput({ 
  value = [], 
  onChange, 
  placeholder = "Digite e pressione Enter para adicionar", 
  className,
  maxTags = 80
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Remove vírgulas automaticamente
    if (newValue.includes(',')) {
      const parts = newValue.split(',').filter(part => part.trim());
      parts.forEach(part => addTag(part));
      setInputValue('');
    } else {
      setInputValue(newValue);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white min-h-[48px] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {value.length < maxTags && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : "Adicionar mais..."}
              className="flex-1 min-w-[120px] outline-none bg-transparent text-sm placeholder-gray-400"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {value.length}/{maxTags} tags adicionadas
        </p>
      )}
    </div>
  );
}
