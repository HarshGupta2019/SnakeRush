import React, { useEffect, useState } from 'react';
import { SkipForward } from 'lucide-react';

const SPLASH_DURATION_MS = 5000;

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [remainingMs, setRemainingMs] = useState(SPLASH_DURATION_MS);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const nextRemaining = Math.max(0, SPLASH_DURATION_MS - (Date.now() - startedAt));
      setRemainingMs(nextRemaining);
      if (nextRemaining === 0) {
        window.clearInterval(timer);
        onComplete();
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.24),transparent_45%),linear-gradient(145deg,#020617_0%,#0f172a_58%,#064e3b_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:48px_48px]" />

      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M -80 220 C 180 70, 330 410, 570 220 S 970 70, 1180 250 S 1370 410, 1540 170" fill="none" stroke="#10b981" strokeWidth="24" strokeLinecap="round" opacity="0.3" className="background-snake background-snake-one" />
        <path d="M -120 690 C 140 520, 350 820, 590 630 S 930 470, 1150 690 S 1370 820, 1560 590" fill="none" stroke="#38bdf8" strokeWidth="20" strokeLinecap="round" opacity="0.25" className="background-snake background-snake-two" />
        <path d="M 380 -100 C 230 120, 650 190, 450 420 S 300 760, 580 1010" fill="none" stroke="#f59e0b" strokeWidth="16" strokeLinecap="round" opacity="0.22" className="background-snake background-snake-three" />
        <path d="M 1060 -100 C 1260 120, 840 210, 1080 420 S 1240 760, 960 1010" fill="none" stroke="#f472b6" strokeWidth="15" strokeLinecap="round" opacity="0.2" className="background-snake background-snake-four" />
      </svg>

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-300/30 bg-emerald-400/15 text-5xl shadow-xl shadow-emerald-950/50 animate-float">
          🐍
        </div>
        <p className="mt-5 text-[11px] font-black uppercase tracking-[0.4em] text-emerald-300">Animal Rescue</p>
        <h1 className="mt-2 font-heading text-5xl font-black tracking-tight text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text">
          SNAKE RUSH
        </h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Untangle. Rescue. Rise.</p>

        <div className="mt-10 rounded-2xl border border-white/15 bg-slate-950/55 px-5 py-4 shadow-2xl backdrop-blur-sm">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-200 sm:text-base">
            MORE ACCURACY = MORE STARS
          </p>
          <p className="mt-2 text-[11px] font-semibold text-slate-300">Clear fewer snakes, finish faster, and keep your lives.</p>
        </div>

        <div className="mt-12 w-full max-w-xs">
          <div className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Ready to rescue</span>
            <span>{Math.ceil(remainingMs / 1000)}s</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-[width] duration-100"
              style={{ width: `${((SPLASH_DURATION_MS - remainingMs) / SPLASH_DURATION_MS) * 100}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="mt-5 flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-wider text-slate-200 transition-colors hover:bg-white/20 active:scale-95"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </button>
      </div>
    </div>
  );
};
