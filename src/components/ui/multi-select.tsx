'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
  error?: string;
  label?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  className,
  error,
  label
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-multiselect]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" data-multiselect>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <div
          className={cn(
            "flex min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500 font-medium">Select options</span>
            ) : (
              selectedValues.map(value => {
                const option = options.find(o => o.value === value);
                return (
                  <span
                    key={value}
                    className="bg-gray-200 px-2 py-1 rounded-md text-xs inline-flex items-center text-gray-800 font-medium"
                  >
                    {option?.label}
                    <button
                      type="button"
                      className="ml-1 text-gray-600 hover:text-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(value);
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            <div className="py-1">
              {options.map(option => (
                <div
                  key={option.value}
                  className={cn(
                    "px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800 font-medium",
                    selectedValues.includes(option.value) && "bg-gray-100"
                  )}
                  onClick={() => toggleOption(option.value)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => {}}
                    />
                    {option.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
} 