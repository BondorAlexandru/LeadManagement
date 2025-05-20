'use client';

import { useState } from 'react';
import { Lead, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { updateLeadStatus } from '@/lib/api';

interface LeadTableProps {
  leads: Lead[];
  onLeadUpdate: (updatedLead: Lead) => void;
}

export function LeadTable({ leads, onLeadUpdate }: LeadTableProps) {
  const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);
  
  const handleUpdateStatus = async (leadId: string) => {
    setLoadingLeadId(leadId);
    try {
      const updatedLead = await updateLeadStatus(leadId, LeadStatus.REACHED_OUT);
      onLeadUpdate(updatedLead);
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setLoadingLeadId(null);
    }
  };
  
  const sortedLeads = [...leads].sort((a, b) => {
    // Show pending leads first
    if (a.status === LeadStatus.PENDING && b.status !== LeadStatus.PENDING) return -1;
    if (a.status !== LeadStatus.PENDING && b.status === LeadStatus.PENDING) return 1;
    
    // Then sort by date (newest first)
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Country
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedLeads.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No leads found
              </td>
            </tr>
          ) : (
            sortedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.submittedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lead.status === LeadStatus.PENDING
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.country || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {lead.status === LeadStatus.PENDING && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleUpdateStatus(lead.id)}
                      loading={loadingLeadId === lead.id}
                      disabled={loadingLeadId === lead.id}
                    >
                      Mark as Reached Out
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 