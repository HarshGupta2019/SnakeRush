import { ArrowItem, PuzzleLevel } from '../types';
import { isArrowFreeable, getRemovableArrows } from './levelGenerator';

export interface AccuracyResult {
  accuracy: number; // 1 to 100%
  minArrows: number; // Minimum number of arrows required to win
  actualArrows: number; // Actual number of arrows removed
  arrowEfficiency: number; // 0 to 100%
  timeTakenSeconds: number; // Time taken in seconds
  speedScore: number; // 0 to 100%
  livesRemaining: number; // 1, 2, or 3
  livesTaken: number; // 0, 1, or 2
  livesScore: number; // 0 to 100%
  ratingTitle: string;
  ratingColor: string;
}

/**
 * Calculates the theoretical minimum number of arrows that must be removed to win the level.
 * - In Shape mode: every arrow on the board must be removed (min = level.arrows.length).
 * - In Emergency mode: only the blocking arrows plus the emergency arrow itself must be removed.
 */
const minArrowsCache = new Map<string, number>();

export function calculateMinArrowsToWin(level: PuzzleLevel): number {
  if (level.mode !== 'emergency') {
    return Math.max(1, level.arrows.length);
  }

  const cacheKey = `${level.mode}_${level.id}_${level.arrows.length}`;
  const cachedVal = minArrowsCache.get(cacheKey);
  if (cachedVal !== undefined) {
    return cachedVal;
  }

  const emergencyArrows = level.arrows.filter(a => a.isEmergency);
  if (emergencyArrows.length === 0) {
    return Math.max(1, level.arrows.length);
  }

  // If already freeable at step 0 for single animal
  if (
    emergencyArrows.length === 1 &&
    isArrowFreeable(emergencyArrows[0], level.arrows, level.gridWidth, level.gridHeight)
  ) {
    minArrowsCache.set(cacheKey, 1);
    return 1;
  }

  // BFS search to find shortest path of removals to free all emergency arrows
  const queue: { remaining: ArrowItem[]; depth: number }[] = [
    { remaining: level.arrows, depth: 0 },
  ];
  const visited = new Set<string>();
  const getHash = (items: ArrowItem[]) => items.map(a => a.id).sort().join(',');
  visited.add(getHash(level.arrows));

  let iterations = 0;
  const maxIterations = 350; // Guard against main thread freezing

  let result: number | null = null;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const current = queue.shift()!;

    // Check if all emergency arrows are freed in this state
    const remainingEmerg = current.remaining.filter(a => a.isEmergency);
    if (remainingEmerg.length === 0) {
      result = current.depth;
      break;
    }

    const freeable = getRemovableArrows(current.remaining, level.gridWidth, level.gridHeight);
    for (const f of freeable) {
      const nextRemaining = current.remaining.filter(a => a.id !== f.id);
      const hashKey = getHash(nextRemaining);
      if (!visited.has(hashKey)) {
        visited.add(hashKey);
        queue.push({ remaining: nextRemaining, depth: current.depth + 1 });
      }
    }
  }

  if (result === null) {
    // Fallback to precalculated rescue depth if BFS reached iteration limit
    if (level.rescueStep && level.rescueStep > 0) {
      result = Math.min(level.arrows.length, level.rescueStep + emergencyArrows.length);
    } else {
      result = Math.max(1, Math.min(level.arrows.length, 5));
    }
  }

  if (minArrowsCache.size >= 128) {
    const oldest = minArrowsCache.keys().next().value;
    if (oldest) minArrowsCache.delete(oldest);
  }
  minArrowsCache.set(cacheKey, result);

  return result;
}

/**
 * Calculates percentage accuracy based on:
 * 1. Minimum number of arrows removed vs actual removals
 * 2. How fast the player solved the problem (time taken)
 * 3. How many lives the player took from three lives (hearts remaining)
 */
export function calculateVictoryAccuracy(
  level: PuzzleLevel,
  actualArrowsRemoved: number,
  timeTakenSeconds: number,
  heartsRemaining: number
): AccuracyResult {
  const minArrows = calculateMinArrowsToWin(level);
  const actualArrows = Math.max(minArrows, actualArrowsRemoved);

  // 1. Arrow Removal Precision (Weight: 40%)
  // Ratio of optimal minimum removals to actual removals
  const arrowEfficiencyRatio = Math.min(1, minArrows / actualArrows);
  const arrowEfficiency = Math.round(arrowEfficiencyRatio * 100);

  // 2. Lives Factor (Weight: 40%)
  // How many lives he took from 3 lives:
  // 0 lives taken (3 remaining) -> 100%
  // 1 life taken (2 remaining)  -> 66.7%
  // 2 lives taken (1 remaining)  -> 33.3%
  const clampedHearts = Math.min(3, Math.max(1, heartsRemaining));
  const livesTaken = 3 - clampedHearts;
  const livesRatio = clampedHearts / 3;
  const livesScore = Math.round(livesRatio * 100);

  // 3. Solving Speed Factor (Weight: 20%)
  // Benchmark target time based on minimum moves required
  const targetTimeSeconds =
    level.mode === 'emergency'
      ? Math.max(4, Math.min(level.timeLimit * 0.35, minArrows * 2.2))
      : Math.max(5, minArrows * 2.0);

  let speedScore = 100;
  if (timeTakenSeconds > targetTimeSeconds) {
    // Graceful reduction as time extends, maintaining a 45% floor
    const overTime = timeTakenSeconds - targetTimeSeconds;
    const penalty = Math.min(55, (overTime / (targetTimeSeconds * 2.2)) * 45);
    speedScore = Math.max(45, Math.round(100 - penalty));
  }

  // Combined weighted accuracy: 40% Arrow precision, 40% Lives kept, 20% Speed
  const weightedAccuracy =
    arrowEfficiencyRatio * 40 +
    livesRatio * 40 +
    (speedScore / 100) * 20;

  const finalAccuracy = Math.min(100, Math.max(1, Math.round(weightedAccuracy)));

  let ratingTitle = 'CLEARED';
  let ratingColor = 'text-amber-400';

  if (finalAccuracy >= 96) {
    ratingTitle = 'PERFECT ACCURACY';
    ratingColor = 'text-emerald-400';
  } else if (finalAccuracy >= 88) {
    ratingTitle = 'MASTERFUL';
    ratingColor = 'text-cyan-400';
  } else if (finalAccuracy >= 78) {
    ratingTitle = 'EXCELLENT';
    ratingColor = 'text-sky-400';
  } else if (finalAccuracy >= 65) {
    ratingTitle = 'SHARP';
    ratingColor = 'text-amber-300';
  }

  return {
    accuracy: finalAccuracy,
    minArrows,
    actualArrows,
    arrowEfficiency,
    timeTakenSeconds: Math.round(timeTakenSeconds * 10) / 10,
    speedScore,
    livesRemaining: clampedHearts,
    livesTaken,
    livesScore,
    ratingTitle,
    ratingColor,
  };
}
