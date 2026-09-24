import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

// ─────────────────────────────────────────────────────────────────────────────
// Google test IDs — swap for real IDs before releasing to production
// ─────────────────────────────────────────────────────────────────────────────
const TEST_REWARDED_AD_ID = 'ca-app-pub-3940256099942544/5224354917';

// ─────────────────────────────────────────────────────────────────────────────
// Module state — everything is module-scoped so it persists across renders
// without needing React context.
// ─────────────────────────────────────────────────────────────────────────────
let initDone = false;
let initPromise: Promise<void> | null = null;

// Pre-load state
let adLoaded = false;
let adLoading = false;
let adInProgress = false;

// ─────────────────────────────────────────────────────────────────────────────
// Initialize AdMob once at app startup.
// Called from App.tsx useEffect — never called during gameplay.
// ─────────────────────────────────────────────────────────────────────────────
export const initializeAdMob = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  if (initDone) return;
  if (initPromise) { await initPromise; return; }

  initPromise = (async () => {
    try {
      await AdMob.initialize({ initializeForTesting: true });
      initDone = true;
      // Pre-load first rewarded ad immediately after init, off the main call
      void preloadRewardedAd();
    } catch (e) {
      console.error('[AdMob] init error:', e);
      initPromise = null; // allow retry
    }
  })();

  await initPromise;
};

// ─────────────────────────────────────────────────────────────────────────────
// Pre-load a rewarded ad in the background.
// Should be called after init and after each ad is dismissed.
// ─────────────────────────────────────────────────────────────────────────────
const preloadRewardedAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  if (adLoaded || adLoading || adInProgress) return;

  adLoading = true;
  adLoaded = false;

  try {
    await AdMob.prepareRewardVideoAd({
      adId: TEST_REWARDED_AD_ID,
      ssv: { customData: 'snake-rush-reward' },
    });
    adLoaded = true;
  } catch (e) {
    console.warn('[AdMob] preload failed:', e);
    adLoaded = false;
    // Retry after 30 seconds
    setTimeout(() => { void preloadRewardedAd(); }, 30_000);
  } finally {
    adLoading = false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Public: check if a rewarded ad is ready to show immediately (no wait).
// Use this to show/hide the "Watch Ad" button in UI.
// ─────────────────────────────────────────────────────────────────────────────
export const isRewardedAdReady = (): boolean => adLoaded && !adInProgress;

// ─────────────────────────────────────────────────────────────────────────────
// Public: show the rewarded ad.
// Returns true ONLY if the player actually earned the reward (watched to end).
// Never throws — all errors are caught and return false.
//
// Performance note: Because the ad is pre-loaded, the call is instant —
// no network wait visible to the player. The game is frozen behind the native
// ad overlay so there is zero impact on the game loop.
// ─────────────────────────────────────────────────────────────────────────────
export const showSnakeRewardedAd = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;
  if (adInProgress) return false;

  // If not pre-loaded yet, try to load now (with visible delay)
  if (!adLoaded) {
    await preloadRewardedAd();
    if (!adLoaded) return false; // couldn't get an ad
  }

  adInProgress = true;
  adLoaded = false; // consumed
  let rewardGranted = false;

  // The native SDK fires this event when the player actually earns the reward.
  // Simply returning from showRewardVideoAd() is NOT enough — the player
  // could have closed the ad early.
  let rewardListener: { remove: () => void } | null = null;

  try {
    rewardListener = await AdMob.addListener(
      RewardAdPluginEvents.Rewarded,
      () => { rewardGranted = true; },
    );

    await AdMob.showRewardVideoAd();
    return rewardGranted;
  } catch (e) {
    console.warn('[AdMob] show error:', e);
    return false;
  } finally {
    rewardListener?.remove();
    adInProgress = false;
    // Pre-load the next ad in the background without blocking the caller
    void preloadRewardedAd();
  }
};
