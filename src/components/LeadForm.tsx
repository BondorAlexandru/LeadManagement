'use client';

import { useState } from 'react';
import { LeadFormData, VisaType } from '@/types';
import { submitLead } from '@/lib/api';

interface LeadFormProps {
  onSuccess: () => void;
}

export function LeadForm({ onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    linkedInProfile: '',
    visasOfInterest: [],
    additionalInformation: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.linkedInProfile) newErrors.linkedInProfile = 'LinkedIn profile is required';
    if (!formData.visasOfInterest.length) newErrors.visasOfInterest = 'Please select at least one visa option';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await submitLead(formData);
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        form: 'An error occurred while submitting the form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = <T,>(field: keyof LeadFormData, value: T) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleVisaToggle = (visa: VisaType) => {
    const currentVisas = [...formData.visasOfInterest];
    if (currentVisas.includes(visa)) {
      handleChange('visasOfInterest', currentVisas.filter(v => v !== visa));
    } else {
      handleChange('visasOfInterest', [...currentVisas, visa]);
    }
  };

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
      
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500 text-black"
        />
        
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500 text-black"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500 text-black"
        />
        
        <div className="relative">
          <select 
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-black"
          >
            <option value="" disabled>Country of Citizenship</option>
            <option value="united_states">United States</option>
            <option value="mexico">Mexico</option>
            <option value="india">India</option>
            <option value="china">China</option>
            <option value="canada">Canada</option>
            <option value="russia">Russia</option>
            <option value="brazil">Brazil</option>
            <option value="south_korea">South Korea</option>
            <option value="france">France</option>
            <option value="other">Other</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <input
          type="text"
          placeholder="LinkedIn / Personal Website URL"
          value={formData.linkedInProfile}
          onChange={(e) => handleChange('linkedInProfile', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500 text-black"
        />
        
        <div className="flex justify-center mt-10 mb-5">
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
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 8h.01"></path>
              <path d="M8 8h.01"></path>
              <path d="M8 16h.01"></path>
              <path d="M16 16h.01"></path>
              <path d="M12 12h.01"></path>
            </svg>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-5 text-center text-black">Visa categories of interest?</h3>
          
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visasOfInterest.includes('O-1')}
                onChange={() => handleVisaToggle('O-1')}
                className="w-5 h-5 mr-3 border-gray-300 rounded text-black focus:ring-0"
              />
              <span className="text-black">O-1</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visasOfInterest.includes('EB-1A')}
                onChange={() => handleVisaToggle('EB-1A')}
                className="w-5 h-5 mr-3 border-gray-300 rounded text-black focus:ring-0"
              />
              <span className="text-black">EB-1A</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visasOfInterest.includes('EB-2 NIW')}
                onChange={() => handleVisaToggle('EB-2 NIW')}
                className="w-5 h-5 mr-3 border-gray-300 rounded text-black focus:ring-0"
              />
              <span className="text-black">EB-2 NIW</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visasOfInterest.includes("I don't know")}
                onChange={() => handleVisaToggle("I don't know")}
                className="w-5 h-5 mr-3 border-gray-300 rounded text-black focus:ring-0"
              />
              <span className="text-black">I don&apos;t know</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-center mt-10 mb-5">
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-5 text-center text-black">How can we help you?</h3>
          <textarea
            placeholder="What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?"
            value={formData.additionalInformation || ''}
            onChange={(e) => handleChange('additionalInformation', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500 text-black"
          />
        </div>
        
        <div className="mt-10">
          <button 
            type="submit" 
            className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
} 