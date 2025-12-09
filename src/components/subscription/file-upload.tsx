'use client';

import { Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  onRemove: () => void;
  className?: string;
}

export function FileUpload({ onFileSelect, previewUrl, onRemove, className = '' }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {previewUrl ? (
        <div className="relative group">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto border-2 border-dashed border-primary/30 rounded-lg overflow-hidden bg-muted/20">
            <img
              src={previewUrl}
              alt="Preview da foto"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-all opacity-90 hover:opacity-100 shadow-sm"
            aria-label="Remover foto"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-center mt-2">
            <p className="text-sm text-muted-foreground">
              Foto selecionada
            </p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-input hover:border-primary hover:bg-primary/5'
            }
          `}
        >
          <input {...getInputProps()} name="image"/>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
             
              <p className="text-sm text-muted-foreground">
                Formato 4x4 • PNG, JPG, WEBP (max. 5MB)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                Selecionar Foto
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}