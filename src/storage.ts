const KEY = 'snake-high-score';

export function getHighScore(): number {
  return parseInt(localStorage.getItem(KEY) ?? '0', 10);
}

export function setHighScore(score: number): void {
  localStorage.setItem(KEY, String(score));
}
