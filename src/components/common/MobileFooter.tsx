import React from 'react';
import { useGame } from '../../context/GameContext';
import { Home, Play, ShoppingBag, Trophy, Award, Calendar } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ScreenType } from '../../types';

export const MobileFooter: React.FC = () => {
  const { screen, setScreen, isLight } = useGame();

  const tabs: Array<{ id: ScreenType; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'mode_select', label: 'Play', icon: <Play className="w-5 h-5 fill-current" /> },
    { id: 'daily', label: 'Daily', icon: <Calendar className="w-5 h-5" /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'achievements', label: 'Awards', icon: <Award className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Ranks', icon: <Trophy className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: ScreenType) => {
    soundManager.playTap();
    setScreen(tabId);
  };

  // Hide footer while actively in a game puzzle to keep screen max focused
  if (screen === 'game') return null;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 max-w-lg mx-auto backdrop-blur-lg border-t px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] z-30 flex items-center justify-around transition-colors ${
        isLight
          ? 'bg-[#fcf7ee]/95 border-[#dfd5c5] shadow-lg'
          : 'bg-slate-950/95 border-slate-800/80'
      }`}
    >
      {tabs.map(tab => {
        const isActive =
          screen === tab.id ||
          (tab.id === 'mode_select' && (screen === 'level_select' || screen === 'shape_category'));

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[48px] py-1 px-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? isLight
                  ? 'text-emerald-900 bg-emerald-100/90 border border-emerald-300 font-black shadow-sm scale-105'
                  : 'text-sky-400 bg-sky-500/15 border border-sky-500/30 font-bold scale-105 shadow-sm'
                : isLight
                ? 'text-stone-600 hover:text-stone-900 active:scale-95'
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
