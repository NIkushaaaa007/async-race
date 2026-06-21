import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  loadCars,
  setCurrentPage,
  removeCar,
  selectCar,
  addCar,
  editCar,
  createRandomCarsThunk,
} from './garageSlice';
import { startRaceThunk } from '../race/raceThunks';
import { resetAllCarStates, setRacing } from '../race/raceSlice';
import { CARS_PER_PAGE, RANDOM_CARS_COUNT } from '../../utils/constants';
import { generateRandomCars } from '../../utils/randomCar';
import CarList from './CarList';
import CarFormsRow from './CarFormsRow';
import RaceControls from './RaceControls';
import Pagination from '../../components/Pagination';
import WinnerBanner from '../race/WinnerBanner';
import type { CarFormData } from '../../types';

function calculateTotalPages(totalCount: number): number {
  return Math.max(1, Math.ceil(totalCount / CARS_PER_PAGE));
}

function useGarageHandlers() {
  const dispatch = useAppDispatch();
  const { cars, selectedCarId } = useAppSelector((state) => state.garage);
  const isRacing = useAppSelector((state) => state.race.isRacing);

  return {
    onPageChange: (page: number) => !isRacing && dispatch(setCurrentPage(page)),
    onGenerateRandom: () => dispatch(createRandomCarsThunk(generateRandomCars(RANDOM_CARS_COUNT))),
    onStartRace: () => {
      dispatch(setRacing(true));
      dispatch(startRaceThunk(cars));
    },
    onResetRace: () => dispatch(resetAllCarStates()),
    onSelect: (id: number) => dispatch(selectCar(id)),
    onDelete: (id: number) => dispatch(removeCar(id)),
    onCreate: (data: CarFormData) => dispatch(addCar(data)),
    onEdit: (data: CarFormData) => {
      if (selectedCarId !== null) dispatch(editCar({ id: selectedCarId, car: data }));
    },
  };
}

function useGarageData() {
  const { cars, totalCount, currentPage, status, selectedCarId } = useAppSelector(
    (state) => state.garage,
  );
  const isRacing = useAppSelector((state) => state.race.isRacing);
  const selectedCar = cars.find((car) => car.id === selectedCarId) ?? null;
  const totalPages = calculateTotalPages(totalCount);

  return { cars, totalCount, currentPage, status, isRacing, selectedCar, totalPages };
}

function GarageView(): React.ReactElement {
  const dispatch = useAppDispatch();
  const data = useGarageData();
  const handlers = useGarageHandlers();

  useEffect(() => {
    dispatch(loadCars(data.currentPage));
  }, [dispatch, data.currentPage]);

  return (
    <section>
      <h1>Garage ({data.totalCount})</h1>
      <WinnerBanner />
      <CarFormsRow
        selectedCar={data.selectedCar}
        isRacing={data.isRacing}
        onCreate={handlers.onCreate}
        onEdit={handlers.onEdit}
      />
      <RaceControls
        isRacing={data.isRacing}
        onStartRace={handlers.onStartRace}
        onResetRace={handlers.onResetRace}
        onGenerateRandom={handlers.onGenerateRandom}
      />
      <CarList
        cars={data.cars}
        status={data.status}
        raceLocked={data.isRacing}
        onSelect={handlers.onSelect}
        onDelete={handlers.onDelete}
      />
      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        disabled={data.isRacing}
        onPageChange={handlers.onPageChange}
      />
    </section>
  );
}

export default GarageView;
