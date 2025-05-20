'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ThankYouProps {
  onReset: () => void;
}

export function ThankYou({ onReset }: ThankYouProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Simple version while waiting for hydration
  if (!mounted) {
    return (
      <div className="bg-white p-8 rounded-md flex flex-col items-center text-center">
        <h2 className="text-black text-2xl font-bold mb-2">Thank You</h2>
        <p className="text-gray-600 mb-6">Your submission was received.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-8 rounded-md flex flex-col items-center text-center">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-8 h-8 text-blue-500"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      
      <h2 className="text-black text-2xl font-bold mb-2">Thank You</h2>
      
      <p className="text-gray-600 mb-6">
        Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai.
      </p>
      
      <div className="w-full max-w-xs">
        <Button 
          variant="primary" 
          className="w-full"
          onClick={onReset}
        >
          Go Back to Homepage
        </Button>
      </div>
    </div>
  );
} 