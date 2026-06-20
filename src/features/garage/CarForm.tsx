import React, { useState, useEffect } from 'react';
import { CAR_NAME_MAX_LENGTH } from '../../utils/constants';
import type { CarFormData } from '../../types';

interface CarFormProps {
  title: string;
  initialName?: string;
  initialColor?: string;
  disabled: boolean;
  submitLabel: string;
  onSubmit: (data: CarFormData) => void;
}

const DEFAULT_COLOR = '#ff0000';

function CarForm({
  title,
  initialName = '',
  initialColor = DEFAULT_COLOR,
  disabled,
  submitLabel,
  onSubmit,
}: CarFormProps): React.ReactElement {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  // Re-sync fields when a different car gets selected for editing
  useEffect(() => {
    setName(initialName);
    setColor(initialColor);
  }, [initialName, initialColor]);

  const trimmedName = name.trim();
  const isNameValid = trimmedName.length > 0 && trimmedName.length <= CAR_NAME_MAX_LENGTH;

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!isNameValid) return;
    onSubmit({ name: trimmedName, color });
    if (!initialName) {
      // creation form: clear after submit
      setName('');
      setColor(DEFAULT_COLOR);
    }
  };

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <input
        type="text"
        value={name}
        placeholder="Car name"
        maxLength={CAR_NAME_MAX_LENGTH}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        type="color"
        value={color}
        onChange={(event) => setColor(event.target.value)}
      />
      <button type="submit" disabled={disabled || !isNameValid}>
        {submitLabel}
      </button>
      {!isNameValid && trimmedName.length === 0 && name.length > 0 && (
        <span className="form-error">Name cannot be empty</span>
      )}
    </form>
  );
}

CarForm.defaultProps = {
  initialName: '',
  initialColor: DEFAULT_COLOR,
};

export default CarForm;
