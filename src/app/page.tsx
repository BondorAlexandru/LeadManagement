'use client';

import { useState } from 'react';
import { LeadForm } from '@/components/LeadForm';
import { ThankYou } from '@/components/ThankYou';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  
  const handleReset = () => {
    setSubmitted(false);
  };
  
  return (
    <main className="h-full flex flex-col">
      <div className="bg-[#D9DB84] w-full pb-16">
        <div className="container mx-auto px-4 pt-6 max-w-2xl">
          <h1 className="text-2xl font-medium text-black mb-8">alma</h1>
          
          <div className="flex">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-black leading-tight">
                Get An Assessment<br />
                Of Your Immigration Case
              </h2>
            </div>
            
            <div className="relative w-32 h-32 hidden md:block">
              <div className="absolute w-24 h-24 bg-[#c0c275] rounded-full top-0 left-0 z-10"></div>
              <div className="absolute w-32 h-32 bg-[#abb154] rounded-full bottom-0 right-4 z-0"></div>
              <div className="absolute w-16 h-16 bg-[#d9db84] rounded-full top-10 left-12 z-20"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-full">
        <div className="bg-white shadow-md overflow-hidden">
          {!submitted ? (
            <LeadForm onSuccess={() => setSubmitted(true)} />
          ) : (
            <ThankYou onReset={handleReset} />
          )}
        </div>
      </div>
    </main>
  );
}
