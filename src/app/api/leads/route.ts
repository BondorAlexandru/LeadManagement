import { NextRequest, NextResponse } from 'next/server';
import { getLeads, submitLead } from '@/lib/api';
import { LeadFormData } from '@/types';

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json() as LeadFormData;
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.linkedInProfile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newLead = await submitLead(formData);
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 