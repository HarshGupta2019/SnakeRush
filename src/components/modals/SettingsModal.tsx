import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Settings, Volume2, VolumeX, Music, Star, HelpCircle, Shield, Info } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { auth, db } from '../../firebase';
import { signInAnonymously } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const SettingsModal: React.FC = () => {
  const {
    progress,
    setScreen,
    toggleSoundSetting,
    toggleMusicSetting,
    resetAllProgress,
    isLight,
    toggleTheme,
  } = useGame();

  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [isFeedbackSaving, setIsFeedbackSaving] = useState<boolean>(false);

  const handleReset = () => {
    soundManager.playBlockedHit();
    resetAllProgress();
    setConfirmReset(false);
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0 || isFeedbackSaving) return;

    setIsFeedbackSaving(true);
    try {
      const user = auth.currentUser || (await signInAnonymously(auth)).user;
      await addDoc(collection(db, 'feedback'), {
        playerId: user.uid,
        playerName: progress.playerName,
        rating: feedbackRating,
        comment: feedbackComment.trim(),
        createdAt: serverTimestamp(),
      });
      setFeedbackRating(0);
      setFeedbackComment('');
    } catch (error) {
      console.error('Feedback save error:', error);
    } finally {
      setIsFeedbackSaving(false);
    }
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

        <h2
          className={`text-lg font-black tracking-tight font-heading ${
            isLight ? 'text-stone-900' : 'text-white'
          }`}
        >
          SETTINGS
        </h2>

        <div className="w-14" />
      </div>

      {/* Audio & Feedback Controls */}
      <div className="flex flex-col gap-2.5 my-2">
        <span
          className={`text-xs font-bold uppercase tracking-wider block ${
            isLight ? 'text-stone-600' : 'text-slate-400'
          }`}
        >
          Preferences &amp; Theme
        </span>

        {/* Theme Toggle (Dark vs Eye Comfort Light) */}
        <div
          className={`p-3.5 min-h-[56px] rounded-2xl border flex items-center justify-between transition-colors ${
            isLight
              ? 'bg-white border-stone-200 shadow-sm text-stone-900'
              : 'bg-slate-900/90 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-base">
              {isLight ? '☀️' : '🌙'}
            </div>
            <div>
              <div className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Appearance Theme
              </div>
              <div className={`text-[10px] ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                {isLight ? 'Eye Comfort Light Theme' : 'Midnight Dark Theme'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTap();
              toggleTheme();
            }}
            className={`px-3 py-1.5 min-h-[44px] rounded-xl font-bold text-xs border transition-all ${
              isLight
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-800 text-sky-400 border-slate-700'
            }`}
          >
            {isLight ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Sound FX */}
        <div
          className={`p-3.5 min-h-[56px] rounded-2xl border flex items-center justify-between transition-colors ${
            isLight
              ? 'bg-white border-stone-200 shadow-sm text-stone-900'
              : 'bg-slate-900/90 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center">
              {progress.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Sound Effects
              </div>
              <div className={`text-[10px] ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                Snake slithers, whooshes &amp; chimes
              </div>
            </div>
          </div>

          <button
            onClick={toggleSoundSetting}
            className={`w-14 h-8 rounded-full p-1 min-h-[44px] flex items-center transition-colors ${
              progress.soundEnabled ? 'bg-sky-500' : isLight ? 'bg-stone-300' : 'bg-slate-800'
            }`}
            aria-label="Toggle sound"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                progress.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Background Music */}
        <div
          className={`p-3.5 min-h-[56px] rounded-2xl border flex items-center justify-between transition-colors ${
            isLight
              ? 'bg-white border-stone-200 shadow-sm text-stone-900'
              : 'bg-slate-900/90 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Ambient Synth Music
              </div>
              <div className={`text-[10px] ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                Calming procedural background chords
              </div>
            </div>
          </div>

          <button
            onClick={toggleMusicSetting}
            className={`w-14 h-8 rounded-full p-1 min-h-[44px] flex items-center transition-colors ${
              progress.musicEnabled ? 'bg-emerald-500' : isLight ? 'bg-stone-300' : 'bg-slate-800'
            }`}
            aria-label="Toggle music"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                progress.musicEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Feedback */}
        <div
          className={`p-3.5 rounded-2xl border transition-colors ${
            isLight
              ? 'bg-white border-stone-200 shadow-sm text-stone-900'
              : 'bg-slate-900/90 border-slate-800 text-white'
          }`}
        >
          <div className={`text-sm font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
            Game Feedback
          </div>
          <div className="flex items-center gap-1 mt-2" aria-label="Feedback rating">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => setFeedbackRating(rating)}
                className="p-1"
                aria-label={`${rating} star${rating === 1 ? '' : 's'}`}
              >
                <Star
                  className={`w-6 h-6 ${rating <= feedbackRating ? 'text-amber-400 fill-amber-400' : isLight ? 'text-stone-300' : 'text-slate-600'}`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={feedbackComment}
            onChange={event => {
              const words = event.target.value.trim().split(/\s+/).filter(Boolean);
              setFeedbackComment(words.length > 100 ? words.slice(0, 100).join(' ') : event.target.value);
            }}
            placeholder="Write your feedback"
            rows={3}
            className={`mt-2 w-full resize-none rounded-xl border p-2.5 text-xs focus:outline-none ${
              isLight
                ? 'bg-stone-50 border-stone-300 text-stone-900 focus:border-amber-500'
                : 'bg-slate-950 border-slate-700 text-white focus:border-amber-500'
            }`}
            aria-label="Feedback comment"
          />
          <button
            type="button"
            onClick={() => void handleSubmitFeedback()}
            disabled={feedbackRating === 0 || isFeedbackSaving}
            className="mt-2 w-full min-h-[44px] rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFeedbackSaving ? 'SAVING...' : 'SUBMIT FEEDBACK'}
          </button>
        </div>
      </div>

      {/* How To Play Accordion */}
      <div className="my-2">
        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className={`w-full p-3.5 min-h-[48px] rounded-2xl border flex items-center justify-between text-left text-xs font-bold transition-all ${
            isLight
              ? 'bg-white border-stone-200 text-stone-900 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-2 text-sky-500">
            <HelpCircle className="w-4 h-4" />
            <span className={isLight ? 'text-stone-900' : 'text-white'}>How To Play SNAKE RUSH</span>
          </div>
          <span>{showHowToPlay ? '▲' : '▼'}</span>
        </button>

        {showHowToPlay && (
          <div
            className={`p-3.5 mt-1 rounded-2xl border text-xs space-y-2 ${
              isLight
                ? 'bg-white border-stone-200 text-stone-700 shadow-sm'
                : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}
          >
            <p>
              🐍 <strong>Core Mechanic:</strong> Tap a snake to slither in its pointing head direction. A snake can only exit if its forward trajectory has no other snakes blocking it!
            </p>
            <p>
              🚨 <strong>Animal Rescue Mode:</strong> Untangle blocking serpents in the exact sequence to open an escape path for the trapped animal before the countdown hits 0. Wrong taps consume lives!
            </p>
            <p>
              🎨 <strong>Shape Mode:</strong> Untangle every snake sequentially to reveal iconic silhouettes across animals, celestial objects, and fantasy art!
            </p>
          </div>
        )}
      </div>

      {/* Reset Data Section */}
      <div
        className={`my-2 p-3.5 rounded-2xl border flex items-center justify-between ${
          isLight
            ? 'bg-white border-stone-200 text-stone-900 shadow-sm'
            : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div>
          <div className={`text-xs font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
            Reset Saved Progress
          </div>
          <div className={`text-[10px] ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
            Clear levels and coins
          </div>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 min-h-[44px] rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className={`px-3 py-2 min-h-[44px] text-xs font-bold ${
                isLight ? 'text-stone-600' : 'text-slate-400'
              }`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className={`px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-colors ${
              isLight
                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                : 'bg-slate-800 hover:bg-red-950 text-red-400'
            }`}
          >
            Reset
          </button>
        )}
      </div>

      {/* Game Version & Info */}
      <div className={`text-center text-[11px] my-2 ${isLight ? 'text-stone-500 font-medium' : 'text-slate-500'}`}>
        SNAKE RUSH: Untangle &amp; Rescue • v2.0.0
      </div>
    </div>
  );
};
