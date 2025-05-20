import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulate file upload and return a mock URL
export async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, this would upload to a server and return a URL
      const mockUrl = `https://storage.example.com/${file.name}`;
      resolve(mockUrl);
    }, 1000);
  });
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
} 