import React, { Component, ErrorInfo } from 'react';

class GlobalErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2>Game Crashed</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{ padding: 10, marginTop: 20, background: '#333', color: 'white', borderRadius: 5 }}>Reload Game</button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { useCallback, useEffect, useState } from 'react';
import { signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { GameProvider, useGame } from './context/GameContext';
import { HeaderBar } from './components/common/HeaderBar';
import { MobileFooter } from './components/common/MobileFooter';
import { HomeScreen } from './components/screens/HomeScreen';
import { ModeSelectModal } from './components/screens/ModeSelectModal';
import { LevelSelectScreen } from './components/screens/LevelSelectScreen';
import { GameScreen } from './components/screens/GameScreen';
import { ShopModal } from './components/modals/ShopModal';
import { DailyChallengeModal } from './components/modals/DailyChallengeModal';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { LeaderboardModal } from './components/modals/LeaderboardModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SplashScreen } from './components/common/SplashScreen';
import { BOARD_THEMES } from './utils/themes';
import { initializeAdMob } from './utils/admob';


export const saveScore = async (stars: number, playerName: string, avatar: string, dailyStreak: number, lastDailyDate: string) => {
  const user = auth.currentUser;

  if (!user) return;

  try {
    const playerRef = doc(db, 'leaderboard', user.uid);
    const playerSnap = await getDoc(playerRef);

    const currentData = playerSnap.exists() ? playerSnap.data() : {};
    const currentStars = Number(currentData.stars) || 0;
    const now = new Date();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    const saturday = new Date(now);
    if (day === 0) saturday.setDate(saturday.getDate() - 1);
    const weekendKey = `${saturday.getFullYear()}-${String(saturday.getMonth() + 1).padStart(2, '0')}-${String(saturday.getDate()).padStart(2, '0')}`;
    const sameWeekend = currentData.weekendKey === weekendKey;
    const nextWeekendStars = isWeekend
      ? sameWeekend
        ? Math.max(Number(currentData.weekendStars) || 0, stars)
        : stars
      : Number(currentData.weekendStars) || 0;

    if (
      !playerSnap.exists() ||
      typeof currentData.stars !== 'number' ||
      currentStars !== stars ||
      currentData.playerName !== playerName ||
      currentData.playerAvatar !== avatar ||
      currentData.dailyStreak !== dailyStreak ||
      currentData.lastDailyDate !== lastDailyDate ||
      (isWeekend && (!sameWeekend || Number(currentData.weekendStars) !== nextWeekendStars))
    ) {
      await setDoc(
        playerRef,
        {
          playerId: user.uid,
          playerName,
          playerAvatar: avatar,
          dailyStreak,
          lastDailyDate,
          stars,
          updatedAt: now,
          ...(isWeekend
            ? {
                weekendKey,
                weekendStars: nextWeekendStars,
                weekendUpdatedAt: now,
              }
            : {}),
        },
        { merge: true },
      );

      console.log('Player stars saved:', stars);
    }
  } catch (error) {
    console.error('Score save error:', error);
  }
};

const MainAppContent: React.FC = () => {
  const { screen, setScreen, progress, isLight } = useGame();
  const [showSplash, setShowSplash] = useState(() => localStorage.getItem('snake_rush_splash_seen') !== 'true');
  const activeBoard = BOARD_THEMES.find(b => b.id === progress.selectedBoard) || BOARD_THEMES[0];
  const handleSplashComplete = useCallback(() => {
    localStorage.setItem('snake_rush_splash_seen', 'true');
    setShowSplash(false);
  }, []);

  const totalStars = Object.values(progress.stars).reduce((total, levelStars) => total + (Number(levelStars) || 0), 0);

  // Initialize AdMob ONCE at app startup (during splash screen).
  // This pre-warms the SDK so showBanner() and showRewardVideoAd() are instant
  // with no blocking init call on the first ad interaction.
  useEffect(() => {
    void initializeAdMob().catch(() => {
      // Silently ignore — AdMob failure must never crash the game
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void saveScore(totalStars, progress.playerName, progress.playerAvatar, progress.dailyStreak, progress.lastDailyDate);
  }, [totalStars, progress.playerName, progress.playerAvatar, progress.dailyStreak, progress.lastDailyDate]);

  //
  //Sign in anonymously to Firebase on app load
  useEffect(() => {
  signInAnonymously(auth)
    .then((userCredential) => {
      console.log("Player ID:", userCredential.user.uid);
      void saveScore(totalStars, progress.playerName, progress.playerAvatar, progress.dailyStreak, progress.lastDailyDate);
    })
    .catch((error) => {
      console.error("Firebase Login Error:", error);
    });
}, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const renderActiveScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen />;
      case 'mode_select':
        return <ModeSelectModal />;
      case 'shape_category':
      case 'level_select':
        return <LevelSelectScreen />;
      case 'game':
        return <GameScreen />;
      case 'shop':
        return <ShopModal />;
      case 'daily':
        return <DailyChallengeModal />;
      case 'achievements':
        return <AchievementsModal />;
      case 'leaderboard':
        return <LeaderboardModal />;
      case 'profile':
        return <ProfileModal />;
      case 'settings':
        return <SettingsModal />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div
      className={`w-full min-h-[100dvh] max-w-lg mx-auto flex flex-col bg-gradient-to-b ${activeBoard.bgGradient} ${
        isLight ? 'text-stone-900' : 'text-slate-100'
      } shadow-2xl relative overflow-visible select-none`}
    >
      {/* Top Universal Header with Coins, Profile, Audio, Settings */}
      {screen !== 'game' && (
        <HeaderBar
          onOpenSettings={() => setScreen('settings')}
          onOpenProfile={() => setScreen('profile')}
        />
      )}

      {/* Primary Screen Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative">
        {renderActiveScreen()}
      </main>

      {/* Bottom Mobile Tab Bar */}
      <MobileFooter />
    </div>
  );
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <GameProvider>
        <MainAppContent />
      </GameProvider>
    </GlobalErrorBoundary>
  );
}
