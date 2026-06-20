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
import CarItem from './CarItem';
import CarForm from './CarForm';
import type { CarFormData } from '../../types';

function GarageView(): React.ReactElement {
  const dispatch = useAppDispatch();
  const { cars, totalCount, currentPage, status, selectedCarId } = useAppSelector(
    (state) => state.garage,
  );
  const isRacing = useAppSelector((state) => state.race.isRacing);

  useEffect(() => {
    dispatch(loadCars(currentPage));
  }, [dispatch, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / CARS_PER_PAGE));
  const selectedCar = cars.find((car) => car.id === selectedCarId) ?? null;

  const handleSelect = (id: number): void => {
    dispatch(selectCar(id));
  };

  const handleDelete = (id: number): void => {
    dispatch(removeCar(id));
  };

  const goToPage = (page: number): void => {
    if (isRacing) return;
    dispatch(setCurrentPage(page));
  };

  const handleCreate = (data: CarFormData): void => {
    dispatch(addCar(data));
  };

  const handleEdit = (data: CarFormData): void => {
    if (selectedCarId === null) return;
    dispatch(editCar({ id: selectedCarId, car: data }));
  };

  const handleGenerateRandom = (): void => {
    const randomCars = generateRandomCars(RANDOM_CARS_COUNT);
    dispatch(createRandomCarsThunk(randomCars));
  };

  const handleStartRace = (): void => {
    dispatch(setRacing(true));
    dispatch(startRaceThunk(cars));
  };

  const handleResetRace = (): void => {
    dispatch(resetAllCarStates());
  };

  return (
    <section>
      <h1>Garage ({totalCount})</h1>

      <div className="forms-row">
        <CarForm
          title="Create"
          disabled={false}
          submitLabel="Create"
          onSubmit={handleCreate}
        />
        <CarForm
          title="Update"
          initialName={selectedCar?.name ?? ''}
          initialColor={selectedCar?.color ?? '#ff0000'}
          disabled={selectedCar === null}
          submitLabel="Update"
          onSubmit={handleEdit}
        />
      </div>

      <div className="race-controls">
        <button type="button" disabled={isRacing} onClick={handleStartRace}>
          Race
        </button>
        <button type="button" onClick={handleResetRace}>
          Reset
        </button>
        <button type="button" disabled={isRacing} onClick={handleGenerateRandom}>
          Generate 100 Cars
        </button>
      </div>

      {status === 'loading' && <p>Loading...</p>}

      {status === 'idle' && cars.length === 0 && <p>No Cars</p>}

      <div className="car-list">
        {cars.map((car) => (
          <CarItem
            key={car.id}
            car={car}
            onSelect={handleSelect}
            onDelete={handleDelete}
            raceLocked={isRacing}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          type="button"
          disabled={currentPage <= 1 || isRacing}
          onClick={() => goToPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages || isRacing}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default GarageView;