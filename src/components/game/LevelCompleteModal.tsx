import React, { useEffect } from 'react';
import { Target, Zap, Crosshair, Heart, Play, RotateCcw, Home, Sparkles, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import { RescueAnimal } from '../../types';
import { AccuracyResult } from '../../utils/accuracy';
import { useGame } from '../../context/GameContext';

interface LevelCompleteModalProps {
  levelName: string;
  isEmergency: boolean;
  rescueAnimal?: RescueAnimal;
  rescueAnimals?: RescueAnimal[];
  accuracy: number;
  accuracyResult?: AccuracyResult;
  coinsEarned: number;
  timeTakenOrLeft: number;
  mistakes: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelName,
  isEmergency,
  rescueAnimal,
  rescueAnimals,
  accuracy,
  accuracyResult,
  coinsEarned,
  timeTakenOrLeft,
  mistakes,
  onNextLevel,
  onReplay,
  onHome,
}) => {
  const { isLight } = useGame();
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const animals =
    rescueAnimals && rescueAnimals.length > 0
      ? rescueAnimals
      : rescueAnimal
      ? [rescueAnimal]
      : [];
  const primaryAnimal = animals[0];

  useEffect(() => {
    console.log('[LevelCompleteModal] Mounted');
    soundManager.playVictoryFanfare();
    
    // Temporarily disabled confetti for debugging white screen issue
    // try {
    //   void confetti({
    //     particleCount: 90,
    //     spread: 75,
    //     startVelocity: 30,
    //     origin: { y: 0.62 },
    //     colors: ['#fbbf24', '#34d399', '#38bdf8', '#f472b6'],
    //   });
    //   console.log('[LevelCompleteModal] Confetti executed successfully');
    // } catch (e) {
    //   console.error('[LevelCompleteModal] Confetti error:', e);
    // }

    return () => {
      console.log('[LevelCompleteModal] Unmounted');
    };
  }, []);

  const clampedAccuracy = Math.min(100, Math.max(1, Math.round(accuracy || 100)));

  // Gauge circumference for r=42 is ~263.89
  const dashArray = 264;
  const dashOffset = dashArray - (dashArray * clampedAccuracy) / 100;


  const getAccuracyColor = (acc: number) => {
    if (acc >= 95) return '#10b981'; // emerald
    if (acc >= 85) return '#06b6d4'; // cyan
    if (acc >= 75) return '#38bdf8'; // sky
    if (acc >= 65) return '#f59e0b'; // amber
    return '#f97316'; // orange
  };

  const ringColor = getAccuracyColor(clampedAccuracy);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl border-2 shadow-2xl p-5 text-center relative overflow-hidden transition-colors ${
          isLight
            ? 'bg-stone-50 border-amber-500/70 text-stone-900'
            : 'bg-slate-900 border-amber-500/50 text-white'
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
            isLight
              ? 'bg-amber-100 border border-amber-300 text-amber-900'
              : 'bg-amber-500/20 border border-amber-400/50 text-amber-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {isEmergency && animals.length > 1
              ? `${animals.length} ANIMALS RESCUED!`
              : isEmergency && primaryAnimal
              ? 'ANIMAL RESCUED!'
              : isEmergency
              ? 'EMERGENCY ESCAPED!'
              : 'SHAPE UNTANGLED!'}
          </span>
        </div>

        {/* Animal Rescue Special Banner */}
        {isEmergency && animals.length > 0 && (
          <div
            className={`my-2 p-3 rounded-2xl border shadow-inner flex flex-col items-center ${
              isLight
                ? 'bg-red-50/90 border-red-300'
                : 'bg-gradient-to-r from-red-950/60 via-slate-950/80 to-amber-950/60 border-red-500/40'
            }`}
          >
            {animals.length > 1 ? (
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center justify-center gap-2.5 mb-1.5 flex-wrap">
                  {animals.map((a, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl shadow-lg ${
                        isLight
                          ? 'bg-white border-red-400 shadow-red-300'
                          : 'bg-slate-900 border-red-400/60 shadow-red-500/30'
                      }`}
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      {a.emoji}
                    </div>
                  ))}
                </div>
                <div className={`text-sm font-black text-center ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  <span>{animals.map(a => a.name).join(' & ')}</span>
                </div>
                <div className={`text-xs mt-0.5 font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                  🐾 All {animals.length} animals reached the sanctuary safely!
                </div>
              </div>
            ) : (
              <>
                <div
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-lg mb-1.5 ${
                    isLight ? 'bg-white border-red-400 shadow-red-300' : 'bg-slate-900 border-red-400/60 shadow-red-500/30'
                  }`}
                >
                  {primaryAnimal.emoji}
                </div>
                <div className={`text-sm font-black flex items-center gap-1 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  <span>{primaryAnimal.name}</span>
                  <span className={`text-xs ${isLight ? 'text-red-700 font-bold' : 'text-red-300'}`}>({primaryAnimal.species})</span>
                </div>
                {primaryAnimal.quote && (
                  <p className={`text-[11px] italic mt-1 px-2 line-clamp-2 ${isLight ? 'text-amber-900 font-medium' : 'text-amber-200/90'}`}>
                    "{primaryAnimal.quote}"
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <h2 className={`text-xl font-black font-heading mt-1 ${isLight ? 'text-stone-900' : 'text-white'}`}>{levelName}</h2>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>
          {mistakes === 0 ? 'Flawless zero-mistake untangling!' : 'Puzzle successfully cleared!'}
        </p>
        <p className={`text-sm font-black mt-1 ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
          CONGRATULATIONS!
        </p>

        {/* Percentage Accuracy Display (Replaces stars on victory) */}
        <div className="my-3 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Glow pulse */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none"
              style={{ backgroundColor: ringColor }}
            />

            {/* Circular Accuracy Gauge */}
            <div
              className={`relative w-28 h-28 rounded-full border flex flex-col items-center justify-center shadow-xl p-2 ${
                isLight ? 'bg-white border-stone-300' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={isLight ? '#e2e8f0' : '#1e293b'}
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="6"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="flex items-baseline z-10">
                <span className={`text-3xl font-black font-mono tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  {clampedAccuracy}
                </span>
                <span className="text-sm font-bold text-amber-500 font-mono ml-0.5">%</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest z-10 ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
                Accuracy
              </span>
            </div>
          </div>

          {/* Performance Pill */}
          <div
            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-sm ${
              isLight ? 'bg-white border-stone-300 text-stone-800' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-sky-500" />
            <span className={accuracyResult?.ratingColor || (isLight ? 'text-emerald-700' : 'text-emerald-400')}>
              {accuracyResult?.ratingTitle || (clampedAccuracy >= 95 ? 'PERFECT ACCURACY' : clampedAccuracy >= 80 ? 'GREAT ACCURACY' : 'CLEARED')}
            </span>
          </div>

          {/* Three Key Factors Breakdown: Minimum Arrows, Solving Speed, Lives Kept */}
          {accuracyResult && (
            <div className="grid grid-cols-3 gap-1.5 w-full mt-3 px-1 text-left">
              {/* Factor 1: Minimum arrows removed */}
              <div
                className={`p-2 rounded-xl border flex flex-col ${
                  isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className={`flex items-center gap-1 text-[10px] font-medium ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                  <Crosshair className="w-3 h-3 text-sky-500 shrink-0" />
                  <span>Removals</span>
                </div>
                <span className={`text-xs font-bold font-mono mt-0.5 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  {accuracyResult.actualArrows}/{accuracyResult.minArrows} min
                </span>
                <span className={`text-[9px] ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>
                  {accuracyResult.actualArrows === accuracyResult.minArrows
                    ? '100% optimal'
                    : `+${accuracyResult.actualArrows - accuracyResult.minArrows} extra`}
                </span>
              </div>

              {/* Factor 2: How fast he solved the problem */}
              <div
                className={`p-2 rounded-xl border flex flex-col ${
                  isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className={`flex items-center gap-1 text-[10px] font-medium ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                  <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Speed</span>
                </div>
                <span className={`text-xs font-bold font-mono mt-0.5 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  {accuracyResult.timeTakenSeconds}s
                </span>
                <span className={`text-[9px] ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>
                  {accuracyResult.speedScore >= 90
                    ? 'Blazing fast'
                    : accuracyResult.speedScore >= 70
                    ? 'Fast pace'
                    : 'Steady pace'}
                </span>
              </div>

              {/* Factor 3: Lives taken from three lives */}
              <div
                className={`p-2 rounded-xl border flex flex-col ${
                  isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className={`flex items-center gap-1 text-[10px] font-medium ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                  <Heart className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>3 Lives</span>
                </div>
                <span className={`text-xs font-bold font-mono mt-0.5 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  {accuracyResult.livesRemaining}/3 left
                </span>
                <span className={`text-[9px] ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>
                  {accuracyResult.livesTaken === 0
                    ? '0 lost (100%)'
                    : `-${accuracyResult.livesTaken} ${accuracyResult.livesTaken === 1 ? 'life' : 'lives'}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Coins Earned Banner */}
        <div
          className={`mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border shadow-sm ${
            isLight
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          <Coins className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="text-sm font-black tracking-wide">
            +{coinsEarned} <span className={`font-semibold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>Coins Earned!</span>
          </span>
        </div>

        {/* Action Buttons with 44px Touch Targets */}
        <div className="flex flex-col gap-2.5 mt-3">
          <button
            onClick={() => {
              if (isProcessing) return;
              setIsProcessing(true);
              console.log('[LevelCompleteModal] Continue clicked');
              soundManager.playTap();
              onNextLevel();
            }}
            disabled={isProcessing}
            style={{ touchAction: 'manipulation' }}
            className={`w-full min-h-[48px] py-3.5 px-4 rounded-xl text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${
              isProcessing ? 'bg-slate-400 cursor-not-allowed opacity-80' : 'bg-gradient-to-r from-sky-500 via-indigo-600 to-fuchsia-600'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isProcessing ? 'LOADING...' : 'CONTINUE TO NEXT LEVEL'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playTap();
                onReplay();
              }}
              style={{ touchAction: 'manipulation' }}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                isLight
                  ? 'bg-stone-200 hover:bg-stone-300 text-stone-800 border border-stone-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                onHome();
              }}
              style={{ touchAction: 'manipulation' }}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                isLight
                  ? 'bg-stone-200 hover:bg-stone-300 text-stone-800 border border-stone-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

