'use client';

import { useState, useEffect } from 'react';
import { JsonFormsRenderer } from './JsonFormsRenderer';
import { leadFormSchema, leadFormUISchema } from '@/lib/schemas/leadFormSchema';
import { LeadFormData, VisaType } from '@/types';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNewLead } from '@/lib/redux/slices/leadsSlice';

interface JsonFormsLeadFormProps {
  onSuccess: () => void;
}

export function JsonFormsLeadForm({ onSuccess }: JsonFormsLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  
  // Prevent hydration errors by rendering only after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    
    try {
      // Convert data to LeadFormData type
      const leadData: LeadFormData = {
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        country: (data.country as string) || '',
        linkedInProfile: data.linkedInProfile as string,
        visasOfInterest: (data.visasOfInterest as string[]).map(visa => visa as VisaType),
        additionalInformation: (data.additionalInformation as string) || '',
      };
      
      // Dispatch the addNewLead action to Redux
      await dispatch(addNewLead(leadData)).unwrap();
      
      // Call the success handler
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!mounted) {
    return <div className="p-8 md:p-12 flex justify-center">Loading form...</div>;
  }
  
  return (
    <div className="p-8 md:p-12">
      <div className="flex justify-center mb-8">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8 text-indigo-400"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-center text-black">Want to understand your visa options?</h2>
      <p className="text-gray-600 mb-10 text-center max-w-md mx-auto">
        Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
      </p>
      
      <JsonFormsRenderer 
        schema={leadFormSchema}
        uischema={leadFormUISchema}
        onSubmit={handleSubmit}
        submitButtonLabel="Submit Assessment Request"
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 