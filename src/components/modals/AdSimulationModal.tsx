import React, { useState, useEffect } from 'react';
import { Play, Sparkles, CheckCircle2, X, Film, Volume2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { useGame } from '../../context/GameContext';

interface AdSimulationModalProps {
  title?: string;
  rewardDescription: string;
  onRewardClaimed: () => void;
  onClose: () => void;
  durationSeconds?: number;
  requireFullCompletion?: boolean;
}

export const AdSimulationModal: React.FC<AdSimulationModalProps> = ({
  title = 'Watch Ad for Reward',
  rewardDescription,
  onRewardClaimed,
  onClose,
  durationSeconds = 3,
  requireFullCompletion = false,
}) => {
  const { isLight } = useGame();
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsCompleted(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleClaim = () => {
    soundManager.playVictoryFanfare();
    onRewardClaimed();
  };

  const progressPercent = Math.min(
    100,
    Math.round(((durationSeconds - secondsLeft) / durationSeconds) * 100)
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in select-none">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl p-5 text-center relative overflow-hidden transition-all ${
          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Close Button (cancel) */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 p-2 rounded-xl text-stone-400 hover:text-stone-200 transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
            <Film className="w-3 h-3" />
            REWARDED AD
          </span>
          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[9px] font-semibold">
            Ad Simulation
          </span>
        </div>

        <h3 className={`text-xl font-black font-heading ${isLight ? 'text-stone-900' : 'text-white'}`}>
          {title}
        </h3>
        <p className="text-[11px] text-amber-500 font-bold mt-0.5">
          (In future, this will be replaced with real video ads)
        </p>

        {/* Simulated Video Player Screen */}
        <div
          className={`my-4 p-4 rounded-2xl border relative overflow-hidden shadow-inner flex flex-col items-center justify-center h-36 ${
            isLight
              ? 'bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white border-stone-700'
              : 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-slate-800'
          }`}
        >
          {/* Animated Glow Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),transparent_70%)] animate-pulse" />

          {/* Central Animated Graphic */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 mb-2">
              {isCompleted ? (
                <CheckCircle2 className="w-7 h-7 text-white animate-bounce" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5 fill-white animate-pulse" />
              )}
            </div>

            <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
              <span>{isCompleted ? 'AD COMPLETE!' : 'SPONSORED VIDEO CLIP'}</span>
              <Volume2 className="w-3.5 h-3.5 text-sky-400 opacity-80" />
            </div>

            {/* Countdown Badge */}
            <div className="mt-1 text-[11px] text-sky-300 font-bold">
              {isCompleted ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Ready to claim reward!
                </span>
              ) : (
                <span>Reward unlocks in {secondsLeft}s...</span>
              )}
            </div>
          </div>

          {/* Progress Bar at bottom of screen */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reward Description Box */}
        <div
          className={`p-3 rounded-2xl border mb-4 text-xs font-semibold text-center flex items-center justify-center gap-2 ${
            isLight ? 'bg-white border-stone-200 text-stone-800' : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>{rewardDescription}</span>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 min-h-[44px] rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all animate-pulse"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>CLAIM REWARD</span>
          </button>
        ) : (
          <button
            onClick={requireFullCompletion ? undefined : handleClaim}
            disabled={requireFullCompletion}
            className="w-full py-3 min-h-[44px] rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>{requireFullCompletion ? `Complete ad to claim (${secondsLeft}s)` : `Skip & Claim Reward (${secondsLeft}s)`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
