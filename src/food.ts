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
  const head = snake[0];
  const SAFE = 10;

  const candidates: Vec2[] = [];
  const fallback: Vec2[] = [];

  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (occupied.has(`${x},${y}`)) continue;
      const isSafe = Math.abs(x - head.x) + Math.abs(y - head.y) >= SAFE;
      if (isSafe) candidates.push({ x, y });
      else fallback.push({ x, y });
    }
  }

  const pool = candidates.length >= count ? candidates : fallback;

  // Fisher-Yates shuffle, take first `count`
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
