// Given the server's velocity (px/ms) and distance (px), returns how long
// the drive animation should take, in milliseconds.
export function calculateDriveDurationMs(distance: number, velocity: number): number {
  if (velocity <= 0) return 0;
  return distance / velocity;
}
