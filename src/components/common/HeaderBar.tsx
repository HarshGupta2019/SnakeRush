import React from 'react';
import { useGame } from '../../context/GameContext';
import { Volume2, VolumeX, Music, Settings, User, Sparkles, Coins, Flame } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const HeaderBar: React.FC<{ onOpenSettings?: () => void; onOpenProfile?: () => void }> = ({
  onOpenSettings,
  onOpenProfile,
}) => {
  const {
    progress,
    screen,
    setScreen,
    toggleSoundSetting,
    toggleMusicSetting,
    isLight,
  } = useGame();

  const handleCoinClick = () => {
    soundManager.playTap();
    setScreen('shop');
  };

  return (
    <header
      className={`w-full max-w-lg mx-auto flex items-center justify-between px-3 py-2 backdrop-blur-md border-b z-30 transition-colors ${
        isLight
          ? 'bg-[#fcf7ee]/95 border-[#dfd5c5] shadow-sm'
          : 'bg-slate-900/85 border-slate-800/80'
      }`}
    >
      {/* Left: Profile / Avatar & Streak */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenProfile || (() => setScreen('profile'))}
          className={`flex items-center gap-1.5 px-2.5 py-1 min-h-[44px] rounded-full border active:scale-95 transition-all text-xs font-bold ${
            isLight
              ? 'bg-white border-stone-300 text-stone-800 hover:border-stone-400 shadow-sm'
              : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-sky-500/60'
          }`}
          title="Player Profile"
        >
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-sm shadow-sm text-white">
            {progress.playerAvatar || '⚡'}
          </span>
          <span className="max-w-[70px] truncate">{progress.playerName}</span>
        </button>

        {progress.dailyStreak > 1 && (
          <div
            onClick={() => setScreen('daily')}
            className={`flex items-center gap-1 px-2.5 py-1 min-h-[44px] rounded-full border text-xs font-black cursor-pointer active:scale-95 transition-all ${
              isLight
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
            }`}
            title={`${progress.dailyStreak} Day Streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{progress.dailyStreak}d</span>
          </div>
        )}
      </div>

      {/* Middle: Coins Pill */}
      <button
        onClick={handleCoinClick}
        className={`flex items-center gap-1.5 px-3.5 py-1 min-h-[44px] rounded-full border font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all ${
          isLight
            ? 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-sm'
            : 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-amber-400/50 text-amber-300'
        }`}
        title="Coin Balance - Click to visit Shop"
      >
        <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[11px] font-black shadow-inner">
          $
        </div>
        <span className="font-mono tracking-tight font-black">{progress.coins.toLocaleString()}</span>
        <span className={`text-xs ml-0.5 ${isLight ? 'text-amber-800' : 'text-amber-400/80'}`}>+</span>
      </button>

      {/* Right: Quick Controls & Settings */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleSoundSetting}
          className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-all active:scale-90 ${
            isLight
              ? progress.soundEnabled
                ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-sm'
                : 'bg-white border-stone-300 text-stone-400'
              : progress.soundEnabled
              ? 'bg-slate-800/80 border-slate-700 text-sky-400 hover:border-sky-500'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title="Toggle Sound Effects"
        >
          {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleMusicSetting}
          className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-all active:scale-90 ${
            isLight
              ? progress.musicEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                : 'bg-white border-stone-300 text-stone-400'
              : progress.musicEnabled
              ? 'bg-slate-800/80 border-slate-700 text-emerald-400 hover:border-emerald-500'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title="Toggle Background Music"
        >
          <Music className={`w-4 h-4 ${progress.musicEnabled ? 'animate-pulse' : ''}`} />
        </button>

        <button
          onClick={onOpenSettings || (() => setScreen('settings'))}
          className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center active:scale-90 transition-all ${
            isLight
              ? 'bg-white border-stone-300 text-stone-700 hover:text-stone-950 shadow-sm'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
