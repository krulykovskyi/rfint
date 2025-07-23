import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [],
  adminData: [],
  loading: false,
  error: null,
  searchQuery: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAdminData: (state, action) => {
      state.adminData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: state => {
      state.error = null;
    },
    addAdminItem: (state, action) => {
      state.adminData.push(action.payload);
    },
    updateAdminItem: (state, action) => {
      const index = state.adminData.findIndex(
        item => item.id === action.payload.id
      );
      if (index !== -1) {
        state.adminData[index] = action.payload;
      }
    },
    deleteAdminItem: (state, action) => {
      state.adminData = state.adminData.filter(
        item => item.id !== action.payload
      );
    },
  },
});

export const {
  setSearchResults,
  setAdminData,
  setSearchQuery,
  setLoading,
  setError,
  clearError,
  addAdminItem,
  updateAdminItem,
  deleteAdminItem,
} = dataSlice.actions;

export default dataSlice.reducer;
