import type { Vec2, GameState } from './types';
import { COLS, ROWS, CELL } from './types';

const W = COLS * CELL;
const H = ROWS * CELL;

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawGame(snake: Vec2[], food: Vec2, obstacles: Vec2[], score: number, level: number, highScore: number): void {
    const ctx = this.ctx;

    // Background
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // Obstacles
    ctx.shadowColor = '#FF8800';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#CC5500';
    for (const o of obstacles) {
      ctx.fillRect(o.x * CELL + 1, o.y * CELL + 1, CELL - 2, CELL - 2);
    }

    // Food
    ctx.shadowColor = '#FF00FF';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    // Snake body
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#009999';
    for (let i = 1; i < snake.length; i++) {
      const s = snake[i];
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    }

    // Snake head
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00FFFF';
    const h = snake[0];
    ctx.fillRect(h.x * CELL + 1, h.y * CELL + 1, CELL - 2, CELL - 2);

    // Border
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Score / level
    ctx.shadowBlur = 0;
    this.drawScore(score, level, highScore);
  }

  private drawScore(score: number, level: number, highScore: number): void {
    const ctx = this.ctx;
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 8, 18);
    ctx.textAlign = 'center';
    ctx.fillText(`LVL ${level}`, W / 2, 18);
    ctx.textAlign = 'right';
    ctx.fillText(`BEST: ${highScore}`, W - 8, 18);
    ctx.shadowBlur = 0;
  }

  drawStart(): void {
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    this.glowText('SNAKE', W / 2, H / 2 - 40, '64px monospace', '#00FFFF', 20);
    this.glowText('Press Enter or Space to play', W / 2, H / 2 + 20, '16px monospace', '#FF00FF', 10);
    this.glowText('WASD or Arrow Keys to move', W / 2, H / 2 + 50, '13px monospace', '#888', 0);
  }

  drawPaused(snake: Vec2[], food: Vec2, obstacles: Vec2[], score: number, level: number, highScore: number): void {
    this.drawGame(snake, food, obstacles, score, level, highScore);
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, H);
    this.glowText('PAUSED', W / 2, H / 2, '48px monospace', '#00FFFF', 15);
    this.glowText('Press P to resume', W / 2, H / 2 + 46, '16px monospace', '#FF00FF', 8);
  }

  drawLevelUp(level: number, score: number, highScore: number): void {
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    this.glowText(`LEVEL ${level}`, W / 2, H / 2 - 40, '56px monospace', '#FF8800', 20);
    this.glowText(`+${(level - 1) * 3} obstacles`, W / 2, H / 2 + 16, '18px monospace', '#CC5500', 10);
    this.glowText('Press Enter or Space to continue', W / 2, H / 2 + 60, '14px monospace', '#888', 0);
    this.drawScore(score, level, highScore);
  }

  drawGameOver(score: number, level: number, highScore: number): void {
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    this.glowText('GAME OVER', W / 2, H / 2 - 60, '48px monospace', '#FF00FF', 20);
    this.glowText(`SCORE: ${score}`, W / 2, H / 2, '28px monospace', '#FFF', 10);
    this.glowText(`BEST: ${highScore}`, W / 2, H / 2 + 40, '20px monospace', '#00FFFF', 8);
    this.glowText(`Reached level ${level}`, W / 2, H / 2 + 74, '15px monospace', '#FF8800', 6);
    this.glowText('Press Enter or Space to restart', W / 2, H / 2 + 110, '14px monospace', '#888', 0);
  }

  private glowText(
    text: string,
    x: number,
    y: number,
    font: string,
    color: string,
    blur: number
  ): void {
    const ctx = this.ctx;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
  }

  dispatch(
    state: GameState,
    snake: Vec2[],
    food: Vec2,
    obstacles: Vec2[],
    score: number,
    level: number,
    highScore: number
  ): void {
    switch (state) {
      case 'START':     this.drawStart(); break;
      case 'PLAYING':   this.drawGame(snake, food, obstacles, score, level, highScore); break;
      case 'PAUSED':    this.drawPaused(snake, food, obstacles, score, level, highScore); break;
      case 'LEVEL_UP':  this.drawLevelUp(level, score, highScore); break;
      case 'GAME_OVER': this.drawGameOver(score, level, highScore); break;
    }
  }
}
