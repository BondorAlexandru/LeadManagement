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
    <div className="p-6 md:p-8 max-w-md mx-auto">
      {/* Document Icon */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#e5e5ff] p-4 rounded-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#8080ff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2 text-center text-black">Want to understand your visa options?</h2>
      <p className="text-gray-600 mb-8 text-center mx-auto">
        Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
      </p>
      
      {/* Form Renderer */}
      <JsonFormsRenderer 
        schema={leadFormSchema}
        uischema={leadFormUISchema}
        onSubmit={handleSubmit}
        submitButtonLabel="Submit"
        isSubmitting={isSubmitting}
      />
      
      {/* Dice Icon */}
      <div className="flex justify-center my-8">
        <div className="bg-[#e5e5ff] p-4 rounded-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#8080ff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <circle cx="8" cy="8" r="1"></circle>
            <circle cx="16" cy="8" r="1"></circle>
            <circle cx="8" cy="16" r="1"></circle>
            <circle cx="16" cy="16" r="1"></circle>
            <circle cx="12" cy="12" r="1"></circle>
          </svg>
        </div>
      </div>
      
      {/* Heart Icon */}
      <div className="flex justify-center my-8">
        <div className="bg-[#e5e5ff] p-4 rounded-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#8080ff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
} 