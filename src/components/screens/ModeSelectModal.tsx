import React from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Play, Clock, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ModeSelectModal: React.FC = () => {
  const { progress, setScreen, setSelectedMode, startLevel, isLight } = useGame();

  const handleSelectEmergency = () => {
    soundManager.playTap();
    setSelectedMode('emergency');
    setScreen('level_select');
  };

  const handleSelectShape = () => {
    soundManager.playTap();
    setSelectedMode('shape');
    setScreen('level_select');
  };

  const handleDirectEmergencyPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTap();
    startLevel('emergency', progress.currentEmergencyLevel);
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between px-4 pt-3 pb-24 overflow-y-auto select-none">
      {/* Header with Back button */}
      <div className="flex items-center justify-between my-2">
        <button
          onClick={() => {
            soundManager.playTap();
            setScreen('home');
          }}
          className={`flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl border active:scale-95 transition-all text-xs font-bold ${
            isLight
              ? 'bg-white border-stone-300 text-stone-800 hover:text-stone-950 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h2
          className={`text-lg font-black tracking-tight font-heading ${
            isLight ? 'text-stone-900' : 'text-white'
          }`}
        >
          SELECT GAME MODE
        </h2>
        <div className="w-14" /> {/* Spacer */}
      </div>

      <div className="flex flex-col gap-4 my-auto py-2">
        {/* CARD 1: ANIMAL RESCUE EMERGENCY MODE */}
        <div
          onClick={handleSelectEmergency}
          className={`relative p-5 rounded-3xl border-2 cursor-pointer active:scale-[0.98] transition-all group overflow-hidden ${
            isLight
              ? 'bg-white/95 border-red-300 hover:border-red-400 shadow-xl text-stone-900'
              : 'bg-gradient-to-br from-red-950/70 via-slate-900/90 to-amber-950/50 border-red-500/50 hover:border-red-400 shadow-2xl shadow-red-950/60 text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3
                className={`text-xl font-black font-heading tracking-wide ${
                  isLight ? 'text-red-950' : 'text-white'
                }`}
              >
                ANIMAL RESCUE
              </h3>
            </div>
          </div>

          {/* Mode Features Badges */}
          <div
            className={`grid grid-cols-3 gap-2 mt-4 pt-3 border-t text-[11px] font-medium ${
              isLight ? 'border-stone-200 text-stone-700' : 'border-red-500/20 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Timer Rush</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Hearts</span>
            </div>
            <div
              className={`flex items-center gap-1 font-bold ${
                isLight ? 'text-red-800' : 'text-red-300'
              }`}
            >
              <span>Current Level {progress.currentEmergencyLevel}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleDirectEmergencyPlay}
              className="flex-1 py-3 px-4 min-h-[44px] rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
            </button>
            <button
              onClick={handleSelectEmergency}
              className={`py-3 px-3 min-h-[44px] rounded-xl border font-bold text-xs active:scale-95 transition-all ${
                isLight
                  ? 'bg-stone-100 border-stone-300 text-stone-800 hover:text-stone-950'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              All Levels
            </button>
          </div>
        </div>

        {/* CARD 2: SHAPE MODE */}
        <div
          onClick={handleSelectShape}
          className={`relative p-5 rounded-3xl border-2 cursor-pointer active:scale-[0.98] transition-all group overflow-hidden ${
            isLight
              ? 'bg-white/95 border-emerald-300 hover:border-emerald-400 shadow-xl text-stone-900'
              : 'bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-fuchsia-950/50 border-indigo-500/50 hover:border-indigo-400 shadow-2xl shadow-indigo-950/60 text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3
                className={`text-xl font-black font-heading tracking-wide ${
                  isLight ? 'text-emerald-950' : 'text-white'
                }`}
              >
                SHAPE UNTANGLE
              </h3>
            </div>
          </div>

          {/* Mode Features Badges */}
          <div
            className={`grid grid-cols-3 gap-2 mt-4 pt-3 border-t text-[11px] font-medium ${
              isLight ? 'border-stone-200 text-stone-700' : 'border-indigo-500/20 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Timer Rush</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Hearts</span>
            </div>
            <div
              className={`flex items-center gap-1 font-bold ${
                isLight ? 'text-emerald-800' : 'text-indigo-300'
              }`}
            >
              <span>Current Level {progress.currentShapeLevel}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleSelectShape}
              className="flex-1 py-3 px-4 min-h-[44px] rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-teal-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
            </button>
            <button
              onClick={handleSelectShape}
              className={`py-3 px-3 min-h-[44px] rounded-xl border font-bold text-xs active:scale-95 transition-all ${
                isLight
                  ? 'bg-stone-100 border-stone-300 text-stone-800 hover:text-stone-950'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
                All Levels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
