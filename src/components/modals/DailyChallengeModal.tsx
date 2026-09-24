import React from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Flame, Calendar, Play, CheckCircle2, Coins, Sparkles, Trophy } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const DailyChallengeModal: React.FC = () => {
  const { progress, setScreen, startLevel, claimDailyStreakBonus, isLight } = useGame();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentStreakDay = ((progress.dailyStreak - 1) % 7) + 1;
  const today = new Date().toISOString().slice(0, 10);
  const hasCompletedDaily = progress.dailyCompletedToday && progress.lastDailyDate === today;

  const handleStartDaily = () => {
    soundManager.playTap();
    const dailyLevelId = 1 + (Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % 35);
    startLevel('emergency', dailyLevelId, true);
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between px-4 pt-3 pb-24 overflow-y-auto select-none">
      {/* Header */}
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
          <span>Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
          <h2
            className={`text-lg font-black tracking-tight font-heading ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}
          >
            DAILY CHALLENGE
          </h2>
        </div>

        <div className="w-14" />
      </div>

      {/* Streak Banner */}
      <div
        className={`my-2 p-4 rounded-3xl border-2 shadow-xl flex items-center justify-between transition-colors ${
          isLight
            ? 'bg-amber-50 border-amber-300 text-stone-900'
            : 'bg-gradient-to-br from-amber-950/80 via-slate-900/90 to-red-950/50 border-amber-500/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-lg shadow-amber-500/40">
            {progress.dailyStreak}🔥
          </div>
          <div>
            <div className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
              DAILY STREAK
            </div>
            <h3 className={`text-base font-bold leading-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>
              {progress.dailyStreak} Days Active
            </h3>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
              Keep solving daily to multiply rewards!
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-[10px] font-medium ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>Daily Reward</span>
          <div className={`text-sm font-mono font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
            +{50 * Math.min(7, progress.dailyStreak)} Coins
          </div>
        </div>
      </div>

      {/* 7-Day Calendar Streak Track */}
      <div
        className={`my-2 p-3.5 rounded-3xl border shadow-md transition-colors ${
          isLight ? 'bg-white border-stone-200' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
          Weekly Progress Track
        </span>

        <div className="grid grid-cols-7 gap-1.5">
          {daysOfWeek.map((day, idx) => {
            const dayNum = idx + 1;
            const isCompleted = dayNum < currentStreakDay || (dayNum === currentStreakDay && hasCompletedDaily);
            const isToday = dayNum === currentStreakDay;

            return (
              <div
                key={day}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  isToday
                    ? isLight
                      ? 'border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-400/40 scale-105'
                      : 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40 scale-105'
                    : isCompleted
                    ? isLight
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : isLight
                    ? 'border-stone-200 bg-stone-100 text-stone-400'
                    : 'border-slate-800 bg-slate-950/60 text-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{day}</span>
                <span className="text-xs font-black font-mono my-0.5">D{dayNum}</span>
                {isCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-current opacity-40" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Mission Action Card */}
      <div
        className={`my-2 p-4 rounded-3xl border flex flex-col gap-3 transition-colors ${
          isLight
            ? 'bg-white border-stone-200 shadow-sm'
            : 'bg-gradient-to-r from-red-950/40 via-slate-900 to-indigo-950/40 border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-red-700' : 'text-red-400'}`}>
              TODAY'S SPECIAL PUZZLE
            </span>
            <h4 className={`text-base font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>Emergency Gauntlet</h4>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-600' : 'text-slate-300'}`}>
              Solve the high-stakes directional rush puzzle in under 35 seconds.
            </p>
          </div>

          <div className={`px-2.5 py-1 rounded-xl font-mono font-bold text-xs ${
            isLight ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-amber-400/20 text-amber-300'
          }`}>
            +150 Coins
          </div>
        </div>

        {hasCompletedDaily ? (
          <div className={`w-full py-3.5 min-h-[44px] rounded-xl border text-xs font-black flex items-center justify-center gap-2 ${
            isLight
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>TODAY'S CHALLENGE COMPLETED!</span>
          </div>
        ) : (
          <button
            onClick={handleStartDaily}
            className="w-full py-3.5 min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-red-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START TODAY'S CHALLENGE</span>
          </button>
        )}
      </div>

      <div className={`text-center text-xs font-medium my-2 ${isLight ? 'text-stone-500' : 'text-slate-500'}`}>
        New challenge resets every 24 hours
      </div>
    </div>
  );
};
