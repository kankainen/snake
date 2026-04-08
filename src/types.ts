export type Vec2 = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'LEVEL_UP' | 'ENTER_INITIALS' | 'HIGH_SCORES';
export type HighScoreEntry = { score: number; level: number; date: string; initials: string };

export const COLS = 40;
export const ROWS = 40;
export const CELL = 20;
export const TICK_START = 150;
export const TICK_MIN = 50;
export const LEVEL_THRESHOLD = 50;
export const OBSTACLES_PER_LEVEL = 3;
