import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/carsApi';
import { setCarStatus, setCarEngineData, announceWinner } from './raceSlice';
import { saveWinnerThunk } from '../garage/garageSlice';
import { calculateDriveDurationMs } from '../../utils/animation';
import type { Car } from '../../types';

interface StartCarArgs {
  car: Car;
}

// Drives a single car: start engine -> animate -> drive -> finish/broken.
// Used both by an individual car's Start button and by "Start Race" (called
// once per car on the page).
export const startCarThunk = createAsyncThunk(
  'race/startCar',
  async ({ car }: StartCarArgs, { dispatch }) => {
    dispatch(setCarStatus({ id: car.id, status: 'started' }));

    let velocity = 0;
    let distance = 0;
    try {
      const engineData = await api.startEngine(car.id);
      velocity = engineData.velocity;
      distance = engineData.distance;
    } catch (error) {
      dispatch(setCarStatus({ id: car.id, status: 'broken' }));
      return;
    }

    dispatch(setCarEngineData({ id: car.id, velocity, distance }));
    dispatch(setCarStatus({ id: car.id, status: 'driving' }));

    const startTime = Date.now();
    try {
      const result = await api.driveEngine(car.id);
      if (result.success) {
        const finishSeconds = (Date.now() - startTime) / 1000;
        dispatch(setCarStatus({ id: car.id, status: 'finished' }));
        dispatch(announceWinner({ id: car.id, name: car.name, time: finishSeconds }));
        dispatch(saveWinnerThunk({ id: car.id, time: finishSeconds }));
      }
    } catch (error) {
      dispatch(setCarStatus({ id: car.id, status: 'broken' }));
    }
  },
);

export const stopCarThunk = createAsyncThunk(
  'race/stopCar',
  async (car: Car, { dispatch }) => {
    await api.stopEngine(car.id);
    dispatch(setCarEngineData({ id: car.id, velocity: 0, distance: 0 }));
    dispatch(setCarStatus({ id: car.id, status: 'stopped' }));
  },
);

// Fires startCarThunk for every car on the current page, in parallel.
export const startRaceThunk = createAsyncThunk(
  'race/startRace',
  async (cars: Car[], { dispatch }) => {
    await Promise.all(
      cars.map((car) => dispatch(startCarThunk({ car }))),
    );
  },
);