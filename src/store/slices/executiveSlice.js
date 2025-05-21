import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  customers: [],
  siteVisits: [],
  documents: [],
  dashboard: {
    totalLeads: 0,
    activeLeads: 0,
    scheduledVisits: 0,
    recentActivities: [],
  },
  loading: false,
  error: null,
};

const executiveSlice = createSlice({
  name: 'executive',
  initialState,
  reducers: {
    // Dashboard actions
    fetchDashboardDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardDataSuccess: (state, action) => {
      state.loading = false;
      state.dashboard = action.payload;
    },
    fetchDashboardDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Lead management actions
    fetchLeadsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeadsSuccess: (state, action) => {
      state.loading = false;
      state.leads = action.payload;
    },
    fetchLeadsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLead: (state, action) => {
      state.leads.push(action.payload);
    },
    updateLead: (state, action) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    deleteLead: (state, action) => {
      state.leads = state.leads.filter(lead => lead.id !== action.payload);
    },

    // Customer management actions
    fetchCustomersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomersSuccess: (state, action) => {
      state.loading = false;
      state.customers = action.payload;
    },
    fetchCustomersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },

    // Site visits actions
    fetchSiteVisitsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSiteVisitsSuccess: (state, action) => {
      state.loading = false;
      state.siteVisits = action.payload;
    },
    fetchSiteVisitsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    scheduleSiteVisit: (state, action) => {
      state.siteVisits.push(action.payload);
    },
    updateSiteVisit: (state, action) => {
      const index = state.siteVisits.findIndex(visit => visit.id === action.payload.id);
      if (index !== -1) {
        state.siteVisits[index] = action.payload;
      }
    },
    cancelSiteVisit: (state, action) => {
      state.siteVisits = state.siteVisits.filter(visit => visit.id !== action.payload);
    },
  },
});

export const {
  fetchDashboardDataStart,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
  fetchLeadsStart,
  fetchLeadsSuccess,
  fetchLeadsFailure,
  addLead,
  updateLead,
  deleteLead,
  fetchCustomersStart,
  fetchCustomersSuccess,
  fetchCustomersFailure,
  addCustomer,
  updateCustomer,
  fetchSiteVisitsStart,
  fetchSiteVisitsSuccess,
  fetchSiteVisitsFailure,
  scheduleSiteVisit,
  updateSiteVisit,
  cancelSiteVisit,
} = executiveSlice.actions;

export default executiveSlice.reducer; 