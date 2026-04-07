import type { Vec2 } from './types';
import { COLS, ROWS } from './types';

export function spawnFood(snake: Vec2[]): Vec2 {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  const candidates: Vec2[] = [];
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (!occupied.has(`${x},${y}`)) candidates.push({ x, y });
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}
