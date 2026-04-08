import type { GameState, Vec2, HighScoreEntry } from './types';
import { TICK_START, TICK_MIN, LEVEL_THRESHOLD, OBSTACLES_PER_LEVEL } from './types';
import { Snake } from './snake';
import { spawnFood, spawnObstacles } from './food';
import { InputHandler } from './input';
import { Renderer } from './renderer';
import { getHighScores, qualifiesForBoard, addHighScore } from './storage';

export class Game {
  private state: GameState = 'START';
  private snake!: Snake;
  private food!: Vec2;
  private obstacles: Vec2[] = [];
  private score = 0;
  private level = 1;
  private tickInterval = TICK_START;
  private accumulated = 0;
  private lastTime = 0;
  private rafId = 0;
  private input: InputHandler;
  private renderer: Renderer;

  private initials = '';
  private scores: HighScoreEntry[] = [];
  private newEntryIndex = -1;
  private fromStart = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.renderer = new Renderer(ctx);
    this.scores = getHighScores();
    this.input = new InputHandler(this.handleActionKey);
    window.addEventListener('keydown', this.handleTextKey);
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
    if (key === 'h' || key === 'H') {
      if (this.state === 'START') {
        this.fromStart = true;
        this.scores = getHighScores();
        this.state = 'HIGH_SCORES';
      }
      return;
    }
    if (key === 'Enter' || key === ' ') {
      if (this.state === 'START') {
        this.resetGame();
        this.state = 'PLAYING';
      } else if (this.state === 'HIGH_SCORES') {
        if (this.fromStart) {
          this.state = 'START';
        } else {
          this.resetGame();
          this.state = 'PLAYING';
        }
      } else if (this.state === 'LEVEL_UP') {
        this.state = 'PLAYING';
      }
    }
  };

  private handleTextKey = (e: KeyboardEvent): void => {
    if (this.state !== 'ENTER_INITIALS') return;
    if (/^[A-Za-z]$/.test(e.key) && this.initials.length < 4) {
      e.preventDefault();
      this.initials += e.key.toUpperCase();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      this.initials = this.initials.slice(0, -1);
    } else if (e.key === 'Enter' && this.initials.length >= 1) {
      e.preventDefault();
      this.confirmInitials();
    }
  };

  private confirmInitials(): void {
    const entry: HighScoreEntry = {
      score: this.score,
      level: this.level,
      date: new Date().toLocaleDateString(),
      initials: this.initials.padEnd(4, ' '),
    };
    this.newEntryIndex = addHighScore(entry);
    this.scores = getHighScores();
    this.fromStart = false;
    this.state = 'HIGH_SCORES';
  }

  private resetGame(): void {
    this.snake = new Snake();
    this.obstacles = [];
    this.food = spawnFood(this.snake.segments, this.obstacles);
    this.score = 0;
    this.level = 1;
    this.tickInterval = TICK_START;
    this.accumulated = 0;
    this.newEntryIndex = -1;
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
      this.obstacles,
      this.score,
      this.level,
      this.scores,
      this.newEntryIndex,
      this.fromStart,
      this.initials,
    );

    this.rafId = requestAnimationFrame(this.loop);
  };

  private tick(): void {
    const dir = this.input.consumeDirection(this.snake.direction);
    if (dir) this.snake.direction = dir;

    this.snake.move();

    if (this.snake.hitsWall() || this.snake.hitsItself() || this.hitsObstacle()) {
      this.endGame();
      return;
    }

    const head = this.snake.segments[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.eatFood();
    }
  }

  private hitsObstacle(): boolean {
    const head = this.snake.segments[0];
    return this.obstacles.some(o => o.x === head.x && o.y === head.y);
  }

  private eatFood(): void {
    this.snake.grow();
    this.score += 10;
    this.tickInterval = Math.max(TICK_MIN, TICK_START - this.score * 1.5);

    const newLevel = Math.floor(this.score / LEVEL_THRESHOLD) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.obstacles = [
        ...this.obstacles,
        ...spawnObstacles(OBSTACLES_PER_LEVEL, this.snake.segments, this.food, this.obstacles),
      ];
      this.food = spawnFood(this.snake.segments, this.obstacles);
      this.state = 'LEVEL_UP';
    } else {
      this.food = spawnFood(this.snake.segments, this.obstacles);
    }
  }

  private endGame(): void {
    if (qualifiesForBoard(this.score)) {
      this.initials = '';
      this.state = 'ENTER_INITIALS';
    } else {
      this.newEntryIndex = -1;
      this.fromStart = false;
      this.scores = getHighScores();
      this.state = 'HIGH_SCORES';
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    this.input.destroy();
    window.removeEventListener('keydown', this.handleTextKey);
  }
}
