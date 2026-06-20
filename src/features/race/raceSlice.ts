import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CarRaceState, CarEngineStatus } from '../../types';

interface RaceState {
  // keyed by car id
  carStates: Record<number, CarRaceState>;
  isRacing: boolean;
  winnerId: number | null;
  winnerName: string | null;
  winnerTime: number | null;
}

const initialState: RaceState = {
  carStates: {},
  isRacing: false,
  winnerId: null,
  winnerName: null,
  winnerTime: null,
};

const defaultCarState: CarRaceState = {
  status: 'idle',
  velocity: 0,
  distance: 0,
};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    setCarEngineData(
      state,
      action: PayloadAction<{ id: number; velocity: number; distance: number }>,
    ) {
      const { id, velocity, distance } = action.payload;
      const existing = state.carStates[id] ?? defaultCarState;
      state.carStates[id] = { ...existing, velocity, distance };
    },
    setCarStatus(state, action: PayloadAction<{ id: number; status: CarEngineStatus }>) {
      const { id, status } = action.payload;
      const existing = state.carStates[id] ?? defaultCarState;
      state.carStates[id] = { ...existing, status };
    },
    resetCarState(state, action: PayloadAction<number>) {
      state.carStates[action.payload] = { ...defaultCarState };
    },
    resetAllCarStates(state) {
      Object.keys(state.carStates).forEach((key) => {
        state.carStates[Number(key)] = { ...defaultCarState };
      });
      state.winnerId = null;
      state.winnerName = null;
      state.winnerTime = null;
      state.isRacing = false;
    },
    setRacing(state, action: PayloadAction<boolean>) {
      state.isRacing = action.payload;
    },
    announceWinner(state, action: PayloadAction<{ id: number; name: string; time: number }>) {
      // Only the first car to finish should be announced
      if (state.winnerId === null) {
        state.winnerId = action.payload.id;
        state.winnerName = action.payload.name;
        state.winnerTime = action.payload.time;
      }
    },
    clearWinnerBanner(state) {
      state.winnerId = null;
      state.winnerName = null;
      state.winnerTime = null;
    },
  },
});

export const {
  setCarEngineData,
  setCarStatus,
  resetCarState,
  resetAllCarStates,
  setRacing,
  announceWinner,
  clearWinnerBanner,
} = raceSlice.actions;

export default raceSlice.reducer;
