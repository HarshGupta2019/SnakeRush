import React, { startTransition, useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowItem, GameMode, PuzzleLevel } from '../../types';
import { getLevel } from '../../utils/levelGenerator';
import { calculateVictoryAccuracy, AccuracyResult } from '../../utils/accuracy';
import { GameBoard } from '../game/GameBoard';
import { GameHud } from '../game/GameHud';
import { LevelCompleteModal } from '../game/LevelCompleteModal';
import { GameOverModal } from '../game/GameOverModal';
import { PauseModal } from '../game/PauseModal';
import { BannerAd } from '../common/BannerAd';

import { soundManager } from '../../utils/audio';

interface GameScreenProps {
}

export const GameScreen: React.FC<GameScreenProps> = () => {
  console.log('[GameScreen] Rendered');

  useEffect(() => {
    console.log('[GameScreen] Mounted');
    return () => console.log('[GameScreen] Unmounted');
  }, []);

  const {
    selectedMode,
    currentLevelId,
    isDailyChallenge,
    progress,
    setScreen,
    startLevel,
    onLevelCompleted,
    equipBoard,
    equipArrow,
  } = useGame();

  // Load level configuration
  const [level, setLevel] = useState<PuzzleLevel>(() =>
    getLevel(selectedMode, currentLevelId)
  );

  const [remainingArrows, setRemainingArrows] = useState<ArrowItem[]>(() => level.arrows);
  const [totalArrowsCount, setTotalArrowsCount] = useState<number>(level.arrows.length);

  // 3 Lives System for both Shape & Emergency Modes
  const [timeLeft, setTimeLeft] = useState<number>(level.timeLimit);
  const [hearts, setHearts] = useState<number>(3);

  // General puzzle state
  const [mistakes, setMistakes] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [highlightedArrowId, setHighlightedArrowId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<'time_out' | 'out_of_hearts'>('out_of_hearts');
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [earnedAccuracy, setEarnedAccuracy] = useState<number>(100);
  const [accuracyBreakdown, setAccuracyBreakdown] = useState<AccuracyResult | null>(null);
  const [arrowsRemovedCount, setArrowsRemovedCount] = useState<number>(0);
  const [boardSession, setBoardSession] = useState<number>(0);

  // Timers to track exact active time spent
  const levelStartTimeRef = useRef<number>(Date.now());
  const pausedDurationRef = useRef<number>(0);
  const pauseStartRef = useRef<number>(0);
  const remainingArrowsRef = useRef<ArrowItem[]>(level.arrows);
  const arrowsRemovedCountRef = useRef(0);
  const comboCountRef = useRef(0);
  const mistakesRef = useRef(0);
  const heartsRef = useRef(3);
  const highlightedArrowIdRef = useRef<string | null>(null);

  // Reset level state
  const resetLevel = (lvlId: number = currentLevelId, mode: GameMode = selectedMode) => {
    console.log(`[GameScreen] resetLevel called with lvlId: ${lvlId}, mode: ${mode}`);
    try {
      const lvl = getLevel(mode, lvlId);
      console.log(`[GameScreen] getLevel succeeded for lvlId: ${lvlId}`);
      setLevel(lvl);
      setRemainingArrows(lvl.arrows);
      remainingArrowsRef.current = lvl.arrows;
      setTotalArrowsCount(lvl.arrows.length);
      setTimeLeft(lvl.timeLimit);
      setHearts(3);
      heartsRef.current = 3;
      setMistakes(0);
      mistakesRef.current = 0;
      setComboCount(0);
      comboCountRef.current = 0;
      setHighlightedArrowId(null);
      highlightedArrowIdRef.current = null;
      setIsPaused(false);
      setIsWon(false);
      setIsGameOver(false);
      setEarnedAccuracy(100);
      setAccuracyBreakdown(null);
      setArrowsRemovedCount(0);
      levelStartTimeRef.current = Date.now();
      pausedDurationRef.current = 0;
      pauseStartRef.current = 0;
      setBoardSession(s => s + 1);
    } catch (error) {
      console.error(`[GameScreen] Error in resetLevel:`, error);
      // Let ErrorBoundary catch it if we rethrow, or just throw it to be caught
      throw error;
    }
  };

  // Reset when level or mode changes
  useEffect(() => {
    resetLevel(currentLevelId, selectedMode);
  }, [selectedMode, currentLevelId]);

  // Emergency Mode countdown timer
  useEffect(() => {
    if (selectedMode !== 'emergency' || isPaused || isWon || isGameOver) return;

    const timer = setInterval(() => {
      startTransition(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }

          // Warning sound on low time
          if (prev <= 10) {
            soundManager.playEmergencyAlert();
          } else if (prev <= 15) {
            soundManager.playCountdownTick(true);
          }

          return prev - 1;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedMode, isPaused, isWon, isGameOver]);

  // Handle time out game over cleanly
  useEffect(() => {
    if (selectedMode === 'emergency' && timeLeft === 0 && !isWon && !isGameOver) {
      soundManager.playGameOver();
      setGameOverReason('time_out');
      setIsGameOver(true);
    }
  }, [timeLeft, selectedMode, isWon, isGameOver]);

  // Pre-warm the next level's cache while the player is solving the current one.
  // Only runs via requestIdleCallback (browser idle time) — never blocks the game loop.
  // If requestIdleCallback is unavailable, we skip the pre-warm rather than risk a
  // synchronous freeze mid-gameplay. The Uint8Array optimization makes first-access
  // generation fast enough for the transition to remain smooth.
  useEffect(() => {
    if (typeof requestIdleCallback === 'undefined') return;
    const timerId = setTimeout(() => {
      const idleId = requestIdleCallback(
        () => getLevel(selectedMode, currentLevelId + 1),
        { timeout: 8000 }
      );
      return () => cancelIdleCallback(idleId);
    }, 2000); // 2s delay — well after current level has painted
    return () => clearTimeout(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelId, selectedMode]);

  // Arrow click callback
  const handleArrowRemoved = (arrow: ArrowItem, isEmergency: boolean) => {
    const currentArrows = remainingArrowsRef.current;
    if (!currentArrows.some(existingArrow => existingArrow.id === arrow.id)) return;

    const nextRemovedCount = arrowsRemovedCountRef.current + 1;
    arrowsRemovedCountRef.current = nextRemovedCount;
    setArrowsRemovedCount(nextRemovedCount);

    const updated = currentArrows.filter(a => a.id !== arrow.id);
    remainingArrowsRef.current = updated;
    setRemainingArrows(updated);
    const previousCombo = comboCountRef.current;
    comboCountRef.current = previousCombo + 1;
    setComboCount(comboCountRef.current);
    soundManager.playArrowExit(previousCombo, isEmergency);

    if (highlightedArrowIdRef.current === arrow.id) {
      setHighlightedArrowId(null);
      highlightedArrowIdRef.current = null;
    }

    // Win condition check:
    // In Emergency Mode: won when all emergency animals have escaped (or board is cleared)
    // In Shape Mode: won when all arrows are cleared
    const remainingEmergencyCount = updated.filter(a => a.isEmergency).length;
    const won =
      selectedMode === 'emergency'
        ? remainingEmergencyCount === 0 || updated.length === 0
        : updated.length === 0;

    if (won) {
      handleVictory(nextRemovedCount);
    }
  };

  // 3 Lives Deduction on blocked arrow click
  const handleWrongMove = (_arrow: ArrowItem) => {
    mistakesRef.current += 1;
    setMistakes(mistakesRef.current);

    const nextHearts = heartsRef.current - 1;
    heartsRef.current = nextHearts;
    setHearts(nextHearts);
    if (nextHearts <= 0) {
      soundManager.playGameOver();
      setGameOverReason('out_of_hearts');
      setIsGameOver(true);
    }
  };

  const handleVictory = (totalArrowsRemoved: number) => {
    setIsWon(true);

    const totalElapsedMs = Date.now() - levelStartTimeRef.current - pausedDurationRef.current;
    const elapsedSeconds = Math.max(0.5, totalElapsedMs / 1000);
    const timeTakenSeconds =
      selectedMode === 'emergency'
        ? Math.max(1, level.timeLimit - timeLeft)
        : Math.max(1, Math.round(elapsedSeconds));

    // Calculate percentage accuracy based on:
    // 1. Minimum number of arrows removed
    // 2. How fast he solved the problem
    // 3. How many lives he took from three lives
    const accResult = calculateVictoryAccuracy(
      level,
      totalArrowsRemoved,
      timeTakenSeconds,
      heartsRef.current
    );

    setEarnedAccuracy(accResult.accuracy);
    setAccuracyBreakdown(accResult);

    // Calculate coins based on performance & accuracy:
    let baseCoins = selectedMode === 'emergency' ? 35 : 30;
    if (isDailyChallenge) baseCoins = 100;
    const accuracyBonus = Math.round(accResult.accuracy * 0.35);
    const emergencyTimeBonus = selectedMode === 'emergency' ? Math.floor(timeLeft * 1.5) : 0;
    const totalCoins = baseCoins + accuracyBonus + emergencyTimeBonus;

    setEarnedCoins(totalCoins);

    // Derive star rating for internal progress tracking
    const stars = accResult.accuracy >= 90 ? 3 : accResult.accuracy >= 70 ? 2 : 1;
    setEarnedStars(stars);

    onLevelCompleted(stars, totalCoins, timeLeft, mistakesRef.current, selectedMode === 'emergency');
  };

  // Revive from Game Over (Restore 1 life if out of lives, or extra time)
  const handleRevive = () => {
    soundManager.playVictoryFanfare();
    setIsGameOver(false);
    if (gameOverReason === 'time_out') {
      setTimeLeft(20);
    } else {
      setHearts(1); // Provide only 1 life as requested
    }
  };

  const handleNextLevel = () => {
    console.log('[GameScreen] handleNextLevel called. Current ID:', currentLevelId);
    soundManager.playTap();
    if (isDailyChallenge) {
      setScreen('daily');
      return;
    }

    const nextId = currentLevelId + 1;
    console.log('[GameScreen] Transitioning to nextId:', nextId);
    startTransition(() => {
      startLevel(selectedMode, nextId, isDailyChallenge);
    });
  };

  const handleRestart = () => {
    soundManager.playTap();
    // Call resetLevel directly — startLevel() only sets context state which is a
    // no-op when currentLevelId hasn't changed, so the useEffect never re-fires.
    startTransition(() => {
      resetLevel(currentLevelId, selectedMode);
    });
  };

  const handleBack = () => {
    soundManager.playTap();
    if (isDailyChallenge) {
      setScreen('home');
    } else {
      setScreen('level_select');
    }
  };

  const handleHome = () => {
    soundManager.playTap();
    setScreen('home');
  };

  const handleToggleTheme = () => {
    if (progress.selectedBoard === 'eye_comfort') {
      equipBoard('classic');
      equipArrow('classic');
    } else {
      equipBoard('eye_comfort');
      equipArrow('eye_comfort_arrow');
    }
  };

  const handlePauseOpen = () => {
    pauseStartRef.current = Date.now();
    setIsPaused(true);
  };

  const handlePauseResume = () => {
    if (pauseStartRef.current > 0) {
      pausedDurationRef.current += Date.now() - pauseStartRef.current;
      pauseStartRef.current = 0;
    }
    setIsPaused(false);
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between overflow-hidden pb-3 select-none">
      {/* Top Clean HUD with 3 Lives, Level info, controls (no hint/auto) */}
      <GameHud
        level={level}
        mode={selectedMode}
        timeLeft={timeLeft}
        maxTime={level.timeLimit}
        hearts={hearts}
        maxHearts={3}
        remainingCount={remainingArrows.length}
        totalArrows={totalArrowsCount}
        onBack={handleBack}
        onPause={handlePauseOpen}
        onRestart={handleRestart}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Interactive Board with Real Image Maze */}
      <div className="flex-1 flex items-center justify-center p-2 -translate-y-3">
        <GameBoard
          levelId={level.id}
          boardSession={boardSession}
          arrows={remainingArrows}
          gridWidth={level.gridWidth}
          gridHeight={level.gridHeight}
          isEmergencyMode={selectedMode === 'emergency'}
          isUrgentMode={selectedMode === 'emergency' && timeLeft <= 10}
          highlightedArrowId={highlightedArrowId}
          rescueAnimal={level.rescueAnimal}
          rescueAnimals={level.rescueAnimals}
          onArrowRemoved={handleArrowRemoved}
          onWrongMove={handleWrongMove}
        />
      </div>

      {/* Banner Ad Area - Placed below the board, takes up space so the board shrinks to avoid overlap */}
      <div className="w-full flex justify-center pb-1 px-2 shrink-0">
        <BannerAd slotId="banner-ad-game" disableDuringGame={false} />
      </div>

      {/* Modals */}
      {isPaused && (
        <PauseModal
          levelName={level.name}
          onResume={handlePauseResume}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}

      {isWon && (
        <LevelCompleteModal
          levelName={level.name}
          isEmergency={selectedMode === 'emergency'}
          rescueAnimal={level.rescueAnimal}
          rescueAnimals={level.rescueAnimals}
          accuracy={earnedAccuracy}
          accuracyResult={accuracyBreakdown || undefined}
          coinsEarned={earnedCoins}
          timeTakenOrLeft={timeLeft}
          mistakes={mistakes}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
          onHome={handleHome}
        />
      )}

      {isGameOver && (
        <GameOverModal
          reason={gameOverReason}
          levelName={level.name}
          onRevive={handleRevive}
          onTryAgain={handleRestart}
          onHome={handleHome}
        />
      )}
    </div>
  );
};
