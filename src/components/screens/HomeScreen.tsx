import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { getRescueAnimalForLevel, getRescueTierConfig } from '../../utils/rescueAnimals';


export const HomeScreen: React.FC = () => {
  const { progress, setScreen, setSelectedMode, startLevel, isLight } = useGame();
  const currentAnimal = getRescueAnimalForLevel(progress.currentEmergencyLevel);
  const currentTier = getRescueTierConfig(progress.currentEmergencyLevel);

  const handlePlayClick = () => {
    soundManager.playTap();
    setScreen('mode_select');
  };

  const handleEmergencyQuickPlay = () => {
    soundManager.playTap();
    startLevel('emergency', progress.currentEmergencyLevel);
  };

  const handleShapeQuickPlay = () => {
    soundManager.playTap();
    setSelectedMode('shape');
    setScreen('level_select');
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between px-4 pt-2 pb-24 overflow-y-auto select-none">
      {/* 1. Header Banner / Game Logo */}
      <div className="flex flex-col items-center justify-center my-2 relative">
        {/* Animated backdrop glow */}
        <div className="absolute -top-6 w-48 h-48 bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Badge */}
        <div className="relative flex items-center justify-center mb-1">
          <div
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full border shadow-md transition-colors ${
              isLight
                ? 'bg-white border-stone-300 text-stone-800'
                : 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/80'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-emergency text-base">
              🐍
            </div>
            <span
              className={`text-xs font-black tracking-widest uppercase ${
                isLight ? 'text-emerald-800' : 'text-emerald-400'
              }`}
            >
              Snake Untangle
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />
          </div>
        </div>

        {/* Main Title Typography */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-center font-heading">
          <span
            className={
              isLight
                ? 'bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 bg-clip-text text-transparent drop-shadow-sm'
                : 'bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-400 bg-clip-text text-transparent drop-shadow-md'
            }
          >
            SNAKE RUSH
          </span>
        </h1>
        <div
          className={`flex items-center gap-2 mt-0.5 text-xs font-bold tracking-widest uppercase ${
            isLight ? 'text-stone-600' : 'text-slate-400'
          }`}
        >
          <span className={isLight ? 'text-red-700' : 'text-red-400'}>Animal Rescue</span>
          <span className={isLight ? 'text-stone-400' : 'text-slate-600'}>•</span>
          <span className={isLight ? 'text-emerald-700' : 'text-emerald-400'}>Untangle</span>
          <span className={isLight ? 'text-stone-400' : 'text-slate-600'}>•</span>
          <span className={isLight ? 'text-sky-700' : 'text-sky-400'}>Breeds</span>
        </div>
      </div>

      {/* 2. Primary Action: Giant Glowing PLAY Button */}
      <div className="my-2.5 flex flex-col items-center">
        <button
          onClick={handlePlayClick}
          className="relative group w-full min-h-[56px] py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white font-black text-xl tracking-wider uppercase shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden border border-white/20"
        >
          {/* Animated Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
          </div>
          <span className="drop-shadow-md">START PLAYING</span>
        </button>
      </div>

      {/* 3. Two Quick-Mode Cards */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {/* Emergency Mode Card */}
        <div
          onClick={handleEmergencyQuickPlay}
          className={`relative p-3.5 rounded-2xl border cursor-pointer active:scale-95 transition-all group overflow-hidden ${
            isLight
              ? 'bg-white/95 border-2 border-red-300 hover:border-red-400 shadow-md text-stone-900'
              : 'bg-gradient-to-b from-red-950/40 to-slate-900/90 border-red-500/40 hover:border-red-400 shadow-lg shadow-red-950/40 text-white'
          }`}
        >
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span
              className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase ${
                isLight
                  ? 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-red-950/80 border-red-500/50 text-red-300'
              }`}
            >
              {currentTier.dangerBadge}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold ${
                isLight
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-red-500/30 border-red-400/40 text-red-200'
              }`}
            >
              LV {progress.currentEmergencyLevel}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center text-xl text-white shadow-md shadow-red-500/40 mb-2 group-hover:scale-110 transition-transform">
            {currentAnimal.emoji}
          </div>
          <h2 className={`text-sm font-black leading-tight ${isLight ? 'text-red-950' : 'text-white'}`}>
            ANIMAL RESCUE
          </h2>
          <div className={`text-[10px] font-bold mt-0.5 ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
            {currentTier.tierName} • 🐍 {currentTier.targetSnakes} Snakes
          </div>
          <p className={`text-[11px] mt-1 line-clamp-2 ${isLight ? 'text-stone-700 font-medium' : 'text-slate-300'}`}>
            Save {currentAnimal.name} ({currentAnimal.species}) from tangled serpents!
          </p>
          <div
            className={`mt-2.5 flex items-center justify-between text-[11px] font-black ${
              isLight ? 'text-red-700 group-hover:text-red-900' : 'text-red-400 group-hover:text-red-300'
            }`}
          >
            <span>Rescue Now</span>
            <span className="text-xs font-black">→</span>
          </div>
        </div>

        {/* Shape Mode Card */}
        <div
          onClick={handleShapeQuickPlay}
          className={`relative p-3.5 rounded-2xl border cursor-pointer active:scale-95 transition-all group overflow-hidden ${
            isLight
              ? 'bg-white/95 border-2 border-emerald-300 hover:border-emerald-400 shadow-md text-stone-900'
              : 'bg-gradient-to-b from-emerald-950/40 to-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-950/40 text-white'
          }`}
        >
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold">
            <span className={isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-900 px-1.5 py-0.5 rounded' : 'bg-emerald-500/30 border-emerald-400/40 text-emerald-300'}>
              LV {progress.currentShapeLevel}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl text-white shadow-md shadow-emerald-500/40 mb-2 group-hover:scale-110 transition-transform">
            🐍
          </div>
          <h2 className={`text-sm font-black leading-tight ${isLight ? 'text-emerald-950' : 'text-white'}`}>
            SHAPE UNTANGLE
          </h2>
          <p className={`text-[11px] mt-1 line-clamp-2 ${isLight ? 'text-stone-700 font-medium' : 'text-slate-300'}`}>
            Untangle every snake and reveal the silhouette!
          </p>
          <div
            className={`mt-2.5 flex items-center justify-between text-[11px] font-black ${
              isLight ? 'text-emerald-800 group-hover:text-emerald-950' : 'text-emerald-400 group-hover:text-emerald-300'
            }`}
          >
            <span>Browse Shapes</span>
            <span className="text-xs font-black">→</span>
          </div>
        </div>
      </div>
    </div>

  );
};
