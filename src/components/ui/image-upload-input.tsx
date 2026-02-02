import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/services/uploadApi';

interface ImageUploadInputProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ImageUploadInput({
  value,
  onChange,
  placeholder = 'Clique para fazer upload ou cole uma URL',
  className,
  disabled = false,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const url = await uploadImage(file);
      onChange(url);
      setError(null); // Limpar erro em caso de sucesso
    } catch (err: any) {
      // Exibir mensagem de erro mais detalhada
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao fazer upload da imagem';
      setError(errorMessage);
      console.error('Erro no upload:', err);
    } finally {
      setIsUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.startsWith('http://') || pastedText.startsWith('https://')) {
      onChange(pastedText);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (url) {
      onChange(url);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Preview da imagem */}
      {value && (
        <div className="relative w-full aspect-video border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setError('Erro ao carregar imagem')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input de upload */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload-input"
          disabled={disabled || isUploading}
        />
        <label
          htmlFor="image-upload-input"
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
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
              <span className="text-sm">Fazer upload</span>
            </>
          )}
        </label>
      </div>

      {/* Input de URL (alternativa) */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="url"
            value={value || ''}
            onChange={handleUrlChange}
            onPaste={handleUrlPaste}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Dica */}
      <p className="text-xs text-gray-500">
        Faça upload de uma imagem ou cole uma URL. Formatos aceitos: JPEG, PNG, WEBP, GIF (máx. 5MB)
      </p>
    </div>
  );
}

