import { Game } from './game';
import { COLS, ROWS, CELL } from './types';

const canvas = document.getElementById('game') as HTMLCanvasElement;
canvas.width  = COLS * CELL;
canvas.height = ROWS * CELL;

const ctx = canvas.getContext('2d')!;
const game = new Game(ctx);
game.start();
