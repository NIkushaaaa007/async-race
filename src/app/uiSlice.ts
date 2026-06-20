import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type View = 'garage' | 'winners';

interface UiState {
  activeView: View;
}

const initialState: UiState = {
  activeView: 'garage',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView(state, action: PayloadAction<View>) {
      state.activeView = action.payload;
    },
  },
});

export const { setActiveView } = uiSlice.actions;
export default uiSlice.reducer;