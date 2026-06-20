import { CAR_BRANDS, CAR_MODELS, RANDOM_CARS_COUNT } from './constants';
import type { CarFormData } from '../types';

function randomItem<T>(list: T[]): T {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, '0')}`;
}

export function generateRandomCar(): CarFormData {
  const brand = randomItem(CAR_BRANDS);
  const model = randomItem(CAR_MODELS);
  return {
    name: `${brand} ${model}`,
    color: randomHexColor(),
  };
}

export function generateRandomCars(count: number = RANDOM_CARS_COUNT): CarFormData[] {
  return Array.from({ length: count }, () => generateRandomCar());
}
