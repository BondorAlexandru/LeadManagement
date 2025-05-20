import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Lead, LeadFormData, LeadStatus } from '@/types';
import { getLeads, submitLead, updateLeadStatus } from '@/lib/api';

interface LeadsState {
  items: Lead[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filteredLeads: Lead[];
  currentSearchTerm: string;
  currentStatusFilter: string;
}

const initialState: LeadsState = {
  items: [],
  status: 'idle',
  error: null,
  filteredLeads: [],
  currentSearchTerm: '',
  currentStatusFilter: 'all',
};

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async () => {
    return await getLeads();
  }
);

export const addNewLead = createAsyncThunk(
  'leads/addNewLead',
  async (leadData: LeadFormData) => {
    return await submitLead(leadData);
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ leadId, status }: { leadId: string, status: LeadStatus }) => {
    return await updateLeadStatus(leadId, status);
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.currentSearchTerm = action.payload;
      applyFilters(state);
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.currentStatusFilter = action.payload;
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.currentSearchTerm = '';
      state.currentStatusFilter = 'all';
      state.filteredLeads = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        applyFilters(state);
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch leads';
      })
      .addCase(addNewLead.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        applyFilters(state);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.items.findIndex((lead) => lead.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        applyFilters(state);
      });
  },
});

// Helper function to apply filters
const applyFilters = (state: LeadsState) => {
  state.filteredLeads = state.items.filter((lead) => {
    const matchesSearch = 
      state.currentSearchTerm === '' || 
      lead.firstName.toLowerCase().includes(state.currentSearchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(state.currentSearchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(state.currentSearchTerm.toLowerCase()) ||
      (lead.country && lead.country.toLowerCase().includes(state.currentSearchTerm.toLowerCase()));
    
    const matchesStatus = 
      state.currentStatusFilter === 'all' || 
      lead.status === state.currentStatusFilter;
    
    return matchesSearch && matchesStatus;
  });
};

export const { setSearchTerm, setStatusFilter, resetFilters } = leadsSlice.actions;

export default leadsSlice.reducer; 