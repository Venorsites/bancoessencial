import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Unlink
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Digite seu texto aqui...",
  className,
  minHeight = "200px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleContentChange();
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertList = (e: React.MouseEvent, ordered: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Garantir que há uma seleção válida
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      
      if (ordered) {
        document.execCommand('insertOrderedList', false);
      } else {
        document.execCommand('insertUnorderedList', false);
      }
      
      handleContentChange();
    }
  };

  const insertBullet = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const bullet = document.createElement('span');
      bullet.innerHTML = '• ';
      bullet.style.fontSize = '1.2em';
      range.insertNode(bullet);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      handleContentChange();
    }
  };

  const insertLink = () => {
    const url = prompt('Digite a URL do link:');
    if (url) {
      const text = prompt('Digite o texto do link (opcional):') || url;
      
      // Verificar se há texto selecionado
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        // Se há texto selecionado, usar esse texto
        execCommand('createLink', url);
        
        // Adicionar classes CSS ao link criado
        setTimeout(() => {
          const links = editorRef.current?.querySelectorAll('a');
          if (links) {
            links.forEach(link => {
              if (link.getAttribute('href') === url) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
              }
            });
          }
        }, 10);
      } else {
        // Se não há texto selecionado, inserir o texto fornecido
        execCommand('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
      }
    }
  };

  const removeLink = () => {
    execCommand('unlink');
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: (e: React.MouseEvent) => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault(); // Previne perda de foco do editor
    };

    return (
      <Button
        type="button"
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        title={title}
        className={cn(
          "h-8 w-8 p-0",
          isActive && "bg-purple-100 text-purple-700 hover:bg-purple-200"
        )}
      >
        {children}
      </Button>
    );
  };

  return (
    <div className={cn("border border-gray-200 rounded-lg bg-white", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); execCommand('bold'); }}
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); execCommand('italic'); }}
            title="Itálico"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); execCommand('underline'); }}
            title="Sublinhado"
          >
            <Underline className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); execCommand('strikeThrough'); }}
            title="Riscado"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={(e) => insertList(e, false)}
            title="Lista com marcadores"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => insertList(e, true)}
            title="Lista numerada"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); insertBullet(); }}
            title="Marcador •"
          >
            <Type className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); insertLink(); }}
            title="Inserir link"
          >
            <Link className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); removeLink(); }}
            title="Remover link"
          >
            <Unlink className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); execCommand('justifyLeft'); }}
            title="Alinhar à esquerda"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); execCommand('justifyCenter'); }}
            title="Centralizar"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={(e) => { e.preventDefault(); execCommand('justifyRight'); }}
            title="Alinhar à direita"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "p-4 outline-none resize-none",
          isFocused && "ring-2 ring-purple-500 ring-opacity-20"
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        /* Estilos para links no editor */
        [contenteditable] a {
          color: #2563eb !important;
          text-decoration: underline !important;
          font-weight: 500;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8 !important;
          text-decoration: underline !important;
        }
        
        /* Estilos para listas no editor */
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 20px;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 20px;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        
        [contenteditable] li {
          margin-bottom: 4px;
        }
        
        /* Estilos para texto formatado */
        [contenteditable] strong, [contenteditable] b {
          font-weight: bold;
        }
        
        [contenteditable] em, [contenteditable] i {
          font-style: italic;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
        
        [contenteditable] s, [contenteditable] strike {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
}
