import { Upload, X, FileText } from 'lucide-react';
import { useState, useRef } from 'react';

interface FileUploaderProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
}

export default function FileUploader({ label, accept = '.pdf,.doc,.docx,.jpg,.png', multiple = true, onFilesChange }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const updated = [...files, ...newFiles];
    setFiles(updated);
    onFilesChange?.(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  return (
    <div>
      <label className="gov-label">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-6 md:p-8 text-center cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-colors"
      >
        <Upload size={28} className="mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-1">Click to upload or drag files here</p>
        <p className="text-xs text-muted-foreground/60">PDF, DOC, JPG, PNG (max 10MB each)</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
