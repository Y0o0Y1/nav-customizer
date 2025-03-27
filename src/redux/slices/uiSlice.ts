import { createSlice } from '@reduxjs/toolkit';
import { navigationApi } from '@/api/services/navigationApi';

export interface UiState {
  isLoading: boolean;
  isMenuOpen: boolean;
}

const initialState: UiState = {
  isLoading: false,
  isMenuOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    const navigationApiEndpoints = [
      navigationApi.endpoints.getNavigation,
      navigationApi.endpoints.saveNavigation,
      navigationApi.endpoints.trackNavItemMove,
    ];

    navigationApiEndpoints.forEach((endpoint) => {
      builder
        .addMatcher(endpoint.matchPending, (state) => {
          state.isLoading = true;
        })
        .addMatcher(endpoint.matchFulfilled, (state) => {
          state.isLoading = false;
        })
        .addMatcher(endpoint.matchRejected, (state) => {
          state.isLoading = false;
        });
    });
  },
});

export const { setLoading, setMenuOpen } = uiSlice.actions;

export default uiSlice.reducer;
