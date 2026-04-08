import type { Vec2, GameState, HighScoreEntry } from './types';
import { COLS, ROWS, CELL } from './types';

const W = COLS * CELL;
const H = ROWS * CELL;

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawGame(snake: Vec2[], food: Vec2, obstacles: Vec2[], score: number, level: number): void {
    const ctx = this.ctx;

    // Background
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // Obstacles
    ctx.shadowBlur = 0;
    for (const o of obstacles) {
      const x = o.x * CELL + 1;
      const y = o.y * CELL + 1;
      const s = CELL - 2;
      ctx.fillStyle = '#000';
      ctx.fillRect(x, y, s, s);
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, s, s);
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 3, y + 3);
      ctx.lineTo(x + s - 3, y + s - 3);
      ctx.moveTo(x + s - 3, y + 3);
      ctx.lineTo(x + 3, y + s - 3);
      ctx.stroke();
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
    this.drawScore(score, level);
  }

  private drawScore(score: number, level: number): void {
    const ctx = this.ctx;
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 8, 18);
    ctx.textAlign = 'center';
    ctx.fillText(`LVL ${level}`, W / 2, 18);
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
    this.glowText('H — High Scores', W / 2, H / 2 + 76, '13px monospace', '#555', 0);
  }

  drawPaused(snake: Vec2[], food: Vec2, obstacles: Vec2[], score: number, level: number): void {
    this.drawGame(snake, food, obstacles, score, level);
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, H);
    this.glowText('PAUSED', W / 2, H / 2, '48px monospace', '#00FFFF', 15);
    this.glowText('Press P to resume', W / 2, H / 2 + 46, '16px monospace', '#FF00FF', 8);
  }

  drawLevelUp(level: number, score: number): void {
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    this.glowText(`LEVEL ${level}`, W / 2, H / 2 - 40, '56px monospace', '#FF8800', 20);
    this.glowText(`+${(level - 1) * 3} obstacles`, W / 2, H / 2 + 16, '18px monospace', '#FF0000', 8);
    this.glowText('Press Enter or Space to continue', W / 2, H / 2 + 60, '14px monospace', '#888', 0);
    this.drawScore(score, level);
  }

  drawEnterInitials(initials: string, score: number, level: number): void {
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    this.glowText('GAME OVER', W / 2, H / 2 - 200, '48px monospace', '#FF00FF', 20);
    this.glowText(`SCORE: ${score}   LVL: ${level}`, W / 2, H / 2 - 148, '18px monospace', '#FFF', 6);
    this.glowText('NEW HIGH SCORE!', W / 2, H / 2 - 100, '22px monospace', '#FFD700', 12);
    this.glowText('ENTER YOUR INITIALS:', W / 2, H / 2 - 50, '16px monospace', '#888', 0);

    // 4 character slots
    const slotW = 48;
    const slotGap = 12;
    const totalW = 4 * slotW + 3 * slotGap;
    const startX = W / 2 - totalW / 2;
    const slotY = H / 2 - 10;
    const cursorOn = Math.floor(Date.now() / 500) % 2 === 0;

    for (let i = 0; i < 4; i++) {
      const x = startX + i * (slotW + slotGap);
      const isCurrent = i === initials.length && initials.length < 4;
      const char = initials[i] ?? '';

      // Slot border
      ctx.shadowBlur = isCurrent ? 10 : 0;
      ctx.shadowColor = '#00FFFF';
      ctx.strokeStyle = isCurrent ? '#00FFFF' : '#444';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, slotY, slotW, 52);

      // Character
      if (char) {
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#00FFFF';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, x + slotW / 2, slotY + 26);
        ctx.shadowBlur = 0;
      } else if (isCurrent && cursorOn) {
        // Blinking cursor bar
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(x + slotW / 2 - 2, slotY + 10, 4, 32);
      }
    }

    ctx.textBaseline = 'alphabetic';
    ctx.shadowBlur = 0;
    this.glowText('Type A–Z  |  Backspace  |  Enter to confirm', W / 2, H / 2 + 80, '13px monospace', '#555', 0);
  }

  drawHighScores(
    scores: HighScoreEntry[],
    newEntryIndex: number,
    fromStart: boolean,
    lastScore: number,
    lastLevel: number,
  ): void {
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    let titleY = H / 2 - 220;

    if (!fromStart) {
      this.glowText('GAME OVER', W / 2, titleY, '40px monospace', '#FF00FF', 16);
      titleY += 46;
      this.glowText(`SCORE: ${lastScore}   LVL: ${lastLevel}`, W / 2, titleY, '16px monospace', '#FFF', 5);
      titleY += 36;
    }

    this.glowText('HIGH SCORES', W / 2, titleY, '32px monospace', '#00FFFF', 14);
    titleY += 40;

    // Column header
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#555';
    ctx.shadowBlur = 0;
    const col = {
      rank: W / 2 - 220,
      init: W / 2 - 178,
      score: W / 2 - 90,
      lvl: W / 2 + 20,
      date: W / 2 + 70,
    };
    ctx.fillText('#', col.rank, titleY);
    ctx.fillText('INIT', col.init, titleY);
    ctx.fillText('SCORE', col.score, titleY);
    ctx.fillText('LVL', col.lvl, titleY);
    ctx.fillText('DATE', col.date, titleY);
    titleY += 6;

    // Divider
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 224, titleY);
    ctx.lineTo(W / 2 + 224, titleY);
    ctx.stroke();
    titleY += 16;

    const rowH = 28;
    for (let i = 0; i < 10; i++) {
      const entry = scores[i];
      const y = titleY + i * rowH;
      const isNew = i === newEntryIndex;

      if (isNew) {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFD700';
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = entry ? '#CCC' : '#333';
      }

      ctx.font = `${isNew ? 'bold ' : ''}13px monospace`;
      ctx.textAlign = 'left';

      ctx.fillText(`${i + 1}`, col.rank, y);
      ctx.fillText(entry ? entry.initials.trimEnd() || '----' : '----', col.init, y);
      ctx.fillText(entry ? String(entry.score) : '---', col.score, y);
      ctx.fillText(entry ? String(entry.level) : '-', col.lvl, y);
      ctx.fillText(entry ? entry.date : '---', col.date, y);
    }

    ctx.shadowBlur = 0;
    const footer = fromStart ? 'Enter — Back' : 'Enter — Play Again';
    this.glowText(footer, W / 2, H - 30, '14px monospace', '#555', 0);
  }

  private glowText(
    text: string,
    x: number,
    y: number,
    font: string,
    color: string,
    blur: number,
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
    scores: HighScoreEntry[],
    newEntryIndex: number,
    fromStart: boolean,
    initials: string,
  ): void {
    switch (state) {
      case 'START':          this.drawStart(); break;
      case 'PLAYING':        this.drawGame(snake, food, obstacles, score, level); break;
      case 'PAUSED':         this.drawPaused(snake, food, obstacles, score, level); break;
      case 'LEVEL_UP':       this.drawLevelUp(level, score); break;
      case 'ENTER_INITIALS': this.drawEnterInitials(initials, score, level); break;
      case 'HIGH_SCORES':    this.drawHighScores(scores, newEntryIndex, fromStart, score, level); break;
    }
  }
}
