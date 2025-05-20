'use client';

import { useEffect, useState } from 'react';
import { Lead } from '@/types';
import { getLeads } from '@/lib/api';
import { AdminLayout } from '@/components/AdminLayout';
import { LeadTable } from '@/components/LeadTable';
import { Input } from '@/components/ui/input';
import { Select, SelectOption } from '@/components/ui/select';

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leadsData = await getLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, []);
  
  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
  };
  
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Reached Out', label: 'Reached Out' },
  ];
  
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      searchTerm === '' || 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.country && lead.country.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' || 
      lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <Input
            type="search"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <LeadTable 
          leads={filteredLeads} 
          onLeadUpdate={handleLeadUpdate} 
        />
      )}
      
      <div className="mt-6 flex justify-center">
        <div className="bg-white rounded-md shadow px-4 py-3 inline-flex space-x-2">
          <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700">
            1
          </button>
          <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">
            3
          </button>
        </div>
      </div>
    </AdminLayout>
  );
} 