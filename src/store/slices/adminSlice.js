import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  reports: [],
  dashboard: {
    totalLeads: 0,
    totalFollowUps: 0,
    totalPayments: 0,
    recentActivities: [],
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
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

    // User management actions
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },

    // Reports actions
    fetchReportsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchReportsSuccess: (state, action) => {
      state.loading = false;
      state.reports = action.payload;
    },
    fetchReportsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDashboardDataStart,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUser,
  updateUser,
  deleteUser,
  fetchReportsStart,
  fetchReportsSuccess,
  fetchReportsFailure,
} = adminSlice.actions;

export default adminSlice.reducer; 