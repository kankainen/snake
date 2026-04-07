import type { GameState, Vec2 } from './types';
import { TICK_START, TICK_MIN } from './types';
import { Snake } from './snake';
import { spawnFood } from './food';
import { InputHandler } from './input';
import { Renderer } from './renderer';
import { getHighScore, setHighScore } from './storage';

export class Game {
  private state: GameState = 'START';
  private snake!: Snake;
  private food!: Vec2;
  private score = 0;
  private highScore: number;
  private tickInterval = TICK_START;
  private accumulated = 0;
  private lastTime = 0;
  private rafId = 0;
  private input: InputHandler;
  private renderer: Renderer;

  constructor(ctx: CanvasRenderingContext2D) {
    this.renderer = new Renderer(ctx);
    this.highScore = getHighScore();
    this.input = new InputHandler(this.handleActionKey);
  }

  start(): void {
    this.renderer.drawStart();
    this.rafId = requestAnimationFrame(this.loop);
  }

  private handleActionKey = (key: string): void => {
    if (key === 'p' || key === 'P') {
      if (this.state === 'PLAYING') this.state = 'PAUSED';
      else if (this.state === 'PAUSED') this.state = 'PLAYING';
      return;
    }
    if (key === 'Enter' || key === ' ') {
      if (this.state === 'START' || this.state === 'GAME_OVER') {
        this.resetGame();
        this.state = 'PLAYING';
      }
    }
  };

  private resetGame(): void {
    this.snake = new Snake();
    this.food = spawnFood(this.snake.segments);
    this.score = 0;
    this.tickInterval = TICK_START;
    this.accumulated = 0;
  }

  private loop = (timestamp: number): void => {
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.state === 'PLAYING') {
      this.accumulated += delta;
      while (this.accumulated >= this.tickInterval) {
        this.accumulated -= this.tickInterval;
        this.tick();
      }
    }

    this.renderer.dispatch(
      this.state,
      this.snake?.segments ?? [],
      this.food ?? { x: 0, y: 0 },
      this.score,
      this.highScore
    );

    this.rafId = requestAnimationFrame(this.loop);
  };

  private tick(): void {
    const dir = this.input.consumeDirection(this.snake.direction);
    if (dir) this.snake.direction = dir;

    this.snake.move();

    if (this.snake.hitsWall() || this.snake.hitsItself()) {
      this.endGame();
      return;
    }

    const head = this.snake.segments[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.eatFood();
    }
  }

  private eatFood(): void {
    this.snake.grow();
    this.score += 10;
    this.tickInterval = Math.max(TICK_MIN, TICK_START - this.score * 1.5);
    this.food = spawnFood(this.snake.segments);
  }

  private endGame(): void {
    this.state = 'GAME_OVER';
    if (this.score > this.highScore) {
      this.highScore = this.score;
      setHighScore(this.highScore);
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    this.input.destroy();
  }
}
