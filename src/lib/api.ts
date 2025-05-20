import { Lead, LeadFormData, LeadStatus } from '@/types';
import { mockLeads } from './mockData';
import { formatDate, uploadFile } from './utils';

// In-memory storage for leads
let leads = [...mockLeads];

// Get all leads
export async function getLeads(): Promise<Lead[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return leads;
}

// Submit a new lead
export async function submitLead(formData: LeadFormData): Promise<Lead> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let resumeUrl: string | undefined;
  
  // Handle file upload if provided
  if (formData.resume) {
    resumeUrl = await uploadFile(formData.resume);
  }
  
  const newLead: Lead = {
    id: String(leads.length + 1),
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    linkedInProfile: formData.linkedInProfile,
    visasOfInterest: formData.visasOfInterest,
    resumeUrl,
    additionalInformation: formData.additionalInformation,
    status: LeadStatus.PENDING,
    submittedAt: formatDate(new Date()),
    country: 'Unknown', // Could be determined based on IP or form input in a real app
  };
  
  leads = [...leads, newLead];
  return newLead;
}

// Update lead status
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const leadIndex = leads.findIndex(lead => lead.id === id);
  
  if (leadIndex === -1) {
    throw new Error(`Lead with ID ${id} not found`);
  }
  
  const updatedLead = {
    ...leads[leadIndex],
    status,
  };
  
  leads = [
    ...leads.slice(0, leadIndex),
    updatedLead,
    ...leads.slice(leadIndex + 1),
  ];
  
  return updatedLead;
}

// Get a single lead by ID
export async function getLeadById(id: string): Promise<Lead | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lead = leads.find(lead => lead.id === id);
  return lead || null;
} 