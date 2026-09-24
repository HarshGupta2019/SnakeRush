import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Sparkles } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { initializeAdMob } from '../../utils/admob';

const TEST_BANNER_AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111';

// ─────────────────────────────────────────────────────────────────────────────
// DIAGNOSTIC: mirrors the flag in admob.ts — skips all native banner calls.
// Flip both flags together to re-enable AdMob.
// ─────────────────────────────────────────────────────────────────────────────
const ADMOB_DISABLED = false;

let bannerUsers = 0;
let bannerRequestId = 0;
let bannerOperation: Promise<void> = Promise.resolve();
let bannerRemovalTimer: ReturnType<typeof setTimeout> | null = null;

const queueBannerOperation = (operation: () => Promise<void>) => {
  bannerOperation = bannerOperation.then(operation, operation).catch(error => {
    console.error('Banner ad operation error:', error);
  });
  return bannerOperation;
};

interface BannerAdProps {
  slotId?: string;
  className?: string;
  /** Set true when rendering inside the active game screen to skip native call */
  disableDuringGame?: boolean;
}

/**
 * BannerAd Component
 *
 * On native Android: shows a real AdMob banner overlay using margin:0 so Android
 * does NOT resize the WebView (which caused the gameplay stutter/freeze).
 * On web: renders a placeholder div.
 */
export const BannerAd: React.FC<BannerAdProps> = ({
  slotId = 'banner-ad-home',
  className = '',
  disableDuringGame = false,
}) => {
  const { isLight } = useGame();
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    // Skip: not native, AdMob disabled globally, or currently inside the game board
    if (!isNative || ADMOB_DISABLED || disableDuringGame) return;

    const requestId = ++bannerRequestId;
    bannerUsers += 1;
    if (bannerRemovalTimer) {
      clearTimeout(bannerRemovalTimer);
      bannerRemovalTimer = null;
    }

    void queueBannerOperation(async () => {
      if (bannerUsers === 0 || requestId !== bannerRequestId) return;

      await initializeAdMob();
      if (bannerUsers === 0 || requestId !== bannerRequestId) return;

      await AdMob.showBanner({
        adId: TEST_BANNER_AD_UNIT_ID,
        // KEY FIX: Use regular BANNER (not ADAPTIVE_BANNER) with margin:0.
        // ADAPTIVE_BANNER with a margin causes Android to shrink the WebView
        // height, triggering a CSS resize event + React re-render during gameplay.
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      });
    });

    return () => {
      bannerUsers = Math.max(0, bannerUsers - 1);
      if (bannerUsers !== 0 || requestId !== bannerRequestId) return;

      bannerRemovalTimer = setTimeout(() => {
        bannerRemovalTimer = null;
        if (bannerUsers === 0 && requestId === bannerRequestId) {
          void queueBannerOperation(() => AdMob.removeBanner());
        }
      }, 250);
    };
  }, [isNative, disableDuringGame]);

  if (isNative) {
    return <div id={slotId} className={`min-h-[60px] sm:min-h-[68px] w-full ${className}`} aria-label="Advertisement Banner" />;
  }

  return (
    <div
      id={slotId}
      className={`w-full relative overflow-hidden rounded-xl border flex flex-col items-center justify-center p-2.5 min-h-[60px] sm:min-h-[68px] transition-all select-none ${
        isLight
          ? 'bg-stone-100/90 border-dashed border-stone-300 hover:border-stone-400 text-stone-700'
          : 'bg-slate-900/60 border-dashed border-slate-700/80 hover:border-slate-600 text-slate-300'
      } ${className}`}
      aria-label="Advertisement Banner"
    >
      {/* Ad Tag Badge */}
      <div className="absolute top-1 right-2 flex items-center gap-1">
        <span
          className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.2 rounded ${
            isLight
              ? 'bg-stone-200/90 text-stone-600 border border-stone-300'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          AD
        </span>
      </div>

      {/* Banner Placeholder Content */}
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-inner ${
            isLight ? 'bg-amber-100/80 text-amber-700' : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className={`text-xs font-bold leading-tight ${isLight ? 'text-stone-800' : 'text-slate-200'}`}>
            Banner Ad Placement
          </span>
          <span className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
            Ready for Google AdSense / AdMob banner integration
          </span>
        </div>
      </div>
    </div>
  );
};
