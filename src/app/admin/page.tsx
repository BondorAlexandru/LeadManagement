'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { LeadTable } from '@/components/LeadTable';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchLeads, setSearchTerm, setStatusFilter } from '@/lib/redux/slices/leadsSlice';

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { 
    filteredLeads, 
    status, 
    currentSearchTerm,
    currentStatusFilter
  } = useAppSelector(state => state.leads);
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch leads on first mount
  useEffect(() => {
    if (mounted && status === 'idle') {
      dispatch(fetchLeads());
    }
  }, [dispatch, status, mounted]);
  
  const isLoading = !mounted || status === 'loading';
  
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Reached Out', label: 'Reached Out' },
  ];
  
  // Early return for server rendering to prevent hydration mismatches
  if (!mounted) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-black">Leads</h1>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-black">Leads</h1>
        
        <div className="flex gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={currentSearchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 w-64 placeholder-gray-500 text-black"
            />
          </div>
          
          <div className="relative">
            <select
              value={currentStatusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none text-black"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <LeadTable 
            leads={filteredLeads}
          />
        )}
      </div>
    </AdminLayout>
  );
} 