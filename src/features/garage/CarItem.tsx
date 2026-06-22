import React, { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { startCarThunk, stopCarThunk } from '../race/raceThunks';
import { announceWinner } from '../race/raceSlice';
import { saveWinnerThunk } from './garageSlice';
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
  const animationStartRef = useRef<number>(0);
  const frozenPxRef = useRef<number>(0);

  const isDriving = status === 'driving';
  const isStopped = status === 'idle' || status === 'stopped';
  const isBroken = status === 'broken';

  // When driving starts, record start time and reset frozen position
  if (isDriving && animationStartRef.current === 0) {
    animationStartRef.current = performance.now();
    frozenPxRef.current = 0;
  }

  // When engine breaks, freeze the car at its current visual position
  // by calculating how far it got before breaking
  const getProgressPx = (): number => {
    if (!isDriving && !isBroken) return 0;
    const trackPx = getTrackTravelPx(trackRef.current);
    if (isBroken && frozenPxRef.current === 0) {
      const elapsed = performance.now() - animationStartRef.current;
      const totalMs = calculateDriveDurationMs(distance, velocity);
      const progress = totalMs > 0 ? Math.min(elapsed / totalMs, 1) : 0;
      frozenPxRef.current = Math.round(trackPx * progress);
    }
    return isBroken ? frozenPxRef.current : trackPx;
  };

  const hasMoved = isDriving || status === 'finished' || isBroken;
  const transitionMs = isDriving ? calculateDriveDurationMs(distance, velocity) : 0;
  const travelPx = hasMoved ? getProgressPx() : 0;

  const handleStart = (): void => {
    animationStartRef.current = 0;
    frozenPxRef.current = 0;
    dispatch(startCarThunk({ car }));
  };

  const handleStop = (): void => {
    animationStartRef.current = 0;
    frozenPxRef.current = 0;
    dispatch(stopCarThunk(car));
  };

  const handleVisualFinish = (): void => {
    if (status !== 'finished') return;
    const elapsedSeconds = (performance.now() - animationStartRef.current) / 1000;
    dispatch(announceWinner({ id: car.id, name: car.name, time: elapsedSeconds }));
    dispatch(saveWinnerThunk({ id: car.id, time: elapsedSeconds }));
    animationStartRef.current = 0;
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
        <CarIcon
          color={car.color}
          translateX={travelPx}
          transitionMs={isBroken ? 0 : transitionMs}
          onTransitionEnd={status === 'finished' ? handleVisualFinish : undefined}
        />
        <div className="finish-flag">🏁</div>
      </div>
    </div>
  );
}

export default CarItem;
