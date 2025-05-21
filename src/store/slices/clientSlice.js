import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  bookings: [],
  documents: [],
  payments: [],
  referrals: [],
  dashboard: {
    bookingStatus: null,
    nextPayment: null,
    documentCount: 0,
    recentActivities: [],
  },
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'client',
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

    // Profile actions
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    fetchProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    // Booking actions
    fetchBookingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    },
    fetchBookingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Document actions
    fetchDocumentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDocumentsSuccess: (state, action) => {
      state.loading = false;
      state.documents = action.payload;
    },
    fetchDocumentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Payment actions
    fetchPaymentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentsSuccess: (state, action) => {
      state.loading = false;
      state.payments = action.payload;
    },
    fetchPaymentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Referral actions
    fetchReferralsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchReferralsSuccess: (state, action) => {
      state.loading = false;
      state.referrals = action.payload;
    },
    fetchReferralsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    submitReferral: (state, action) => {
      state.referrals.push(action.payload);
    },
  },
});

export const {
  fetchDashboardDataStart,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfile,
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  fetchPaymentsStart,
  fetchPaymentsSuccess,
  fetchPaymentsFailure,
  fetchReferralsStart,
  fetchReferralsSuccess,
  fetchReferralsFailure,
  submitReferral,
} = clientSlice.actions;

export default clientSlice.reducer; 