'use client';

import { useState } from 'react';
import { ThankYou } from '@/components/ThankYou';
import { LeadForm } from '@/components/LeadForm';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  
  const handleReset = () => {
    setSubmitted(false);
  };
  
  return (
    <main className="min-h-screen">
      {!submitted ? (
        <LeadForm onSuccess={() => setSubmitted(true)} />
      ) : (
        <ThankYou onReset={handleReset} />
      )}
    </main>
  );
}
