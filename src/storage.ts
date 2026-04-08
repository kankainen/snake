import type { HighScoreEntry } from './types';

const KEY = 'snake-high-scores';

export function getHighScores(): HighScoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function qualifiesForBoard(score: number): boolean {
  if (score <= 0) return false;
  const scores = getHighScores();
  return scores.length < 10 || score > scores[scores.length - 1].score;
}

export function addHighScore(entry: HighScoreEntry): number {
  const scores = getHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, 10);
  const index = trimmed.indexOf(entry);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
  return index;
}
