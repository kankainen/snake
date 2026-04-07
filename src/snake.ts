import type { Vec2, Direction } from './types';
import { COLS, ROWS } from './types';

export class Snake {
  segments: Vec2[];
  direction: Direction;
  private growing = 0;

  constructor() {
    // Start in the middle, facing right, length 3
    const cx = Math.floor(COLS / 2);
    const cy = Math.floor(ROWS / 2);
    this.segments = [
      { x: cx,     y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    this.direction = 'RIGHT';
  }

  move(): void {
    const head = this.segments[0];
    const next = step(head, this.direction);
    this.segments.unshift(next);
    if (this.growing > 0) {
      this.growing--;
    } else {
      this.segments.pop();
    }
  }

  grow(): void {
    this.growing++;
  }

  hitsWall(): boolean {
    const { x, y } = this.segments[0];
    return x < 0 || x >= COLS || y < 0 || y >= ROWS;
  }

  hitsItself(): boolean {
    const [head, ...body] = this.segments;
    return body.some(s => s.x === head.x && s.y === head.y);
  }
}

function step(pos: Vec2, dir: Direction): Vec2 {
  switch (dir) {
    case 'UP':    return { x: pos.x,     y: pos.y - 1 };
    case 'DOWN':  return { x: pos.x,     y: pos.y + 1 };
    case 'LEFT':  return { x: pos.x - 1, y: pos.y };
    case 'RIGHT': return { x: pos.x + 1, y: pos.y };
  }
}
