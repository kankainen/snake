import type { Vec2 } from './types';
import { COLS, ROWS } from './types';

export function spawnFood(snake: Vec2[], obstacles: Vec2[] = []): Vec2 {
  const occupied = new Set(
    [...snake, ...obstacles].map(s => `${s.x},${s.y}`)
  );
  const candidates: Vec2[] = [];
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (!occupied.has(`${x},${y}`)) candidates.push({ x, y });
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function spawnObstacles(count: number, snake: Vec2[], food: Vec2, existing: Vec2[]): Vec2[] {
  const occupied = new Set(
    [...snake, food, ...existing].map(s => `${s.x},${s.y}`)
  );
  const candidates: Vec2[] = [];
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (!occupied.has(`${x},${y}`)) candidates.push({ x, y });
    }
  }
  // Fisher-Yates shuffle, take first `count`
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, count);
}
