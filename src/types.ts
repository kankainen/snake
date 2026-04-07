export type Vec2 = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export const COLS = 30;
export const ROWS = 30;
export const CELL = 20;
export const TICK_START = 150;
export const TICK_MIN = 50;
