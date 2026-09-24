import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { useGame } from '../../context/GameContext';

interface PauseModalProps {
  levelName: string;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelName,
  onResume,
  onRestart,
  onHome,
}) => {
  const { progress, toggleSoundSetting, toggleMusicSetting, isLight } = useGame();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl p-5 text-center transition-colors ${
          isLight
            ? 'bg-stone-50 border-stone-300 text-stone-900'
            : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        <h2 className={`text-xl font-black font-heading ${isLight ? 'text-stone-900' : 'text-white'}`}>GAME PAUSED</h2>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>{levelName}</p>

        {/* Audio Quick Toggles */}
        <div className="flex items-center justify-center gap-3 my-5">
          <button
            onClick={toggleSoundSetting}
            className={`p-3 min-h-[44px] rounded-2xl border transition-all active:scale-95 flex items-center gap-2 text-xs font-bold ${
              progress.soundEnabled
                ? isLight
                  ? 'bg-sky-100 border-sky-300 text-sky-800'
                  : 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : isLight
                ? 'bg-stone-200 border-stone-300 text-stone-500'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>SFX {progress.soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={toggleMusicSetting}
            className={`p-3 min-h-[44px] rounded-2xl border transition-all active:scale-95 flex items-center gap-2 text-xs font-bold ${
              progress.musicEnabled
                ? isLight
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : isLight
                ? 'bg-stone-200 border-stone-300 text-stone-500'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music {progress.musicEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              soundManager.playTap();
              onResume();
            }}
            style={{ touchAction: 'manipulation' }}
            className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME PUZZLE</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              onRestart();
            }}
            style={{ touchAction: 'manipulation' }}
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
              isLight
                ? 'bg-stone-200 hover:bg-stone-300 text-stone-800 border border-stone-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Level</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              onHome();
            }}
            style={{ touchAction: 'manipulation' }}
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
              isLight
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200'
                : 'bg-transparent hover:bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Quit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
