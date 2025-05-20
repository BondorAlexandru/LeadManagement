export type VisaType = 'O-1' | 'EB-1A' | 'EB-2 NIW' | 'I don\'t know';

export enum LeadStatus {
  PENDING = 'Pending',
  REACHED_OUT = 'Reached Out',
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedInProfile: string;
  visasOfInterest: VisaType[];
  resumeUrl?: string;
  additionalInformation?: string;
  status: LeadStatus;
  submittedAt: string;
  country?: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  linkedInProfile: string;
  visasOfInterest: VisaType[];
  resume?: File;
  additionalInformation?: string;
  country?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
} 