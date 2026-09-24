import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, User, Star, Trophy, Flame, Zap, Shield, Edit2, Check, HelpCircle, Info, SlidersHorizontal } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AVATAR_OPTIONS = ['⚡', '🏹', '🦅', '👑', '🚀', '💎', '🐉', '🐱', '🐺', '🔥', '🔮', '🤖'];

export const ProfileModal: React.FC = () => {
  const { progress, setScreen, updateProfile, isLight } = useGame();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(progress.playerName);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(progress.playerAvatar);
  const [playerId, setPlayerId] = useState<string>(auth.currentUser?.uid || '');
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [personalizedAds, setPersonalizedAds] = useState<boolean>(() => localStorage.getItem('snake_rush_personalized_ads') !== 'false');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setPlayerId(user?.uid || '');
    });

    return unsubscribe;
  }, []);

  const totalStars = Object.values(progress.stars).reduce<number>((a, b) => a + (Number(b) || 0), 0);

  const togglePersonalizedAds = () => {
    const nextValue = !personalizedAds;
    setPersonalizedAds(nextValue);
    localStorage.setItem('snake_rush_personalized_ads', String(nextValue));
  };

  const handleSave = async () => {
    soundManager.playTap();
    const playerName = nameInput.trim() || 'ArrowRunner';
    updateProfile(playerName, selectedAvatar);

    const user = auth.currentUser;
    if (user) {
      try {
        const playerRef = doc(db, 'leaderboard', user.uid);
        const playerSnap = await getDoc(playerRef);
        if (playerSnap.exists()) {
          await setDoc(playerRef, { playerName, playerAvatar: selectedAvatar }, { merge: true });
        } else {
          await setDoc(playerRef, {
            playerId: user.uid,
            playerName,
            playerAvatar: selectedAvatar,
            score: progress.coins,
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Profile sync error:', error);
      }
    }

    setIsEditing(false);
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between px-4 pt-3 pb-20 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between my-2">
        <button
          onClick={() => {
            soundManager.playTap();
            setScreen('home');
          }}
          className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl border font-bold text-xs active:scale-95 transition-all ${
            isLight
              ? 'bg-stone-200/90 hover:bg-stone-300 border-stone-300 text-stone-800'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menu</span>
        </button>

        <h2 className={`text-lg font-black tracking-tight font-heading ${isLight ? 'text-stone-900' : 'text-white'}`}>
          PLAYER PROFILE
        </h2>

        <div className="w-12" />
      </div>

      {/* Main Avatar & Identity Card */}
      <div
        className={`my-2 p-5 rounded-3xl border shadow-xl flex flex-col items-center text-center relative transition-colors ${
          isLight ? 'bg-white border-stone-200' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/30 mb-3">
          {selectedAvatar}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={nameInput}
              maxLength={15}
              onChange={e => setNameInput(e.target.value)}
              className={`px-3 py-2 min-h-[44px] rounded-xl border text-sm font-bold text-center focus:outline-none ${
                isLight
                  ? 'bg-stone-100 border-sky-500 text-stone-900'
                  : 'bg-slate-950 border-sky-500 text-white'
              }`}
            />
            <button
              onClick={handleSave}
              className="p-2 min-h-[44px] min-w-[44px] rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-xl font-black font-heading ${isLight ? 'text-stone-900' : 'text-white'}`}>
              {progress.playerName}
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg ${
                isLight ? 'text-stone-500 hover:text-stone-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-amber-500 font-mono font-bold">🏆 Rank: Snake Master</span>
        </div>

        <div className={`mt-2 px-3 py-1.5 rounded-lg border text-[10px] font-mono max-w-full truncate ${
          isLight ? 'bg-stone-100 border-stone-200 text-stone-600' : 'bg-slate-950/70 border-slate-800 text-slate-400'
        }`} title={playerId || 'Signing in...'}>
          ID: {playerId || 'Signing in...'}
        </div>

        {/* Avatar Picker when editing */}
        {isEditing && (
          <div className={`mt-4 pt-3 border-t w-full ${isLight ? 'border-stone-200' : 'border-slate-800'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
              Choose Avatar
            </span>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-lg transition-all ${
                    selectedAvatar === emoji
                      ? 'bg-sky-500 text-white ring-2 ring-sky-300 scale-110 shadow-md'
                      : isLight
                      ? 'bg-stone-200 hover:bg-stone-300'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lifetime Career Stats Grid */}
      <div className="my-2">
        <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
          Career Statistics
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
            <span className={`text-[10px] font-medium ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>Total Arrows Cleared</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>
              {progress.stats.totalCleared.toLocaleString()}
            </div>
          </div>

          <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
            <span className={`text-[10px] font-medium ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>Stars Earned</span>
            <div className="text-xl font-black font-mono text-amber-500 mt-0.5 flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              <span>{totalStars}</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
            <span className={`text-[10px] font-medium ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>Flawless Solves</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              {progress.stats.perfectRuns}
            </div>
          </div>

          <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
            <span className={`text-[10px] font-medium ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>Emergency Escapes</span>
            <div className={`text-xl font-black font-mono mt-0.5 ${isLight ? 'text-rose-700' : 'text-red-400'}`}>
              {progress.stats.emergencyWins}
            </div>
          </div>
        </div>
      </div>

      {/* Cosmetics Owned Status */}
      <div
        className={`my-2 p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
          isLight ? 'bg-white border-stone-200 text-stone-700 shadow-sm' : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}
      >
        <span className={isLight ? 'text-stone-500 font-medium' : 'text-slate-400'}>Cosmetics Owned:</span>
        <span className={`font-mono font-bold ${isLight ? 'text-indigo-700' : 'text-indigo-300'}`}>
          {progress.unlockedBoards.length} Boards • {progress.unlockedArrows.length} Snakes
        </span>
      </div>

      {/* Help, game information, and privacy controls */}
      <div className="my-2 space-y-2">
        {[
          {
            id: 'help',
            title: 'Help',
            icon: <HelpCircle className="w-4 h-4 text-sky-500" />,
            content: `Snake Rush is a puzzle game where animals are trapped among snakes. Tap the snakes to remove them and rescue the animals.\n\nComplete puzzles in the shortest possible time while managing your available lives.\n\n• Earn Stars and Points by completing puzzles.\n• Use Points to unlock Snakes, Boards and Trails.\n• Stars contribute to your Global Points and Ranking.\n• Check the leaderboard to see your global position.\n• If you face a problem, restart the game and check your internet connection for online features.\n• For bugs or support, use the Feedback/Support option.\n\nHave fun and keep rescuing! 🐍`,
          },
          {
            id: 'about',
            title: 'About Snake Rush',
            icon: <Info className="w-4 h-4 text-emerald-500" />,
            content: `Snake Rush is a puzzle game where you rescue trapped animals by strategically removing snakes.\n\nThink carefully, tap the right snakes, complete puzzles quickly, save your lives, and earn Stars and Points.\n\nUse your Points to unlock different Snakes, Boards and Trails. Collect Stars to increase your Global Points and compete on the global leaderboard.\n\nSnake Rush is designed to be simple to play but challenging to master.\n\nVersion: 1.0.0\n\n© 2026 Harsh. All rights reserved.`,
          },
          {
            id: 'rights',
            title: 'Privacy Rights',
            icon: <Shield className="w-4 h-4 text-amber-500" />,
            content: `Snake Rush respects your privacy.\n\nDepending on the features you use, the game may process information such as your player ID, player name, game progress, scores, Stars, Points, leaderboard information and technical information required to operate the game.\n\nThird-party services such as Firebase and advertising services may process information necessary to provide game, leaderboard, advertising and security features.\n\nYou may have rights to access, correct or delete applicable personal information, subject to applicable laws.\n\nFor privacy questions or data deletion requests, please contact us through the available support option.\n\nFor more information, please review the complete Privacy Policy.`,
          },
        ].map(section => (
          <div
            key={section.id}
            className={`rounded-2xl border ${isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}
          >
            <button
              type="button"
              onClick={() => setOpenInfo(openInfo === section.id ? null : section.id)}
              className="flex w-full min-h-[48px] items-center justify-between px-3.5 text-left text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                {section.icon}
                <span className={isLight ? 'text-stone-900' : 'text-white'}>{section.title}</span>
              </span>
              <span className={isLight ? 'text-stone-500' : 'text-slate-400'}>{openInfo === section.id ? '▲' : '▼'}</span>
            </button>
            {openInfo === section.id && (
              <p className={`border-t px-3.5 py-3 whitespace-pre-wrap text-[11px] leading-relaxed ${isLight ? 'border-stone-200 text-stone-600' : 'border-slate-800 text-slate-300'}`}>
                {section.content}
              </p>
            )}
          </div>
        ))}

        <div className={`rounded-2xl border ${isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
          <button
            type="button"
            onClick={() => setOpenInfo(openInfo === 'preferences' ? null : 'preferences')}
            className="flex w-full min-h-[48px] items-center justify-between px-3.5 text-left text-xs font-bold"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-fuchsia-500" />
              <span className={isLight ? 'text-stone-900' : 'text-white'}>Privacy Preferences</span>
            </span>
            <span className={isLight ? 'text-stone-500' : 'text-slate-400'}>{openInfo === 'preferences' ? '▲' : '▼'}</span>
          </button>
          {openInfo === 'preferences' && (
            <div className={`border-t px-3.5 py-3 ${isLight ? 'border-stone-200' : 'border-slate-800'}`}>
              <p className={`mb-4 whitespace-pre-wrap text-[11px] leading-relaxed ${isLight ? 'text-stone-600' : 'text-slate-300'}`}>
                {`Your privacy matters.\n\nUse this section to review or manage available privacy and advertising choices.\n\nDepending on your location and applicable laws, you may be able to manage choices related to personalized advertising and consent.\n\nChanging your privacy preferences may affect the advertisements shown to you.\n\nSome information may still be processed when necessary for game functionality, security, fraud prevention or legal requirements.\n\nYou can review your available choices here or contact support if you have privacy-related questions.`}
              </p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className={`text-[11px] font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>Personalized ads</div>
                  <div className={`mt-0.5 text-[10px] leading-relaxed ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
                    Allow ads to be more relevant to you.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={togglePersonalizedAds}
                  aria-label="Toggle personalized ads"
                  className={`h-8 w-14 rounded-full p-1 transition-colors ${personalizedAds ? 'bg-emerald-500' : isLight ? 'bg-stone-300' : 'bg-slate-700'}`}
                >
                  <span className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${personalizedAds ? 'translate-x-6' : ''}`} />
                </button>
              </div>
              <p className={`mt-2 text-[10px] leading-relaxed ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
                Your choice is saved on this device and can be changed anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
