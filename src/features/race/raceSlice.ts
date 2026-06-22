import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CarRaceState, CarEngineStatus } from '../../types';

interface RaceState {
  carStates: Record<number, CarRaceState>;
  pendingFinishTimes: Record<number, number>;
  isRacing: boolean;
  winnerId: number | null;
  winnerName: string | null;
  winnerTime: number | null;
}

const initialState: RaceState = {
  carStates: {},
  pendingFinishTimes: {},
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
    setCarFinishTime(state, action: PayloadAction<{ id: number; finishSeconds: number }>) {
      state.pendingFinishTimes[action.payload.id] = action.payload.finishSeconds;
    },
    resetCarState(state, action: PayloadAction<number>) {
      state.carStates[action.payload] = { ...defaultCarState };
      delete state.pendingFinishTimes[action.payload];
    },
    resetAllCarStates(state) {
      Object.keys(state.carStates).forEach((key) => {
        state.carStates[Number(key)] = { ...defaultCarState };
      });
      state.pendingFinishTimes = {};
      state.winnerId = null;
      state.winnerName = null;
      state.winnerTime = null;
      state.isRacing = false;
    },
    setRacing(state, action: PayloadAction<boolean>) {
      state.isRacing = action.payload;
    },
    announceWinner(state, action: PayloadAction<{ id: number; name: string; time: number }>) {
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
  setCarFinishTime,
  resetCarState,
  resetAllCarStates,
  setRacing,
  announceWinner,
  clearWinnerBanner,
} = raceSlice.actions;

export default raceSlice.reducer;
