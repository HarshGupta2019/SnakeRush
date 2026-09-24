import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Star, Lock, ChevronLeft, ChevronRight, Search, Sparkles, AlertTriangle, Shapes } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { getRescueTierConfig } from '../../utils/rescueAnimals';

const LEVELS_PER_PAGE = 24;
const TOTAL_LEVELS = 1000;

export const LevelSelectScreen: React.FC = () => {
  const {
    progress,
    selectedMode,
    setScreen,
    startLevel,
    setSelectedMode,
    isLight,
  } = useGame();

  const currentUnlocked =
    selectedMode === 'emergency'
      ? progress.currentEmergencyLevel
      : progress.currentShapeLevel;

  const baseEnd = TOTAL_LEVELS;

  const initialPage = Math.floor((Math.max(1, currentUnlocked) - 1) / LEVELS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState<number>(Math.max(0, initialPage));
  const [jumpInput, setJumpInput] = useState<string>('');

  const totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

  const startLevelNum = 1 + currentPage * LEVELS_PER_PAGE;
  const levelsOnPage = Array.from({ length: LEVELS_PER_PAGE }, (_, i) => startLevelNum + i).filter(
    lvl => lvl <= baseEnd
  );

  const handleLevelClick = (lvl: number) => {
    if (lvl <= currentUnlocked) {
      soundManager.playTap();
      startLevel(selectedMode, lvl);
    } else {
      soundManager.playBlockedHit();
    }
  };

  const handleJumpToLevel = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput);
    if (!isNaN(num) && num >= 1 && num <= TOTAL_LEVELS) {
      const page = Math.floor((num - 1) / LEVELS_PER_PAGE);
      setCurrentPage(page);
      setJumpInput('');
    }
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between px-4 pt-3 pb-24 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between my-2">
        <button
          onClick={() => {
            soundManager.playTap();
            setScreen('mode_select');
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

        <div className="flex items-center gap-2">
          {selectedMode === 'emergency' ? (
            <div className={`flex items-center gap-1.5 font-bold text-sm ${isLight ? 'text-red-700' : 'text-red-400'}`}>
              <AlertTriangle className="w-4 h-4" />
              <span>Animal Rescue</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 font-bold text-sm ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>
              <Shapes className="w-4 h-4" />
              <span>Shape Mode</span>
            </div>
          )}
        </div>

        <div className="w-14" />
      </div>

      {/* Mode Quick Switch & Search */}
      <div
        className={`flex items-center justify-between gap-2 my-2 p-2 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedMode('emergency');
              setCurrentPage(0);
            }}
            className={`px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedMode === 'emergency'
                ? 'bg-red-600 text-white shadow-md'
                : isLight
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚨</span>
            <span className="hidden sm:inline">Animal Rescue</span>
            <span className="sm:hidden">Rescue</span>
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedMode('shape');
              setCurrentPage(0);
            }}
            className={`px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedMode === 'shape'
                ? 'bg-indigo-600 text-white shadow-md'
                : isLight
                ? 'text-stone-600 hover:text-stone-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🧩</span>
            <span className="hidden sm:inline">Shape Mode</span>
            <span className="sm:hidden">Shapes</span>
          </button>
        </div>

        {/* Jump to Level input */}
        <form onSubmit={handleJumpToLevel} className="flex items-center gap-1">
          <input
            type="number"
            placeholder="1-1000"
            min={1}
            max={TOTAL_LEVELS}
            value={jumpInput}
            onChange={e => setJumpInput(e.target.value)}
            className={`w-16 sm:w-20 px-2 py-2 min-h-[44px] rounded-xl border text-xs font-mono text-center focus:outline-none ${
              isLight
                ? 'bg-stone-50 border-stone-300 text-stone-900 focus:border-amber-500'
                : 'bg-slate-950 border-slate-700 text-white focus:border-sky-500'
            }`}
          />
          <button
            type="submit"
            className={`p-2 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center ${
              isLight ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            aria-label="Search level"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Level Grid Header for Emergency Mode */}
      {selectedMode === 'emergency' && (
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs my-1 ${
            isLight
              ? 'bg-amber-50 border-amber-200 text-stone-800'
              : 'bg-slate-950/70 border-slate-800 text-xs'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className={`font-bold ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>
              Tier {getRescueTierConfig(startLevelNum).tierNumber}: {getRescueTierConfig(startLevelNum).tierName}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md border font-extrabold uppercase ${
                isLight
                  ? 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-red-950/80 border-red-500/40 text-red-300'
              }`}
            >
              {getRescueTierConfig(startLevelNum).dangerBadge}
            </span>
          </div>
          <span
            className={`text-[11px] font-mono font-semibold ${
              isLight ? 'text-emerald-800' : 'text-emerald-400'
            }`}
          >
            🐍 {getRescueTierConfig(startLevelNum).targetSnakes} Serpents
          </span>
        </div>
      )}

      {/* Level Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 my-2">
        {levelsOnPage.map(lvl => {
          const isUnlocked = lvl <= currentUnlocked;
          const isCurrent = lvl === currentUnlocked;
          const levelKey = `${selectedMode}_${lvl}`;
          const starsEarned = progress.stars[levelKey] || 0;
          const lvlTier = selectedMode === 'emergency' ? getRescueTierConfig(lvl) : null;

          return (
            <button
              key={lvl}
              onClick={() => handleLevelClick(lvl)}
              disabled={!isUnlocked}
              className={`relative aspect-square min-h-[50px] rounded-2xl flex flex-col items-center justify-center p-1 transition-all ${
                isCurrent
                  ? selectedMode === 'emergency'
                    ? 'bg-gradient-to-br from-red-500 to-amber-600 text-white shadow-lg shadow-red-500/40 ring-2 ring-amber-300 scale-105 animate-pulse'
                    : 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-300 scale-105 animate-pulse'
                  : isUnlocked
                  ? isLight
                    ? 'bg-white border-2 border-stone-200 text-stone-900 hover:border-emerald-500 hover:scale-105 active:scale-95 shadow-sm'
                    : 'bg-slate-900/90 border border-slate-700/80 text-white hover:border-emerald-500 hover:scale-105 active:scale-95 shadow-md'
                  : isLight
                  ? 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-slate-950/60 border border-slate-900 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black font-mono">{lvl}</span>
                    {lvlTier && (
                      <span className={`text-[9px] font-mono font-bold ${isLight ? 'text-amber-800' : 'text-amber-300/90'}`}>
                        🐍{lvlTier.targetSnakes}
                      </span>
                    )}
                  </div>
                  {/* Completion / Accuracy indicator */}
                  {starsEarned > 0 && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <span className={`text-[9px] font-black font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        ✓ {starsEarned === 3 ? '100%' : starsEarned === 2 ? '85%' : '70%'}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Lock className={`w-4 h-4 mb-0.5 ${isLight ? 'text-stone-400' : 'text-slate-700'}`} />
                  <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-stone-400' : 'text-slate-700'}`}>{lvl}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div
        className={`flex items-center justify-between my-2 px-2 py-1.5 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <button
          onClick={() => {
            soundManager.playTap();
            setCurrentPage(p => Math.max(0, p - 1));
          }}
          disabled={currentPage === 0}
          className={`flex items-center gap-1 px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed ${
            isLight
              ? 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className={`text-xs font-mono font-bold ${isLight ? 'text-stone-700' : 'text-slate-400'}`}>
          Page {currentPage + 1} of {Math.max(1, totalPages)}
        </span>

        <button
          onClick={() => {
            soundManager.playTap();
            setCurrentPage(p => Math.min(totalPages - 1, p + 1));
          }}
          disabled={currentPage >= totalPages - 1}
          className={`flex items-center gap-1 px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed ${
            isLight
              ? 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
