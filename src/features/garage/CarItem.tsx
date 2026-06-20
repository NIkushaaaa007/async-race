import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { startCarThunk, stopCarThunk } from '../race/raceThunks';
import { calculateDriveDurationMs } from '../../utils/animation';
import type { Car } from '../../types';

interface CarItemProps {
  car: Car;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  raceLocked: boolean;
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

  const transitionMs = calculateDriveDurationMs(distance, velocity);

  const getTrackTravelPx = (): number => {
    const trackWidth = trackRef.current?.clientWidth ?? 300;
    return Math.max(trackWidth - 100, 0);
  };

  const handleStart = (): void => {
    dispatch(startCarThunk({ car }));
  };

  const handleStop = (): void => {
    dispatch(stopCarThunk(car));
  };

  const travelPx = hasMoved ? getTrackTravelPx() : 0;

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
        <svg
          className="car-icon"
          width="60"
          height="30"
          viewBox="0 0 60 30"
          fill={car.color}
          style={{
            transform: `translateX(${travelPx}px)`,
            transition: isDriving ? `transform ${transitionMs}ms linear` : 'none',
          }}
        >
          <rect x="5" y="10" width="50" height="12" rx="3" />
          <circle cx="15" cy="24" r="5" fill="#333" />
          <circle cx="45" cy="24" r="5" fill="#333" />
        </svg>
        <div className="finish-flag">🏁</div>
      </div>
    </div>
  );
}

export default CarItem;
