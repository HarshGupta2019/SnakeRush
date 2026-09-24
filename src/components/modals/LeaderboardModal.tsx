import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Trophy, Star, Crown, Flame } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../firebase';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  dailyStreak: number;
  score: number;
  weekendScore: number;
  weekendKey: string | null;
  playerId: string;
  updatedAt: Date | null;
  isUser: boolean;
}

export const LeaderboardModal: React.FC = () => {
  const { setScreen, isLight } = useGame();
  const [tab, setTab] = useState<'global' | 'weekly'>('global');
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const isWeekend = [0, 6].includes(new Date().getDay());

  const getWeekendKey = (date: Date) => {
    const saturday = new Date(date);
    if (saturday.getDay() === 0) saturday.setDate(saturday.getDate() - 1);
    return `${saturday.getFullYear()}-${String(saturday.getMonth() + 1).padStart(2, '0')}-${String(saturday.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const leaderboardQuery = query(collection(db, 'leaderboard'), orderBy('stars', 'desc'));
    const unsubscribe = onSnapshot(
      leaderboardQuery,
      snapshot => {
        const entries = snapshot.docs
          .map((entry, index) => {
            const data = entry.data();
            const score = typeof data.stars === 'number' ? data.stars : Number(data.stars);
            const weekendScore = typeof data.weekendStars === 'number' ? data.weekendStars : Number(data.weekendStars);
            const playerId = typeof data.playerId === 'string' ? data.playerId : entry.id;
            const playerName = typeof data.playerName === 'string' && data.playerName.trim()
              ? data.playerName.trim()
              : 'Player';
            const playerAvatar = typeof data.playerAvatar === 'string' && data.playerAvatar.trim()
              ? data.playerAvatar.trim()
              : '⚡';
            const dailyStreak = typeof data.dailyStreak === 'number' ? data.dailyStreak : 1;

            if (!playerId || !Number.isFinite(score)) return null;

            return {
              rank: index + 1,
              name: playerName,
              avatar: playerAvatar,
              dailyStreak,
              score,
              weekendScore: Number.isFinite(weekendScore) ? weekendScore : 0,
              weekendKey: typeof data.weekendKey === 'string' ? data.weekendKey : null,
              playerId,
              updatedAt: data.updatedAt?.toDate?.() || null,
              isUser: playerId === auth.currentUser?.uid,
            };
          })
          .filter((entry): entry is LeaderboardUser => entry !== null);

        setLeaders(entries);
        setIsLoading(false);
        setLoadError(false);
      },
      error => {
        console.error('Leaderboard load error:', error);
        setLoadError(true);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const displayedLeaders = leaders
    .filter(entry => tab === 'global' || (isWeekend && entry.weekendKey === getWeekendKey(new Date())))
    .sort((a, b) => tab === 'global' ? b.score - a.score : b.weekendScore - a.weekendScore)
    .slice(0, tab === 'global' ? 30 : 20)
    .map((entry, index) => ({ ...entry, rank: index + 1, score: tab === 'global' ? entry.score : entry.weekendScore }));

  const userEntry = displayedLeaders.find(entry => entry.isUser);

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
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2
            className={`text-lg font-black tracking-tight font-heading ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}
          >
            LEADERBOARD
          </h2>
        </div>

        <div className="w-14" />
      </div>

      {/* Tabs: Global vs Weekly */}
      <div
        className={`grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl border my-2 transition-colors ${
          isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <button
          onClick={() => {
            soundManager.playTap();
            setTab('global');
          }}
          className={`py-2.5 min-h-[44px] rounded-xl text-xs font-black transition-all ${
            tab === 'global'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
              : isLight
              ? 'text-stone-600 hover:text-stone-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Global Legends
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setTab('weekly');
          }}
          className={`py-2.5 min-h-[44px] rounded-xl text-xs font-black transition-all ${
            tab === 'weekly'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
              : isLight
              ? 'text-stone-600 hover:text-stone-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Weekends Rush
        </button>
      </div>

      {/* User Standing Card */}
      {userEntry && (
        <div
          className={`my-2 p-3.5 rounded-3xl border-2 shadow-xl flex items-center justify-between transition-colors ${
            isLight
              ? 'bg-indigo-50/90 border-indigo-300 text-stone-900'
              : 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border-indigo-500/50 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md">
              #{userEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{userEntry.avatar}</span>
                <span className={`text-sm font-black ${isLight ? 'text-indigo-950' : 'text-white'}`}>
                  {userEntry.name} (You)
                </span>
                {userEntry.dailyStreak > 1 && (
                  <span className={`text-[10px] px-1.5 rounded-full flex items-center gap-0.5 ${isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-500'}`}>
                    <Flame className="w-3 h-3" /> {userEntry.dailyStreak}
                  </span>
                )}
              </div>
              <div className={`mt-0.5 text-[10px] ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                Your real Firebase score
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-1 font-mono font-bold text-sm ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
            <Star className="w-4 h-4 fill-current" />
            <span>{userEntry.score}</span>
          </div>
        </div>
      )}

      {/* Ranks List */}
      <div className="flex flex-col gap-2 my-2">
        {isLoading ? (
          <div className={`p-4 rounded-2xl border text-center text-xs font-bold ${isLight ? 'border-stone-200 text-stone-500' : 'border-slate-800 text-slate-400'}`}>
            Loading real players...
          </div>
        ) : loadError ? (
          <div className={`p-4 rounded-2xl border text-center text-xs font-bold ${isLight ? 'border-red-200 text-red-600' : 'border-red-900 text-red-300'}`}>
            Unable to load leaderboard.
          </div>
        ) : displayedLeaders.length === 0 ? (
          <div className={`p-4 rounded-2xl border text-center text-xs font-bold ${isLight ? 'border-stone-200 text-stone-500' : 'border-slate-800 text-slate-400'}`}>
            {tab === 'weekly' && !isWeekend ? 'Weekends Rush is available on Saturday and Sunday.' : 'No weekend scores yet.'}
          </div>
        ) : displayedLeaders.map(player => {
          const isTop3 = player.rank <= 3;
          const rankColor =
            player.rank === 1
              ? 'from-amber-400 to-yellow-500 text-slate-950'
              : player.rank === 2
              ? 'from-slate-300 to-slate-400 text-slate-950'
              : player.rank === 3
              ? 'from-amber-700 to-yellow-800 text-white'
              : isLight
              ? 'bg-stone-200 text-stone-600'
              : 'bg-slate-800 text-slate-400';

          return (
            <div
              key={player.rank}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                isLight
                  ? 'bg-white border-stone-200 shadow-sm text-stone-900'
                  : isTop3
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md text-white'
                  : 'bg-slate-900/60 border-slate-800/60 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-inner ${
                    isTop3 ? `bg-gradient-to-tr ${rankColor}` : rankColor
                  }`}
                >
                  {player.rank === 1 ? <Crown className="w-4 h-4" /> : `#${player.rank}`}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{player.avatar}</span>
                    <span className={`text-xs font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>
                      {player.name}
                    </span>
                    {player.dailyStreak > 1 && (
                      <span className={`text-[9px] px-1.5 rounded-full flex items-center gap-0.5 ${isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-900/40 text-amber-400'}`}>
                        <Flame className="w-2.5 h-2.5" />{player.dailyStreak}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-1 font-mono font-bold text-xs ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{player.score}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
