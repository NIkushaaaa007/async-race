import React from 'react';
import CarForm from './CarForm';
import type { Car, CarFormData } from '../../types';

interface CarFormsRowProps {
  selectedCar: Car | null;
  isRacing: boolean;
  onCreate: (data: CarFormData) => void;
  onEdit: (data: CarFormData) => void;
}

function CarFormsRow({
  selectedCar,
  isRacing,
  onCreate,
  onEdit,
}: CarFormsRowProps): React.ReactElement {
  return (
    <div className="forms-row">
      <CarForm title="Create" disabled={isRacing} submitLabel="Create" onSubmit={onCreate} />
      <CarForm
        title="Update"
        initialName={selectedCar?.name ?? ''}
        initialColor={selectedCar?.color ?? '#ff0000'}
        disabled={selectedCar === null || isRacing}
        submitLabel="Update"
        onSubmit={onEdit}
      />
    </div>
  );
}

export default CarFormsRow;
