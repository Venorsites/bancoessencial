import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadImages } from '@/services/uploadApi';

interface PhotoGalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  placeholder?: string;
  className?: string;
  maxPhotos?: number;
  disabled?: boolean;
}

export function PhotoGalleryUpload({
  value = [],
  onChange,
  placeholder = 'Clique para fazer upload ou cole uma URL',
  className,
  maxPhotos = 20,
  disabled = false,
}: PhotoGalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validar quantidade
    if (value.length + files.length > maxPhotos) {
      setError(`Máximo de ${maxPhotos} fotos permitidas`);
      return;
    }

    // Validar tipos
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (5MB cada)
    const largeFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setError('Alguns arquivos são muito grandes. Tamanho máximo: 5MB por arquivo');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const urls = await uploadImages(files);
      onChange([...value, ...urls]);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload das imagens');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addPhoto = (url: string) => {
    const trimmedUrl = url.trim();
    if (trimmedUrl && !value.includes(trimmedUrl) && value.length < maxPhotos) {
      try {
        new URL(trimmedUrl);
        onChange([...value, trimmedUrl]);
        setInputValue('');
      } catch {
        setError('Por favor, digite uma URL válida (ex: https://exemplo.com/foto.jpg)');
      }
    }
  };

  const removePhoto = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addPhoto(inputValue);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="space-y-4">
        {/* Botão de upload */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="gallery-upload-input"
            disabled={disabled || isUploading}
          />
          <label
            htmlFor="gallery-upload-input"
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors',
              (disabled || isUploading || value.length >= maxPhotos) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Enviando...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span className="text-sm">Fazer upload ({value.length}/{maxPhotos})</span>
              </>
            )}
          </label>
        </div>

        {/* Input para URLs */}
        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white min-h-[48px] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
          {value.length < maxPhotos && (
            <div className="flex items-center gap-2 w-full">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : 'Adicionar mais fotos...'}
                className="flex-1 min-w-[200px] outline-none bg-transparent text-sm placeholder-gray-400"
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Lista de fotos */}
        {value.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Fotos adicionadas ({value.length}/{maxPhotos}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {value.map((url, index) => (
                <div
                  key={index}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow"
                >
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
                    />
                  </div>
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
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Remover foto"
                        disabled={disabled}
                      >
                        <X className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem de erro */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

