import React from 'react';
import { GameMode, PuzzleLevel } from '../../types';
import { RefreshCw, ArrowLeft, Pause, Droplet, Palette } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { useGame } from '../../context/GameContext';

interface GameHudProps {
  level: PuzzleLevel;
  mode: GameMode;
  timeLeft: number;
  maxTime: number;
  hearts: number;
  maxHearts: number;
  remainingCount: number;
  totalArrows: number;
  onBack: () => void;
  onPause: () => void;
  onRestart: () => void;
  onToggleTheme?: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  level,
  mode,
  timeLeft,
  maxTime,
  hearts,
  maxHearts,
  remainingCount,
  totalArrows,
  onBack,
  onPause,
  onRestart,
  onToggleTheme,
}) => {
  const { isLight } = useGame();
  const isEmergency = mode === 'emergency';
  const timePercent = maxTime > 0 ? (timeLeft / maxTime) * 100 : 100;
  const isUrgent = isEmergency && timeLeft <= 10;
  const animals =
    level.rescueAnimals && level.rescueAnimals.length > 0
      ? level.rescueAnimals
      : level.rescueAnimal
      ? [level.rescueAnimal]
      : [];
  const primaryAnimal = animals[0];
  const numEmergencyLeft = level.arrows.filter(a => a.isEmergency).length;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-2 px-3 pt-2 z-20 select-none">
      {/* Top Header Bar: Back, Centered Level, Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Back Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onBack();
          }}
          className={`p-2.5 min-h-[44px] min-w-[44px] rounded-2xl border active:scale-90 transition-all flex items-center justify-center shadow-sm ${
            isLight
              ? 'bg-white/95 border-stone-300 text-stone-800 hover:text-stone-950 shadow-sm'
              : 'bg-stone-900/80 border-stone-700/60 text-stone-200 hover:text-white'
          }`}
          title="Back"
          aria-label="Back to menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center: Level Title & Rescue Target / Shape Info */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`text-base sm:text-lg font-black font-heading tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-amber-900' : 'text-amber-400'
            }`}
          >
            <span>Level {level.id}</span>
            {level.dangerBadge && (
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                  isLight
                    ? level.difficulty === 'insane'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : level.difficulty === 'hard'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : level.difficulty === 'medium'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : level.difficulty === 'insane'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                    : level.difficulty === 'hard'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : level.difficulty === 'medium'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                }`}
              >
                {level.dangerBadge}
              </span>
            )}
          </div>
          <div
            className={`flex items-center gap-1 text-[11px] font-semibold ${
              isLight ? 'text-stone-700 font-bold' : 'text-stone-300'
            }`}
          >
            {isEmergency && animals.length > 0 ? (
              <span className={`flex items-center gap-1 ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                <span>{animals.map(a => a.emoji).join(' ')}</span>
                <span className="font-bold truncate max-w-[150px]">
                  {animals.length > 1
                    ? `Save ${animals.length} Animals`
                    : `Save ${primaryAnimal.name}`}
                </span>
                {level.tierName && (
                  <span className={`text-[10px] hidden sm:inline ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    • {level.tierName}
                  </span>
                )}
              </span>
            ) : (
              <>
                <span>{level.shapeIcon || '🐍'}</span>
                <span className="truncate max-w-[130px]">{level.name}</span>
              </>
            )}
            <span
              className={`font-mono text-[10px] font-black ${
                isLight ? 'text-emerald-800' : 'text-emerald-400'
              }`}
            >
              {isEmergency
                ? `(🐍 ${Math.max(0, remainingCount - numEmergencyLeft)} serpents)`
                : `(🐍 ${remainingCount}/${totalArrows})`}
            </span>
          </div>
        </div>

        {/* Right: Theme, Restart & Pause Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onToggleTheme && (
            <button
              onClick={() => {
                soundManager.playTap();
                onToggleTheme();
              }}
              className={`p-2.5 min-h-[44px] min-w-[44px] rounded-2xl border active:scale-90 transition-all flex items-center justify-center shadow-sm ${
                isLight
                  ? 'bg-white/95 border-stone-300 text-stone-700 hover:text-stone-950 shadow-sm'
                  : 'bg-stone-900/80 border-stone-700/60 text-stone-300 hover:text-white'
              }`}
              title="Change Theme"
              aria-label="Change theme"
            >
              <Palette className="w-4 h-4 text-sky-500" />
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playTap();
              onRestart();
            }}
            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-2xl border active:scale-90 transition-all flex items-center justify-center shadow-sm ${
              isLight
                ? 'bg-white/95 border-stone-300 text-stone-700 hover:text-stone-950 shadow-sm'
                : 'bg-stone-900/80 border-stone-700/60 text-stone-300 hover:text-white'
            }`}
            title="Restart Level"
            aria-label="Restart level"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              onPause();
            }}
            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-2xl border active:scale-90 transition-all flex items-center justify-center shadow-sm ${
              isLight
                ? 'bg-white/95 border-stone-300 text-stone-700 hover:text-stone-950 shadow-sm'
                : 'bg-stone-900/80 border-stone-700/60 text-stone-300 hover:text-white'
            }`}
            title="Pause Game"
            aria-label="Pause game"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Lives & Rescue Status Banner */}
      <div className="flex items-center justify-between px-1">
        {/* Lives / Water Droplets */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border shadow-sm ${
            isLight
              ? 'bg-white/95 border-stone-300 text-stone-800'
              : 'bg-stone-900/80 border-stone-700/60'
          }`}
        >
          {Array.from({ length: maxHearts }).map((_, i) => {
            const hasLife = i < hearts;
            return (
              <div
                key={`life-${i}`}
                className={`transition-all duration-300 transform ${
                  hasLife ? 'scale-100' : 'scale-75 opacity-25'
                }`}
              >
                <Droplet
                  className={`w-5 h-5 ${
                    hasLife
                      ? 'text-sky-500 fill-sky-500 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                      : isLight
                      ? 'text-stone-300 fill-stone-300'
                      : 'text-stone-600 fill-stone-700'
                  }`}
                />
              </div>
            );
          })}
          <span
            className={`text-[11px] font-mono font-bold ml-1 ${
              isLight ? 'text-sky-800' : 'text-sky-300'
            }`}
          >
            {hearts}/{maxHearts}
          </span>
        </div>

        {/* Emergency Rescue Animal Badge & Timer */}
        {isEmergency ? (
          <div className="flex items-center gap-2">
            {animals.length > 0 && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-2xl border text-xs font-bold animate-pulse ${
                  isLight
                    ? 'bg-red-50 border-red-300 text-red-900 shadow-sm'
                    : 'bg-red-950/80 border-red-500/50 text-red-200'
                }`}
              >
                <span className="text-base">{animals.map(a => a.emoji).join('')}</span>
                <span className="hidden sm:inline text-[11px]">
                  {animals.length > 1 ? `${animals.length} Animals` : primaryAnimal.species}
                </span>
              </div>
            )}
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl border font-mono text-xs font-black shadow-sm ${
                isUrgent
                  ? isLight
                    ? 'border-red-400 bg-red-100 text-red-700 animate-bounce'
                    : 'border-red-500 bg-red-950/80 text-red-400 animate-bounce'
                  : isLight
                  ? 'border-stone-300 bg-white/95 text-amber-900'
                  : 'border-stone-700/60 bg-stone-900/80 text-amber-400'
              }`}
            >
              <span>⏱️ {timeLeft}s</span>
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-black shadow-sm ${
              isLight
                ? 'bg-white/95 border-stone-300 text-emerald-900'
                : 'bg-stone-900/80 border-stone-700/60 text-emerald-400'
            }`}
          >
            <span>🐍 {remainingCount} untangled</span>
          </div>
        )}
      </div>

      {/* Emergency Countdown Progress Bar */}
      {isEmergency && (
        <div
          className={`relative w-full rounded-2xl p-2 border transition-all ${
            isUrgent
              ? isLight
                ? 'border-red-400 bg-red-50 animate-siren shadow-md'
                : 'border-red-500 bg-red-950/40 animate-siren shadow-lg shadow-red-500/40'
              : isLight
              ? 'border-stone-300 bg-white/90 shadow-inner'
              : 'border-stone-700/60 bg-stone-900/90'
          }`}
        >
          <div
            className={`w-full h-2 rounded-full overflow-hidden border ${
              isLight ? 'bg-stone-200 border-stone-300' : 'bg-stone-950 border-stone-800'
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isUrgent
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, timePercent))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
