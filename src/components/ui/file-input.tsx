'use client';

import { cn } from '@/lib/utils';
import { forwardRef, useState, InputHTMLAttributes, ChangeEvent } from 'react';

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  onChange: (file: File | null) => void;
  error?: string;
  label?: string;
  value?: File | null;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onChange, error, label, value, ...props }, ref) => {
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFileName(files[0].name);
        onChange(files[0]);
      } else {
        setFileName('');
        onChange(null);
      }
    };

    // Display file name if value is provided
    useState(() => {
      if (value) {
        setFileName(value.name);
      }
    });

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <div className="flex items-center w-full">
          <label 
            className={cn(
              "flex h-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 font-medium hover:bg-gray-50",
              error && "border-red-500",
              className
            )}
          >
            Choose File
            <input
              type="file"
              className="sr-only"
              ref={ref}
              onChange={handleFileChange}
              {...props}
            />
          </label>
          <div className="ml-3 text-sm text-gray-700 truncate max-w-xs">
            {fileName || 'No file selected'}
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export { FileInput }; 