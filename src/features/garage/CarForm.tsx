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

function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= CAR_NAME_MAX_LENGTH;
}

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

  useEffect(() => {
    setName(initialName);
    setColor(initialColor);
  }, [initialName, initialColor]);

  const nameValid = isValidName(name);
  const showError = !nameValid && name.trim().length === 0 && name.length > 0;

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!nameValid) return;
    onSubmit({ name: name.trim(), color });
    if (!initialName) {
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
      <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
      <button type="submit" disabled={disabled || !nameValid}>
        {submitLabel}
      </button>
      {showError && <span className="form-error">Name cannot be empty</span>}
    </form>
  );
}

CarForm.defaultProps = {
  initialName: '',
  initialColor: DEFAULT_COLOR,
};

export default CarForm;
