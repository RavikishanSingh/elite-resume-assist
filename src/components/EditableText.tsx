
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
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
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // If not in editing mode, just show the text
  if (!isEditing) {
    return <span className={className}>{value || placeholder}</span>;
  }

  // If in edit mode and currently editing this field
  if (isActiveEdit) {
    const InputComponent = multiline ? Textarea : Input;
    return (
      <InputComponent
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-blue-500 bg-white`}
        autoFocus
        placeholder={placeholder}
      />
    );
  }

  // If in edit mode but not currently editing this field - show clickable text
  return (
    <div 
      className={`${className} group cursor-pointer hover:bg-blue-50 rounded px-2 py-1 relative inline-block min-h-[1.5rem]`}
      onClick={() => setIsActiveEdit(true)}
    >
      <span className="break-words">{value || placeholder}</span>
      <Edit className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-blue-600 bg-white rounded" />
    </div>
  );
};

export default EditableText;
