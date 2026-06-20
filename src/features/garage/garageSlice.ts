import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../api/carsApi';
import type { Car, CarFormData } from '../../types';
import { CARS_PER_PAGE } from '../../utils/constants';

interface GarageState {
  cars: Car[];
  totalCount: number;
  currentPage: number;
  selectedCarId: number | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  currentPage: 1,
  selectedCarId: null,
  status: 'idle',
};

// ---------- Thunks ----------

export const loadCars = createAsyncThunk(
  'garage/loadCars',
  async (page: number) => {
    const { data, totalCount } = await api.fetchCars(page, CARS_PER_PAGE);
    return { data, totalCount };
  },
);

export const addCar = createAsyncThunk(
  'garage/addCar',
  async (car: CarFormData, { dispatch, getState }) => {
    await api.createCar(car);
    const state = getState() as { garage: GarageState };
    await dispatch(loadCars(state.garage.currentPage));
  },
);

export const editCar = createAsyncThunk(
  'garage/editCar',
  async (
    { id, car }: { id: number; car: CarFormData },
    { dispatch, getState },
  ) => {
    await api.updateCar(id, car);
    const state = getState() as { garage: GarageState };
    await dispatch(loadCars(state.garage.currentPage));
  },
);

export const removeCar = createAsyncThunk(
  'garage/removeCar',
  async (id: number, { dispatch, getState }) => {
    await api.deleteCar(id);
    await api.deleteWinner(id);

    const state = getState() as { garage: GarageState };
    const { cars, currentPage } = state.garage;
    const isLastCarOnPage = cars.length === 1 && currentPage > 1;
    const pageToLoad = isLastCarOnPage ? currentPage - 1 : currentPage;

    await dispatch(loadCars(pageToLoad));
  },
);
export const saveWinnerThunk = createAsyncThunk(
  'garage/saveWinner',
  async ({ id, time }: { id: number; time: number }) => {
    await api.saveWinner(id, time);
  },
);
export const createRandomCarsThunk = createAsyncThunk(
  'garage/generateRandomCars',
  async (randomCars: CarFormData[], { dispatch, getState }) => {
    await api.createRandomCars(randomCars);
    const state = getState() as { garage: GarageState };
    await dispatch(loadCars(state.garage.currentPage));
  },
);

// ---------- Slice ----------

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    selectCar(state, action: PayloadAction<number | null>) {
      state.selectedCarId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCars.fulfilled, (state, action) => {
        state.status = 'idle';
        state.cars = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(loadCars.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(removeCar.fulfilled, (state) => {
        state.selectedCarId = null;
      });
  },
});

export const { setCurrentPage, selectCar } = garageSlice.actions;
export default garageSlice.reducer;