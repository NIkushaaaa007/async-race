import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { startCarThunk, stopCarThunk } from '../race/raceThunks';
import { calculateDriveDurationMs } from '../../utils/animation';
import CarIcon from './CarIcon';
import type { Car } from '../../types';

interface CarItemProps {
  car: Car;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  raceLocked: boolean;
}

function getTrackTravelPx(trackEl: HTMLDivElement | null): number {
  const trackWidth = trackEl?.clientWidth ?? 300;
  return Math.max(trackWidth - 100, 0);
}

function CarItem({ car, onSelect, onDelete, raceLocked }: CarItemProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const raceState = useAppSelector((state) => state.race.carStates[car.id]);
  const status = raceState?.status ?? 'idle';
  const velocity = raceState?.velocity ?? 0;
  const distance = raceState?.distance ?? 0;
  const trackRef = useRef<HTMLDivElement>(null);

  const isDriving = status === 'driving';
  const isStopped = status === 'idle' || status === 'stopped';
  const hasMoved = isDriving || status === 'finished' || status === 'broken';
  const transitionMs = isDriving ? calculateDriveDurationMs(distance, velocity) : 0;
  const travelPx = hasMoved ? getTrackTravelPx(trackRef.current) : 0;

  const handleStart = (): void => {
    dispatch(startCarThunk({ car }));
  };
  const handleStop = (): void => {
    dispatch(stopCarThunk(car));
  };

  return (
    <div className="car-item">
      <div className="car-item-controls">
        <button type="button" disabled={raceLocked} onClick={() => onSelect(car.id)}>
          Select
        </button>
        <button type="button" disabled={raceLocked} onClick={() => onDelete(car.id)}>
          Remove
        </button>
        <button type="button" disabled={!isStopped} onClick={handleStart}>
          Start
        </button>
        <button type="button" disabled={isStopped} onClick={handleStop}>
          Stop
        </button>
        <span className="car-item-name">{car.name}</span>
      </div>

      <div className="car-track" ref={trackRef}>
        <CarIcon color={car.color} translateX={travelPx} transitionMs={transitionMs} />
        <div className="finish-flag">🏁</div>
      </div>
    </div>
  );
}

export default CarItem;
