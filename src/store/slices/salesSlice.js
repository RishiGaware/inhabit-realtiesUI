import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventory: [],
  bookings: [],
  payments: [],
  handovers: [],
  referrals: [],
  dashboard: {
    totalBookings: 0,
    pendingPayments: 0,
    upcomingHandovers: 0,
    recentActivities: [],
  },
  loading: false,
  error: null,
};

const salesSlice = createSlice({
  name: 'sales',
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

    // Inventory actions
    fetchInventoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action) => {
      state.loading = false;
      state.inventory = action.payload;
    },
    fetchInventoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateInventory: (state, action) => {
      const index = state.inventory.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.inventory[index] = action.payload;
      }
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
    createBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
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
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },

    // Handover actions
    fetchHandoversStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHandoversSuccess: (state, action) => {
      state.loading = false;
      state.handovers = action.payload;
    },
    fetchHandoversFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    scheduleHandover: (state, action) => {
      state.handovers.push(action.payload);
    },
    updateHandover: (state, action) => {
      const index = state.handovers.findIndex(handover => handover.id === action.payload.id);
      if (index !== -1) {
        state.handovers[index] = action.payload;
      }
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
    addReferral: (state, action) => {
      state.referrals.push(action.payload);
    },
  },
});

export const {
  fetchDashboardDataStart,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  updateInventory,
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  createBooking,
  updateBooking,
  fetchPaymentsStart,
  fetchPaymentsSuccess,
  fetchPaymentsFailure,
  addPayment,
  updatePayment,
  fetchHandoversStart,
  fetchHandoversSuccess,
  fetchHandoversFailure,
  scheduleHandover,
  updateHandover,
  fetchReferralsStart,
  fetchReferralsSuccess,
  fetchReferralsFailure,
  addReferral,
} = salesSlice.actions;

export default salesSlice.reducer; 