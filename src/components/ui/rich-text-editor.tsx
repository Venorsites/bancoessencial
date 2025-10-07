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

  const insertList = (ordered: boolean = false) => {
    if (ordered) {
      execCommand('insertOrderedList');
    } else {
      execCommand('insertUnorderedList');
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
      execCommand('createLink', url);
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
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className={cn(
        "h-8 w-8 p-0",
        isActive && "bg-purple-100 text-purple-700 hover:bg-purple-200"
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("border border-gray-200 rounded-lg bg-white", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => execCommand('bold')}
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => execCommand('italic')}
            title="Itálico"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => execCommand('underline')}
            title="Sublinhado"
          >
            <Underline className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => execCommand('strikeThrough')}
            title="Riscado"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => insertList(false)}
            title="Lista com marcadores"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => insertList(true)}
            title="Lista numerada"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={insertBullet}
            title="Marcador •"
          >
            <Type className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={insertLink}
            title="Inserir link"
          >
            <Link className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={removeLink}
            title="Remover link"
          >
            <Unlink className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => execCommand('justifyLeft')}
            title="Alinhar à esquerda"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => execCommand('justifyCenter')}
            title="Centralizar"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => execCommand('justifyRight')}
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
      `}</style>
    </div>
  );
}
