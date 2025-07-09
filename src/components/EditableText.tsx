
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  isEditing?: boolean;
}

const EditableText = ({ 
  value, 
  onSave, 
  multiline = false, 
  className = "", 
  placeholder = "Click to edit",
  isEditing = false 
}: EditableTextProps) => {
  const [isActiveEdit, setIsActiveEdit] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isActiveEdit && inputRef.current) {
      inputRef.current.focus();
      // Select all text when editing starts
      if (inputRef.current.select) {
        inputRef.current.select();
      }
    }
  }, [isActiveEdit]);

  const handleSave = () => {
    if (editValue.trim() !== value.trim()) {
      onSave(editValue.trim());
    }
    setIsActiveEdit(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsActiveEdit(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // If not in editing mode, just show the text
  if (!isEditing) {
    return (
      <span className={className}>
        {value || placeholder}
      </span>
    );
  }

  // If in edit mode and currently editing this field
  if (isActiveEdit) {
    const InputComponent = multiline ? Textarea : Input;
    return (
      <InputComponent
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-blue-500 bg-white min-w-[200px] focus:ring-2 focus:ring-blue-300`}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  // If in edit mode but not currently editing this field - show clickable text
  return (
    <div 
      className={`${className} group cursor-text hover:bg-blue-50 rounded px-2 py-1 relative inline-block min-h-[2rem] border border-transparent hover:border-blue-300 transition-all duration-200 select-text`}
      onMouseDown={(e) => {
        // Allow text selection by preventing immediate edit mode
        e.stopPropagation();
      }}
      onClick={(e) => {
        // Delay check for selection to allow text selection to complete
        setTimeout(() => {
          const selection = window.getSelection();
          if (!selection || selection.toString().length === 0) {
            setIsActiveEdit(true);
          }
        }, 100);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsActiveEdit(true);
      }}
      title="Click to edit or double-click"
    >
      <span className="break-words select-text user-select-text" style={{ userSelect: 'text' }}>
        {value || (
          <span className="text-gray-400 italic">{placeholder}</span>
        )}
      </span>
      <Edit className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-blue-600 bg-white rounded shadow-sm p-0.5 pointer-events-none" />
    </div>
  );
};

export default EditableText;
