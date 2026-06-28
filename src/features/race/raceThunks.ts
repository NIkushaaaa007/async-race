import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/carsApi';
import { setCarStatus, setCarEngineData, announceWinner } from './raceSlice';
import { saveWinnerThunk } from '../garage/garageSlice';
import type { Car } from '../../types';

// One winner per race — reset when startRaceThunk begins
let winnerAnnouncedForCurrentRace = false;

interface StartCarArgs {
  car: Car;
}

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
    } catch {
      dispatch(setCarStatus({ id: car.id, status: 'broken' }));
      return;
    }

    dispatch(setCarEngineData({ id: car.id, velocity, distance }));
    dispatch(setCarStatus({ id: car.id, status: 'driving' }));

    const startTime = performance.now();
    try {
      const result = await api.driveEngine(car.id);
      if (result.success) {
        dispatch(setCarStatus({ id: car.id, status: 'finished' }));
        if (!winnerAnnouncedForCurrentRace) {
          winnerAnnouncedForCurrentRace = true;
          const finishSeconds = (performance.now() - startTime) / 1000;
          dispatch(announceWinner({ id: car.id, name: car.name, time: finishSeconds }));
          dispatch(saveWinnerThunk({ id: car.id, time: finishSeconds }));
        }
      }
    } catch {
      // Engine broke mid-race — animation continues but car won't be announced as winner
    }
  },
);

export const stopCarThunk = createAsyncThunk('race/stopCar', async (car: Car, { dispatch }) => {
  await api.stopEngine(car.id);
  dispatch(setCarEngineData({ id: car.id, velocity: 0, distance: 0 }));
  dispatch(setCarStatus({ id: car.id, status: 'stopped' }));
});

export const startRaceThunk = createAsyncThunk(
  'race/startRace',
  async (cars: Car[], { dispatch }) => {
    winnerAnnouncedForCurrentRace = false;
    await Promise.all(cars.map((car) => dispatch(startCarThunk({ car }))));
  },
);
