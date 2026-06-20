import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../api/carsApi';
import type { Winner, WinnerWithCar, SortField, SortOrder } from '../../types';
import { WINNERS_PER_PAGE } from '../../utils/constants';

interface WinnersState {
  winners: WinnerWithCar[];
  totalCount: number;
  currentPage: number;
  sortField: SortField;
  sortOrder: SortOrder;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: WinnersState = {
  winners: [],
  totalCount: 0,
  currentPage: 1,
  sortField: 'wins',
  sortOrder: 'ASC',
  status: 'idle',
};

interface LoadWinnersArgs {
  page: number;
  sortField: SortField;
  sortOrder: SortOrder;
}

// Winners endpoint only returns id/wins/time — we join each one with its
// car's name/color from the garage endpoint so the table can render an image.
async function attachCarData(winners: Winner[]): Promise<WinnerWithCar[]> {
  const cars = await Promise.all(
    winners.map((winner) => api.fetchCar(winner.id)),
  );
  return winners.map((winner, index) => ({
    ...winner,
    name: cars[index].name,
    color: cars[index].color,
  }));
}

export const loadWinners = createAsyncThunk(
  'winners/loadWinners',
  async ({ page, sortField, sortOrder }: LoadWinnersArgs) => {
    const { data, totalCount } = await api.fetchWinners(
      page,
      WINNERS_PER_PAGE,
      sortField,
      sortOrder,
    );
    const winnersWithCars = await attachCarData(data);
    return { data: winnersWithCars, totalCount };
  },
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setWinnersPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSort(state, action: PayloadAction<{ field: SortField; order: SortOrder }>) {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWinners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadWinners.fulfilled, (state, action) => {
        state.status = 'idle';
        state.winners = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(loadWinners.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setWinnersPage, setSort } = winnersSlice.actions;
export default winnersSlice.reducer;