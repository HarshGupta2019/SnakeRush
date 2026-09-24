import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ACHIEVEMENTS } from '../../data/achievements';
import { ArrowLeft, Award, Check, Coins, Sparkles, Lock } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const AchievementsModal: React.FC = () => {
  const { progress, setScreen, claimAchievementReward, isLight } = useGame();
  const [filter, setFilter] = useState<string>('all');

  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const totalUnlocked = ACHIEVEMENTS.filter(a => a.isUnlocked(progress.stats, progress)).length;

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
          <Award className="w-5 h-5 text-amber-500" />
          <h2
            className={`text-lg font-black tracking-tight font-heading ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}
          >
            ACHIEVEMENTS
          </h2>
        </div>

        <div
          className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold ${
            isLight
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-slate-900 border-slate-800 text-amber-300'
          }`}
        >
          {totalUnlocked} / {ACHIEVEMENTS.length}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
        {['all', 'emergency', 'shape', 'mastery', 'cosmetics'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              soundManager.playTap();
              setFilter(cat);
            }}
            className={`px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-all ${
              filter === cat
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : isLight
                ? 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-sm'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements List */}
      <div className="flex flex-col gap-2.5 my-2">
        {filteredAchievements.slice(0, 5).map(ach => {
          const isUnlocked = ach.isUnlocked(progress.stats, progress);
          const isClaimed = progress.claimedAchievements.includes(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isClaimed
                  ? isLight
                    ? 'bg-stone-100/80 border-stone-200 opacity-75'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-75'
                  : isUnlocked
                  ? isLight
                    ? 'bg-amber-50/90 border-amber-300 shadow-sm ring-1 ring-amber-400/30'
                    : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                  : isLight
                  ? 'bg-white border-stone-200 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950'
                      : isLight
                      ? 'bg-stone-200 text-stone-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {ach.icon}
                </div>
                <div>
                  <h4 className={`text-xs font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>
                    {ach.title}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                    {ach.description}
                  </p>
                </div>
              </div>

              <div>
                {isClaimed ? (
                  <div
                    className={`px-3 py-1.5 min-h-[44px] rounded-xl text-[10px] font-bold flex items-center gap-1 ${
                      isLight
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>CLAIMED</span>
                  </div>
                ) : isUnlocked ? (
                  <button
                    onClick={() => claimAchievementReward(ach.id)}
                    className="py-2 px-3.5 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <Coins className="w-4 h-4" />
                    <span>+{ach.rewardCoins}</span>
                  </button>
                ) : (
                  <div
                    className={`px-3 py-2 min-h-[44px] rounded-xl text-[10px] font-bold flex items-center gap-1 ${
                      isLight
                        ? 'bg-stone-100 text-stone-400 border border-stone-200'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>+{ach.rewardCoins}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
