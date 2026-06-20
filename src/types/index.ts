export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface CarFormData {
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerWithCar extends Winner {
  name: string;
  color: string;
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export type SortField = 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export type CarEngineStatus = 'idle' | 'started' | 'driving' | 'stopped' | 'finished' | 'broken';

export interface CarRaceState {
  status: CarEngineStatus;
  velocity: number;
  distance: number;
}
