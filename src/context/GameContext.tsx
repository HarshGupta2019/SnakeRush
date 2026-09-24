import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GameMode, ScreenType, UserProgress, UserStats } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { soundManager } from '../utils/audio';
import { BOARD_THEMES, ARROW_SKINS } from '../utils/themes';
import { auth, db } from '../firebase';
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

const STORAGE_KEY = 'arrow_rush_v1_save';
const SNAKE_ADS_REQUIRED = 10;

const getAuthenticatedUser = async (): Promise<User | null> => {
  if (auth.currentUser) return auth.currentUser;

  return new Promise(resolve => {
    let unsubscribe = () => undefined;
    unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    });
  });
};

const DEFAULT_STATS: UserStats = {
  totalCleared: 0,
  perfectRuns: 0,
  emergencyWins: 0,
  shapeWins: 0,
  hintsUsed: 0,
  noMistakeRuns: 0,
  fastestEmergencyEscape: 0,
};

const DEFAULT_PROGRESS: UserProgress = {
  coins: 150, // Starting bonus
  currentEmergencyLevel: 1,
  currentShapeLevel: 1,
  unlockedBoards: ['eye_comfort', 'classic'],
  unlockedArrows: ['eye_comfort_arrow', 'classic'],
  unlockedTrails: ['sparks'],
  selectedBoard: 'eye_comfort',
  selectedArrow: 'eye_comfort_arrow',
  selectedTrail: 'sparks',
  stars: {},
  highScores: {},
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  dailyStreak: 1,
  lastDailyDate: '',
  dailyCompletedToday: false,
  hintsCount: 3,
  freezesCount: 2,
  healthRestoresCount: 2,
  claimedAchievements: [],
  stats: DEFAULT_STATS,
  playerName: 'ArrowRunner',
  playerAvatar: '⚡',
  hasRemovedAds: false,
  snakeAdProgress: {},
};

interface GameContextType {
  progress: UserProgress;
  screen: ScreenType;
  selectedMode: GameMode;
  selectedCategory: string;
  currentLevelId: number;
  isDailyChallenge: boolean;
  setScreen: (screen: ScreenType) => void;
  setSelectedMode: (mode: GameMode) => void;
  setSelectedCategory: (category: string) => void;
  startLevel: (mode: GameMode, levelId: number, isDaily?: boolean) => void;
  onLevelCompleted: (stars: number, coinsEarned: number, timeSpent: number, mistakes: number, isEmergency: boolean) => void;
  buyBoard: (id: string, price: number) => boolean;
  buyArrow: (id: string, price: number) => boolean;
  watchSnakeAd: (id: string) => { watched: number; total: number; unlocked: boolean };
  buyTrail: (id: string, price: number) => boolean;
  equipBoard: (id: string) => void;
  equipArrow: (id: string) => void;
  equipTrail: (id: string) => void;
  useHintItem: () => boolean;
  useFreezeItem: () => boolean;
  useHealthRestoreItem: () => boolean;
  addPowerups: (type: 'hint' | 'freeze' | 'health', amount: number) => void;
  claimAchievementReward: (id: string) => void;
  toggleSoundSetting: () => void;
  toggleMusicSetting: () => void;
  toggleHapticsSetting: () => void;
  claimDailyStreakBonus: () => void;
  addCoinsDirect: (amount: number) => void;
  updateProfile: (name: string, avatar: string) => void;
  removeAdsAction: () => void;
  resetAllProgress: () => void;
  isLight: boolean;
  toggleTheme: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          snakeAdProgress: parsed.snakeAdProgress || {},
          stats: { ...DEFAULT_STATS, ...(parsed.stats || {}) },
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  const [screen, setScreen] = useState<ScreenType>('home');
  const [selectedMode, setSelectedMode] = useState<GameMode>('emergency');
  const [selectedCategory, setSelectedCategory] = useState<string>('animals');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [isDailyChallenge, setIsDailyChallenge] = useState<boolean>(false);
  const storageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist after a quiet period so rapid gameplay updates do not block the main thread.
  useEffect(() => {
    if (storageTimerRef.current) clearTimeout(storageTimerRef.current);
    storageTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch {
        // Storage error fallback
      }
      storageTimerRef.current = null;
    }, 500);
    return () => {
      if (storageTimerRef.current) clearTimeout(storageTimerRef.current);
    };
  }, [progress]);

  // Audio system sync
  useEffect(() => {
    soundManager.setSoundEnabled(progress.soundEnabled);
    soundManager.setMusicEnabled(progress.musicEnabled);
    soundManager.setHapticsEnabled(progress.hapticsEnabled);
  }, [progress.soundEnabled, progress.musicEnabled, progress.hapticsEnabled]);

  // Check daily streak reset
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (progress.lastDailyDate && progress.lastDailyDate !== today) {
      const last = new Date(progress.lastDailyDate);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Consecutive day
        setProgress(prev => ({ ...prev, dailyCompletedToday: false }));
      } else if (diffDays > 1) {
        // Streak broken
        setProgress(prev => ({ ...prev, dailyStreak: 1, dailyCompletedToday: false }));
      }
    }
  }, [progress.lastDailyDate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) return;
      void getDocs(collection(db, 'users', user.uid, 'snakeUnlocks')).then(snapshot => {
        const cloudEntries = snapshot.docs.map(snakeDoc => ({
          id: snakeDoc.id,
          watched: Number(snakeDoc.data().adsWatched) || 0,
        }));
        const cloudProgress = Object.fromEntries(
          cloudEntries.filter(entry => entry.watched > 0).map(entry => [entry.id, entry.watched]),
        );
        const cloudUnlocked = cloudEntries
          .filter(entry => entry.watched >= (ARROW_SKINS.find(skin => skin.id === entry.id)?.adsRequired || 10))
          .map(entry => entry.id);
        if (Object.keys(cloudProgress).length === 0) return;
        setProgress(prev => ({
          ...prev,
          snakeAdProgress: { ...(prev.snakeAdProgress || {}), ...cloudProgress },
          unlockedArrows: [...new Set([...prev.unlockedArrows, ...cloudUnlocked])],
        }));
      }).catch(error => console.error('Snake unlock load error:', error));
    });

    return unsubscribe;
  }, []);

  const startLevel = useCallback((mode: GameMode, levelId: number, isDaily: boolean = false) => {
    console.log(`[GameContext] startLevel called. Mode: ${mode}, LevelId: ${levelId}`);
    soundManager.playTap();
    setSelectedMode(mode);
    setCurrentLevelId(levelId);
    setIsDailyChallenge(isDaily);
    setScreen('game');
  }, []);

  const onLevelCompleted = useCallback((
    stars: number,
    coinsEarned: number,
    timeRemainingOrElapsed: number,
    mistakes: number,
    isEmergency: boolean
  ) => {
    console.log(`[GameContext] onLevelCompleted called. Stars: ${stars}, Coins: ${coinsEarned}`);
    const levelKey = `${selectedMode}_${currentLevelId}`;
    const previousStars = progress.stars[levelKey] || 0;
    const newStars = Math.max(previousStars, stars);

    setProgress(prev => {
      const nextEmergency = isEmergency && !isDailyChallenge
        ? Math.max(prev.currentEmergencyLevel, currentLevelId + 1)
        : prev.currentEmergencyLevel;
      const nextShape = !isEmergency ? Math.max(prev.currentShapeLevel, currentLevelId + 1) : prev.currentShapeLevel;

      const newStats: UserStats = {
        ...prev.stats,
        totalCleared: prev.stats.totalCleared + (isEmergency ? 1 : 1),
        perfectRuns: mistakes === 0 ? prev.stats.perfectRuns + 1 : prev.stats.perfectRuns,
        noMistakeRuns: mistakes === 0 ? prev.stats.noMistakeRuns + 1 : prev.stats.noMistakeRuns,
        emergencyWins: isEmergency ? prev.stats.emergencyWins + 1 : prev.stats.emergencyWins,
        shapeWins: !isEmergency ? prev.stats.shapeWins + 1 : prev.stats.shapeWins,
        fastestEmergencyEscape: isEmergency
          ? Math.max(prev.stats.fastestEmergencyEscape, timeRemainingOrElapsed)
          : prev.stats.fastestEmergencyEscape,
      };

      const updatedDaily = isDailyChallenge ? true : prev.dailyCompletedToday;
      const completedDate = isDailyChallenge ? new Date().toISOString().slice(0, 10) : prev.lastDailyDate;

      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        currentEmergencyLevel: nextEmergency,
        currentShapeLevel: nextShape,
        stars: { ...prev.stars, [levelKey]: newStars },
        dailyCompletedToday: updatedDaily,
        lastDailyDate: completedDate,
        stats: newStats,
      };
    });

  }, [currentLevelId, isDailyChallenge, progress.stars, selectedMode]);

  const buyBoard = useCallback((id: string, price: number): boolean => {
    if (progress.coins >= price && !progress.unlockedBoards.includes(id)) {
      soundManager.playCoinEarn();
      setProgress(prev => ({
        ...prev,
        coins: prev.coins - price,
        unlockedBoards: [...prev.unlockedBoards, id],
        selectedBoard: id,
      }));
      return true;
    }
    soundManager.playBlockedHit();
    return false;
  }, [progress.coins, progress.unlockedBoards]);

  const buyArrow = useCallback((id: string, price: number): boolean => {
    const skin = ARROW_SKINS.find(s => s.id === id);
    if (skin?.unlockType === 'ads') {
      // Ad-exclusive snakes can only be unlocked by watching 10 ads
      soundManager.playBlockedHit();
      return false;
    }

    if (progress.coins >= price && !progress.unlockedArrows.includes(id)) {
      soundManager.playCoinEarn();
      setProgress(prev => ({
        ...prev,
        coins: prev.coins - price,
        unlockedArrows: [...prev.unlockedArrows, id],
        selectedArrow: id,
      }));
      return true;
    }
    soundManager.playBlockedHit();
    return false;
  }, [progress.coins, progress.unlockedArrows]);

  const watchSnakeAd = useCallback((id: string): { watched: number; total: number; unlocked: boolean } => {
    const skin = ARROW_SKINS.find(s => s.id === id);
    const required = SNAKE_ADS_REQUIRED;
    const current = progress.snakeAdProgress?.[id] || 0;
    const nextWatched = Math.min(required, current + 1);
    const isNowUnlocked = nextWatched >= required;

    setProgress(prev => {
      const updatedAdProgress = {
        ...(prev.snakeAdProgress || {}),
        [id]: nextWatched,
      };

      const newUnlocked =
        isNowUnlocked && !prev.unlockedArrows.includes(id)
          ? [...prev.unlockedArrows, id]
          : prev.unlockedArrows;

      return {
        ...prev,
        snakeAdProgress: updatedAdProgress,
        unlockedArrows: newUnlocked,
      };
    });

    void getAuthenticatedUser()
      .then(user => {
        if (!user) return;
        return setDoc(
          doc(db, 'users', user.uid, 'snakeUnlocks', id),
          {
            playerId: user.uid,
            snakeId: id,
            adsWatched: nextWatched,
            adsRequired: SNAKE_ADS_REQUIRED,
            unlocked: isNowUnlocked,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      })
      .catch(error => console.error('Snake unlock save error:', error));

    if (isNowUnlocked) {
      soundManager.playVictoryFanfare();
    } else {
      soundManager.playCoinEarn();
    }

    return {
      watched: nextWatched,
      total: required,
      unlocked: isNowUnlocked,
    };
  }, [progress.snakeAdProgress, progress.unlockedArrows]);

  const buyTrail = useCallback((id: string, price: number): boolean => {
    if (progress.coins >= price && !progress.unlockedTrails.includes(id)) {
      soundManager.playCoinEarn();
      setProgress(prev => ({
        ...prev,
        coins: prev.coins - price,
        unlockedTrails: [...prev.unlockedTrails, id],
        selectedTrail: id,
      }));
      return true;
    }
    soundManager.playBlockedHit();
    return false;
  }, [progress.coins, progress.unlockedTrails]);

  const equipBoard = useCallback((id: string) => {
    soundManager.playTap();
    setProgress(prev => ({ ...prev, selectedBoard: id }));
  }, []);

  const equipArrow = useCallback((id: string) => {
    soundManager.playTap();
    setProgress(prev => ({ ...prev, selectedArrow: id }));
  }, []);

  const equipTrail = useCallback((id: string) => {
    soundManager.playTap();
    setProgress(prev => ({ ...prev, selectedTrail: id }));
  }, []);

  const useHintItem = useCallback((): boolean => {
    if (progress.hintsCount > 0) {
      setProgress(prev => ({
        ...prev,
        hintsCount: prev.hintsCount - 1,
        stats: { ...prev.stats, hintsUsed: prev.stats.hintsUsed + 1 },
      }));
      return true;
    }
    return false;
  }, [progress.hintsCount]);

  const useFreezeItem = useCallback((): boolean => {
    if (progress.freezesCount > 0) {
      setProgress(prev => ({ ...prev, freezesCount: prev.freezesCount - 1 }));
      return true;
    }
    return false;
  }, [progress.freezesCount]);

  const useHealthRestoreItem = useCallback((): boolean => {
    if (progress.healthRestoresCount > 0) {
      setProgress(prev => ({ ...prev, healthRestoresCount: prev.healthRestoresCount - 1 }));
      return true;
    }
    return false;
  }, [progress.healthRestoresCount]);

  const addPowerups = useCallback((type: 'hint' | 'freeze' | 'health', amount: number) => {
    soundManager.playCoinEarn();
    setProgress(prev => {
      if (type === 'hint') return { ...prev, hintsCount: prev.hintsCount + amount };
      if (type === 'freeze') return { ...prev, freezesCount: prev.freezesCount + amount };
      return { ...prev, healthRestoresCount: prev.healthRestoresCount + amount };
    });
  }, []);

  const claimAchievementReward = useCallback((id: string) => {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (ach && !progress.claimedAchievements.includes(id)) {
      soundManager.playCoinEarn();
      setProgress(prev => ({
        ...prev,
        coins: prev.coins + ach.rewardCoins,
        claimedAchievements: [...prev.claimedAchievements, id],
      }));
    }
  }, [progress.claimedAchievements]);

  const toggleSoundSetting = useCallback(() => {
    setProgress(prev => {
      const next = !prev.soundEnabled;
      soundManager.setSoundEnabled(next);
      return { ...prev, soundEnabled: next };
    });
  }, []);

  const toggleMusicSetting = useCallback(() => {
    setProgress(prev => {
      const next = !prev.musicEnabled;
      soundManager.setMusicEnabled(next);
      return { ...prev, musicEnabled: next };
    });
  }, []);

  const toggleHapticsSetting = useCallback(() => {
    setProgress(prev => {
      const next = !prev.hapticsEnabled;
      soundManager.setHapticsEnabled(next);
      return { ...prev, hapticsEnabled: next };
    });
  }, []);

  const claimDailyStreakBonus = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const hasAlreadyCompletedToday = progress.dailyCompletedToday && progress.lastDailyDate === today;
    
    if (!hasAlreadyCompletedToday) {
      soundManager.playVictoryFanfare();
      
      // Calculate diff to see if streak was broken before claiming
      let newStreak = progress.dailyStreak;
      if (progress.lastDailyDate) {
        const last = new Date(progress.lastDailyDate);
        const now = new Date(today);
        const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 1) {
          newStreak = 1; // Streak broken
        } else if (diffDays === 1) {
          newStreak += 1; // Streak continues
        }
      } else {
        newStreak = 1; // First time
      }

      const bonus = 50 * Math.min(7, newStreak);
      setProgress(prev => ({
        ...prev,
        coins: prev.coins + bonus,
        dailyStreak: newStreak,
        lastDailyDate: today,
        dailyCompletedToday: true,
      }));
    }
  }, [progress.dailyCompletedToday, progress.dailyStreak]);

  const addCoinsDirect = useCallback((amount: number) => {
    soundManager.playCoinEarn();
    setProgress(prev => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const updateProfile = useCallback((name: string, avatar: string) => {
    soundManager.playTap();
    setProgress(prev => ({ ...prev, playerName: name, playerAvatar: avatar }));
  }, []);

  const removeAdsAction = useCallback(() => {
    soundManager.playVictoryFanfare();
    setProgress(prev => ({ ...prev, hasRemovedAds: true }));
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    setScreen('home');
  }, []);

  const activeBoard = useMemo(
    () => BOARD_THEMES.find(b => b.id === progress.selectedBoard) || BOARD_THEMES[0],
    [progress.selectedBoard],
  );
  const isLight = useMemo(
    () => activeBoard.isLight ?? (progress.selectedBoard === 'eye_comfort'),
    [activeBoard.isLight, progress.selectedBoard],
  );

  const toggleTheme = useCallback(() => {
    if (isLight) {
      equipBoard('classic');
      equipArrow('classic');
    } else {
      equipBoard('eye_comfort');
      equipArrow('eye_comfort_arrow');
    }
  }, [equipBoard, equipArrow, isLight]);

  const contextValue = useMemo<GameContextType>(() => ({
        progress,
        screen,
        selectedMode,
        selectedCategory,
        currentLevelId,
        isDailyChallenge,
        setScreen,
        setSelectedMode,
        setSelectedCategory,
        startLevel,
        onLevelCompleted,
        buyBoard,
        buyArrow,
        watchSnakeAd,
        buyTrail,
        equipBoard,
        equipArrow,
        equipTrail,
        useHintItem,
        useFreezeItem,
        useHealthRestoreItem,
        addPowerups,
        claimAchievementReward,
        toggleSoundSetting,
        toggleMusicSetting,
        toggleHapticsSetting,
        claimDailyStreakBonus,
        addCoinsDirect,
        updateProfile,
        removeAdsAction,
        resetAllProgress,
        isLight,
        toggleTheme,
  }), [
    progress,
    screen,
    selectedMode,
    selectedCategory,
    currentLevelId,
    isDailyChallenge,
    startLevel,
    onLevelCompleted,
    buyBoard,
    buyArrow,
    watchSnakeAd,
    buyTrail,
    equipBoard,
    equipArrow,
    equipTrail,
    useHintItem,
    useFreezeItem,
    useHealthRestoreItem,
    addPowerups,
    claimAchievementReward,
    toggleSoundSetting,
    toggleMusicSetting,
    toggleHapticsSetting,
    claimDailyStreakBonus,
    addCoinsDirect,
    updateProfile,
    removeAdsAction,
    resetAllProgress,
    isLight,
    toggleTheme,
  ]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
