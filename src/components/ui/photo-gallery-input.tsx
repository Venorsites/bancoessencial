import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, Image, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoGalleryInputProps {
  value: string[];
  onChange: (urls: string[]) => void;
  placeholder?: string;
  className?: string;
  maxPhotos?: number;
}

export function PhotoGalleryInput({ 
  value = [], 
  onChange, 
  placeholder = "Digite a URL da foto e pressione Enter", 
  className,
  maxPhotos = 20
}: PhotoGalleryInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addPhoto = (url: string) => {
    const trimmedUrl = url.trim();
    if (trimmedUrl && !value.includes(trimmedUrl) && value.length < maxPhotos) {
      // Validar se é uma URL válida
      try {
        new URL(trimmedUrl);
        onChange([...value, trimmedUrl]);
        setInputValue('');
      } catch {
        alert('Por favor, digite uma URL válida (ex: https://exemplo.com/foto.jpg)');
      }
    }
  };

  const removePhoto = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addPhoto(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removePhoto(value[value.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Remove vírgulas automaticamente
    if (newValue.includes(',')) {
      const parts = newValue.split(',').filter(part => part.trim());
      parts.forEach(part => addPhoto(part));
      setInputValue('');
    } else {
      setInputValue(newValue);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        {/* Input para adicionar fotos */}
        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white min-h-[48px] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
          {value.length < maxPhotos && (
            <div className="flex items-center gap-2 w-full">
              <Image className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : "Adicionar mais fotos..."}
                className="flex-1 min-w-[200px] outline-none bg-transparent text-sm placeholder-gray-400"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => addPhoto(inputValue)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lista de fotos */}
        {value.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Fotos adicionadas ({value.length}/{maxPhotos}):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {value.map((url, index) => (
                <div
                  key={index}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow"
                >
                  {/* Preview da imagem */}
                  <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      loading="lazy"
                      className="relative w-full h-full object-cover"
                      onLoad={(e) => {
                        const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'none';
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const placeholder = target.previousElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'none';
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-gray-400 p-4">
                              <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span class="text-xs">Imagem não encontrada</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  
                  {/* URL e botões */}
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 truncate flex-1" title={url}>
                        {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Abrir imagem"
                      >
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                      <button
                        type="button"
                        onClick={() => removePhoto(url)}
                        className="p-1 hover:bg-red-100 rounded transition-colors group-hover:bg-red-50"
                        title="Remover foto"
                      >
                        <X className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                    
                    {/* Status da URL */}
                    <div className="flex items-center gap-1">
                      {isValidUrl(url) ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-600">URL válida</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-xs text-red-600">URL inválida</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {value.length > 0 && (
          <p className="text-xs text-gray-500">
            {value.length}/{maxPhotos} fotos adicionadas
          </p>
        )}
      </div>
    </div>
  );
}
