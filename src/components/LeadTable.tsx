'use client';

import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '@/types';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateLead } from '@/lib/redux/slices/leadsSlice';

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const leadsPerPage = 8;
  
  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleUpdateStatus = async (leadId: string) => {
    setLoadingLeadId(leadId);
    try {
      await dispatch(updateLead({ leadId, status: LeadStatus.REACHED_OUT })).unwrap();
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setLoadingLeadId(null);
    }
  };
  
  // If not mounted yet, show a simpler UI to prevent hydration issues
  if (!mounted) {
    return (
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Submitted</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Country</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading leads...</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  
  // Sort leads by submission date (newest first)
  const sortedLeads = [...leads].sort((a, b) => {
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });
  
  // Paginate leads
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = sortedLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.max(1, Math.ceil(leads.length / leadsPerPage));

  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="border-b">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
              Name <span className="inline-block ml-1">↓</span>
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
              Submitted <span className="inline-block ml-1">↓</span>
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
              Status <span className="inline-block ml-1">↓</span>
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
              Country <span className="inline-block ml-1">↓</span>
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentLeads.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No leads found</td>
            </tr>
          ) : (
            currentLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-black">
                    {lead.firstName} {lead.lastName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {lead.submittedAt}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-black">
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-black">
                    {lead.country || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {lead.status === LeadStatus.PENDING && (
                    <button
                      onClick={() => handleUpdateStatus(lead.id)}
                      disabled={loadingLeadId === lead.id}
                      className="px-2 py-1 text-xs font-medium rounded bg-black text-white hover:bg-gray-800"
                    >
                      {loadingLeadId === lead.id ? 'Updating...' : 'Mark as Reached Out'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Pagination - always show pagination */}
      <div className="px-6 py-4 flex justify-end items-center">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === page 
                ? 'bg-gray-200 text-gray-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 