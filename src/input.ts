import type { Direction } from './types';

type KeyCallback = (key: string) => void;

export class InputHandler {
  private dirQueue: Direction[] = [];
  private onActionKey: KeyCallback;

  constructor(onActionKey: KeyCallback) {
    this.onActionKey = onActionKey;
    window.addEventListener('keydown', this.handleKey);
  }

  private handleKey = (e: KeyboardEvent): void => {
    const dir = keyToDir(e.key);
    if (dir) {
      e.preventDefault();
      this.queueDirection(dir);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      this.onActionKey(e.key);
    }
  };

  private queueDirection(dir: Direction): void {
    const last = this.dirQueue[this.dirQueue.length - 1];
    if (last === dir) return;
    if (this.dirQueue.length < 2) {
      this.dirQueue.push(dir);
    }
  }

  /** Pop the next queued direction, filtering out reversals against current. */
  consumeDirection(current: Direction): Direction | null {
    while (this.dirQueue.length > 0) {
      const next = this.dirQueue.shift()!;
      if (!isReversal(current, next)) return next;
    }
    return null;
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKey);
  }
}

function keyToDir(key: string): Direction | null {
  switch (key) {
    case 'ArrowUp':    case 'w': case 'W': return 'UP';
    case 'ArrowDown':  case 's': case 'S': return 'DOWN';
    case 'ArrowLeft':  case 'a': case 'A': return 'LEFT';
    case 'ArrowRight': case 'd': case 'D': return 'RIGHT';
    default: return null;
  }
}

function isReversal(current: Direction, next: Direction): boolean {
  return (
    (current === 'UP'    && next === 'DOWN')  ||
    (current === 'DOWN'  && next === 'UP')    ||
    (current === 'LEFT'  && next === 'RIGHT') ||
    (current === 'RIGHT' && next === 'LEFT')
  );
}
