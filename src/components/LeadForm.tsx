"use client";

import { useState } from "react";
import { LeadFormData, VisaType } from "@/types";
import { submitLead } from "@/lib/api";

interface LeadFormProps {
  onSuccess: () => void;
}

export function LeadForm({ onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    linkedInProfile: "",
    visasOfInterest: [],
    additionalInformation: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  const validateField = (field: keyof LeadFormData, value: LeadFormData[keyof LeadFormData]): string => {
    switch (field) {
      case "firstName":
        return !value || typeof value !== 'string' || !value.trim() ? "First name is required" : "";
      case "lastName":
        return !value || typeof value !== 'string' || !value.trim() ? "Last name is required" : "";
      case "email":
        if (!value || typeof value !== 'string' || !value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value as string) ? "Please enter a valid email address" : "";
      case "country":
        return !value || typeof value !== 'string' ? "Please select your country of citizenship" : "";
      case "linkedInProfile":
        if (!value || typeof value !== 'string' || !value.trim()) return "LinkedIn/Website URL is required";
        // Check for LinkedIn URL format or general URL format
        const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
        const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/;
        return !linkedInRegex.test(value as string) && !urlRegex.test(value as string) 
          ? "Please enter a valid LinkedIn profile URL or website URL" 
          : "";
      case "visasOfInterest":
        return !value || !Array.isArray(value) || value.length === 0 ? "Please select at least one visa option" : "";
      default:
        return "";
    }
  };
  
  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validate each field
    (Object.keys(formData) as Array<keyof LeadFormData>).forEach(field => {
      const error = validateField(field as keyof LeadFormData, formData[field as keyof LeadFormData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    (Object.keys(formData) as Array<keyof LeadFormData>).forEach(field => {
      allTouched[field] = true;
    });
    setTouchedFields(allTouched);
    
    if (!validateAllFields()) return;
    
    setIsSubmitting(true);
    try {
      await submitLead(formData);
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        form: "An error occurred while submitting the form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = <T,>(field: keyof LeadFormData, value: T) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    if (!touchedFields[field]) {
      setTouchedFields(prev => ({ ...prev, [field]: true }));
    }
    
    // Validate the field as user types
    const error = validateField(field as keyof LeadFormData, value as LeadFormData[keyof LeadFormData]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleBlur = (field: keyof LeadFormData) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const error = validateField(field as keyof LeadFormData, formData[field as keyof LeadFormData]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleVisaToggle = (visa: VisaType) => {
    const currentVisas = [...formData.visasOfInterest];
    if (currentVisas.includes(visa)) {
      handleChange(
        "visasOfInterest",
        currentVisas.filter((v) => v !== visa)
      );
    } else {
      handleChange("visasOfInterest", [...currentVisas, visa]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Green Background */}
      <div className="bg-[#f2f8d9] py-12 px-6">
        <div className="max-w-5xl mx-auto relative">
          <div className="flex justify-between">
            <div className="absolute left-0 top-0">
              <img src="/decorative-circles.svg" alt="" className="h-32" />
            </div>
            
            <div className="ml-32 flex flex-col items-start">
              <div className="mb-6">
                <span className="text-xl font-medium text-black">alma</span>
              </div>
              <h1 className="text-4xl font-bold text-black">
                Get An Assessment
                <br />
                Of Your Immigration Case
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Form with White Background */}
      <div className="bg-white flex-grow py-8 px-6">
        <div className="max-w-md mx-auto">
          {/* Document Icon Section */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#EEF2FF] p-3 rounded-lg">
              <img src="/document-icon.svg" alt="" className="h-6 w-6" />
            </div>
          </div>
          
          <h2 className="text-xl font-medium text-center mb-2">
            Want to understand your visa options?
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-sm mx-auto">
            Submit the form below and our team of experienced attorneys will
            review your information and send a preliminary assessment of your
            case based on your goals.
          </p>
          
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Inputs - NO LABELS, only placeholders */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                className={`w-full px-4 py-3 border ${errors.firstName && touchedFields.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500`}
              />
              {errors.firstName && touchedFields.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                className={`w-full px-4 py-3 border ${errors.lastName && touchedFields.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500`}
              />
              {errors.lastName && touchedFields.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 border ${errors.email && touchedFields.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500`}
              />
              {errors.email && touchedFields.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  onBlur={() => handleBlur("country")}
                  className={`w-full px-4 py-3 border ${errors.country && touchedFields.country ? 'border-red-500' : 'border-gray-300'} rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-500`}
                >
                  <option value="" disabled selected>
                    Country of Citizenship
                  </option>
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
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              {errors.country && touchedFields.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                placeholder="LinkedIn / Personal Website URL"
                value={formData.linkedInProfile}
                onChange={(e) => handleChange("linkedInProfile", e.target.value)}
                onBlur={() => handleBlur("linkedInProfile")}
                className={`w-full px-4 py-3 border ${errors.linkedInProfile && touchedFields.linkedInProfile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500`}
              />
              {errors.linkedInProfile && touchedFields.linkedInProfile && (
                <p className="mt-1 text-sm text-red-600">{errors.linkedInProfile}</p>
              )}
            </div>
            
            {/* Visa Categories Section */}
            <div className="mt-10 pt-6">
              <div className="flex justify-center mb-6">
                <div className="bg-[#EEF2FF] p-3 rounded-lg">
                  <img src="/dice-icon.svg" alt="" className="h-6 w-6" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-center mb-6">
                Visa categories of interest?
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.visasOfInterest.includes("O-1")}
                    onChange={() => handleVisaToggle("O-1")}
                    className="mt-1 w-5 h-5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">O-1</span>
                </label>
                
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.visasOfInterest.includes("EB-1A")}
                    onChange={() => handleVisaToggle("EB-1A")}
                    className="mt-1 w-5 h-5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">EB-1A</span>
                </label>
                
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.visasOfInterest.includes("EB-2 NIW")}
                    onChange={() => handleVisaToggle("EB-2 NIW")}
                    className="mt-1 w-5 h-5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">EB-2 NIW</span>
                </label>
                
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.visasOfInterest.includes("I don't know")}
                    onChange={() => handleVisaToggle("I don't know")}
                    className="mt-1 w-5 h-5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">I don&apos;t know</span>
                </label>
              </div>
              {errors.visasOfInterest && touchedFields.visasOfInterest && (
                <p className="mt-2 text-sm text-red-600">{errors.visasOfInterest}</p>
              )}
            </div>
            
            {/* How can we help */}
            <div className="mt-10 pt-6">
              <div className="flex justify-center mb-6">
                <div className="bg-[#EEF2FF] p-3 rounded-lg">
                  <img src="/heart-icon.svg" alt="" className="h-6 w-6" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-center mb-6">
                How can we help you?
              </h3>
              
              <textarea
                placeholder="What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?"
                value={formData.additionalInformation || ""}
                onChange={(e) =>
                  handleChange("additionalInformation", e.target.value)
                }
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              />
            </div>
            
            {/* Submit Button */}
            <div className="mt-8">
              <button 
                type="submit" 
                className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
