import React from 'react';
import CarItem from './CarItem';
import type { Car } from '../../types';

interface CarListProps {
  cars: Car[];
  status: 'idle' | 'loading' | 'failed';
  raceLocked: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

function CarList({
  cars,
  status,
  raceLocked,
  onSelect,
  onDelete,
}: CarListProps): React.ReactElement {
  if (status === 'idle' && cars.length === 0) {
    return <p>No Cars</p>;
  }

  return (
    <div className="car-list">
      {status === 'loading' && <p>Loading...</p>}
      {cars.map((car) => (
        <CarItem
          key={car.id}
          car={car}
          onSelect={onSelect}
          onDelete={onDelete}
          raceLocked={raceLocked}
        />
      ))}
    </div>
  );
}

export default CarList;
