import { GARAGE_ENDPOINT, ENGINE_ENDPOINT, WINNERS_ENDPOINT } from '../utils/constants';
import type {
  Car,
  CarFormData,
  Winner,
  EngineResponse,
  DriveResponse,
  SortField,
  SortOrder,
} from '../types';

interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
}

export async function fetchCars(page: number, limit: number): Promise<PaginatedResult<Car>> {
  const url = `${GARAGE_ENDPOINT}?_page=${page}&_limit=${limit}`;
  const response = await fetch(url);
  const data: Car[] = await response.json();
  const totalCount = Number(response.headers.get('X-Total-Count') ?? data.length);
  return { data, totalCount };
}
export async function fetchCar(id: number): Promise<Car> {
  const response = await fetch(`${GARAGE_ENDPOINT}/${id}`);
  return response.json();
}
export async function createCar(car: CarFormData): Promise<Car> {
  const response = await fetch(GARAGE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
}

export async function updateCar(id: number, car: CarFormData): Promise<Car> {
  const response = await fetch(`${GARAGE_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
}

export async function deleteCar(id: number): Promise<void> {
  await fetch(`${GARAGE_ENDPOINT}/${id}`, { method: 'DELETE' });
}

export async function createRandomCars(cars: CarFormData[]): Promise<Car[]> {
  return Promise.all(cars.map((car) => createCar(car)));
}

export async function startEngine(id: number): Promise<EngineResponse> {
  const response = await fetch(`${ENGINE_ENDPOINT}?id=${id}&status=started`, {
    method: 'PATCH',
  });
  return response.json();
}

export async function stopEngine(id: number): Promise<EngineResponse> {
  const response = await fetch(`${ENGINE_ENDPOINT}?id=${id}&status=stopped`, {
    method: 'PATCH',
  });
  return response.json();
}

export async function driveEngine(id: number): Promise<DriveResponse> {
  const response = await fetch(`${ENGINE_ENDPOINT}?id=${id}&status=drive`, {
    method: 'PATCH',
  });
  if (response.status === 500) {
    throw new Error('ENGINE_BROKEN');
  }
  return response.json();
}

export async function fetchWinners(
  page: number,
  limit: number,
  sort: SortField,
  order: SortOrder,
): Promise<PaginatedResult<Winner>> {
  const url = `${WINNERS_ENDPOINT}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;
  const response = await fetch(url);
  const data: Winner[] = await response.json();
  const totalCount = Number(response.headers.get('X-Total-Count') ?? data.length);
  return { data, totalCount };
}

export async function fetchWinnerById(id: number): Promise<Winner | null> {
  const response = await fetch(`${WINNERS_ENDPOINT}/${id}`);
  if (response.status === 404) return null;
  return response.json();
}

export async function createWinner(winner: Winner): Promise<Winner> {
  const response = await fetch(WINNERS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return response.json();
}

export async function updateWinner(id: number, winner: Omit<Winner, 'id'>): Promise<Winner> {
  const response = await fetch(`${WINNERS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return response.json();
}

export async function deleteWinner(id: number): Promise<void> {
  await fetch(`${WINNERS_ENDPOINT}/${id}`, { method: 'DELETE' });
}

export async function saveWinner(id: number, finishTimeSeconds: number): Promise<void> {
  const existing = await fetchWinnerById(id);
  if (existing) {
    const bestTime = Math.min(existing.time, finishTimeSeconds);
    await updateWinner(id, { wins: existing.wins + 1, time: bestTime });
  } else {
    await createWinner({ id, wins: 1, time: finishTimeSeconds });
  }
}
