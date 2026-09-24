import React, { useState } from 'react';
import { RefreshCw, Home, Video, Droplet, Clock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { showSnakeRewardedAd, isRewardedAdReady } from '../../utils/admob';

interface GameOverModalProps {
  reason: 'time_out' | 'out_of_hearts';
  levelName: string;
  onRevive: () => void;
  onTryAgain: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  onRevive,
  onTryAgain,
  onHome,
}) => {
  const { isLight } = useGame();
  const [isAdLoading, setIsAdLoading] = useState(false);
  const adReady = isRewardedAdReady();

  const handleWatchAd = async () => {
    if (isAdLoading || !adReady) return;

    soundManager.playTap();
    setIsAdLoading(true);
    const rewardEarned = await showSnakeRewardedAd();
    setIsAdLoading(false);

    if (rewardEarned) onRevive();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
        <div
          className={`w-full max-w-sm rounded-3xl border-2 shadow-2xl p-5 text-center relative overflow-hidden transition-colors ${
            isLight
              ? 'bg-stone-50 border-red-500/70 text-stone-900'
              : 'bg-slate-900 border-red-500/50 text-white'
          }`}
        >
          {/* Warning siren glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />

          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-2 animate-bounce ${
              isLight
                ? 'bg-red-100 border-red-300 text-red-600'
                : 'bg-red-500/20 border-red-500/40 text-red-400'
            }`}
          >
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className={`text-2xl font-black font-heading ${isLight ? 'text-stone-900' : 'text-white'}`}>
            {reason === 'time_out' ? 'TIME EXPIRED!' : 'OUT OF LIVES!'}
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>
            {reason === 'time_out'
              ? 'The Emergency Arrow could not escape before the timer ran out.'
              : '1 life can be restored! Watch a short ad to restore 1 life.'}
          </p>

          {/* Revive / Watch Ad Card */}
          <div
            className={`my-4 p-3.5 rounded-2xl border text-left flex items-center justify-between shadow-sm ${
              isLight
                ? 'bg-white border-sky-300 shadow-sky-100'
                : 'bg-gradient-to-r from-sky-950/60 via-slate-950 to-blue-950/60 border-sky-500/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isLight ? 'bg-sky-100 border-sky-300 text-sky-600' : 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                }`}
              >
                {reason === 'time_out' ? <Clock className="w-5 h-5" /> : <Droplet className="w-5 h-5 fill-sky-500 text-sky-500" />}
              </div>
              <div>
                <div className={`text-xs font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  {reason === 'time_out' ? '+20s Extra Time' : '1 Life Can Be Restored'}
                </div>
                <div className={`text-[10px] ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>
                  {adReady
                    ? reason === 'time_out' ? 'Watch short ad to add 20s' : 'Watch short ad to get 1 life'
                    : 'Ad not available right now'}
                </div>
              </div>
            </div>

            <button
              onClick={() => void handleWatchAd()}
              disabled={isAdLoading || !adReady}
              style={{ touchAction: 'manipulation' }}
              className={`py-2 px-3 min-h-[44px] rounded-xl font-black text-xs flex items-center gap-1 shadow-md transition-all ${
                adReady && !isAdLoading
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:scale-105 active:scale-95'
                  : isLight
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isAdLoading ? 'LOADING...' : adReady ? 'WATCH AD' : 'NOT AVAIL.'}</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.playTap();
                onTryAgain();
              }}
              style={{ touchAction: 'manipulation' }}
              className="flex-1 py-3 min-h-[44px] rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>TRY AGAIN</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                onHome();
              }}
              style={{ touchAction: 'manipulation' }}
              className={`p-3 min-h-[44px] min-w-[44px] rounded-2xl border active:scale-95 transition-all flex items-center justify-center ${
                isLight
                  ? 'bg-stone-200 border-stone-300 text-stone-800 hover:bg-stone-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </>
  );
};


