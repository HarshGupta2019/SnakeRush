import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { BOARD_THEMES, ARROW_SKINS, TRAIL_VFYS, getRotationForDirection } from '../../utils/themes';
import { ArrowLeft, ShoppingBag, Check, Lock, Sparkles, Coins, Video, Compass, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { SnakeShopVisual } from '../shop/SnakeShopVisual';
import { showSnakeRewardedAd } from '../../utils/admob';

type ShopTab = 'snakes' | 'boards' | 'trails';
type RarityFilter = 'all' | 'starter' | 'rare' | 'epic' | 'legendary';

const ITEMS_PER_PAGE = 10;

export const ShopModal: React.FC = () => {
  const {
    progress,
    setScreen,
    buyBoard,
    buyArrow,
    watchSnakeAd,
    buyTrail,
    equipBoard,
    equipArrow,
    equipTrail,
    isLight,
  } = useGame();

  const [activeTab, setActiveTab] = useState<ShopTab>('snakes');
  const [selectedRarity, setSelectedRarity] = useState<RarityFilter>('all');
  const [previewBoardId, setPreviewBoardId] = useState<string>(progress.selectedBoard);
  const [previewSnakeId, setPreviewSnakeId] = useState<string>(progress.selectedArrow);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const previewBoard = BOARD_THEMES.find(b => b.id === previewBoardId) || BOARD_THEMES[0];
  const previewSnake = ARROW_SKINS.find(s => s.id === previewSnakeId) || ARROW_SKINS[0];

  const filteredSnakes = useMemo(() => {
    if (selectedRarity === 'all') return ARROW_SKINS;
    if (selectedRarity === 'starter') {
      return ARROW_SKINS.filter(s => s.rarity === 'Starter' || s.rarity === 'Common');
    }
    if (selectedRarity === 'rare') {
      return ARROW_SKINS.filter(s => s.rarity === 'Rare');
    }
    if (selectedRarity === 'epic') {
      return ARROW_SKINS.filter(s => s.rarity === 'Epic');
    }
    if (selectedRarity === 'legendary') {
      return ARROW_SKINS.filter(s => s.rarity === 'Legendary' || s.rarity === 'Mythic');
    }
    return ARROW_SKINS;
  }, [selectedRarity]);

  // Dynamic pagination: Page 1 (10), Page 2 (10), Page 3 (5)
  const totalPages = Math.max(1, Math.ceil(filteredSnakes.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedSnakes = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredSnakes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSnakes, validCurrentPage]);

  const starterCount = ARROW_SKINS.filter(s => s.rarity === 'Starter' || s.rarity === 'Common').length;
  const rareCount = ARROW_SKINS.filter(s => s.rarity === 'Rare').length;
  const epicCount = ARROW_SKINS.filter(s => s.rarity === 'Epic').length;
  const legCount = ARROW_SKINS.filter(s => s.rarity === 'Legendary' || s.rarity === 'Mythic').length;

  const isPreviewSnakeUnlocked = progress.unlockedArrows.includes(previewSnake.id);
  const isPreviewSnakeEquipped = progress.selectedArrow === previewSnake.id;
  const canAffordPreviewSnake = progress.coins >= previewSnake.price;
  const isPreviewSnakeAdLocked = previewSnake.unlockType === 'ads';
  const previewSnakeAdsWatched = progress.snakeAdProgress?.[previewSnake.id] || 0;
  const previewSnakeAdsRequired = previewSnake.adsRequired || 10;

  const handleWatchSnakeAd = async (snakeId: string) => {
    const rewardEarned = await showSnakeRewardedAd();
    if (rewardEarned) watchSnakeAd(snakeId);
  };

  return (
    <div className="flex-1 min-h-0 w-full max-w-lg mx-auto flex flex-col justify-between px-3 pt-3 pb-20 overflow-hidden select-none">
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

        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          <h2 className={`text-lg font-black tracking-tight font-heading ${isLight ? 'text-stone-900' : 'text-white'}`}>
            SNAKE SANCTUARY
          </h2>
        </div>

        <div className="w-12" />
      </div>

      {/* 1. Live Interactive Preview Box */}
      <div
        className={`my-2 p-3.5 rounded-3xl border flex flex-col sm:flex-row items-center gap-3.5 shadow-xl transition-colors ${
          isLight ? 'bg-white border-stone-200' : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        {activeTab === 'snakes' ? (
          <div className="w-full sm:w-44 flex-shrink-0">
            <SnakeShopVisual skin={previewSnake} mode="preview" className="h-28 sm:h-28 shadow-inner" />
          </div>
        ) : (
          <div
            className={`w-28 h-28 rounded-2xl p-2 border-2 ${previewBoard.boardBg} ${previewBoard.borderColor} flex items-center justify-center relative shadow-lg overflow-hidden transition-all duration-300 flex-shrink-0`}
          >
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <path
                d="M 20 80 C 20 50, 45 60, 45 35 L 75 35"
                fill="none"
                stroke={previewBoard.accentColor}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="75" cy="35" r="5" fill="#fef08a" />
            </svg>
          </div>
        )}

        <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {activeTab === 'snakes' ? `${previewSnake.rarity} Serpent` : 'Arena Theme'}
            </span>
            {activeTab === 'snakes' && previewSnake.bgBiome && (
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                  isLight ? 'bg-stone-100 text-stone-700 border-stone-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {previewSnake.bgBiome}
              </span>
            )}
          </div>

          <h3 className={`text-base font-black leading-snug font-heading mt-0.5 truncate ${isLight ? 'text-stone-900' : 'text-white'}`}>
            {activeTab === 'snakes'
              ? previewSnake.name
              : activeTab === 'boards'
              ? previewBoard.name
              : 'Trail VFX'}
          </h3>

          <p className={`text-[11px] line-clamp-2 mt-0.5 leading-relaxed ${isLight ? 'text-stone-600' : 'text-slate-300'}`}>
            {activeTab === 'snakes' ? previewSnake.description : previewBoard.description}
          </p>

          {activeTab === 'snakes' && (
            <div className={`flex items-center justify-between mt-2 pt-1 border-t ${isLight ? 'border-stone-200' : 'border-slate-800/80'}`}>
              <div className={`text-[10px] ${isLight ? 'text-stone-500 font-semibold' : 'text-slate-400'}`}>
                Pattern: <span className="text-emerald-500 font-bold capitalize">{previewSnake.patternType || 'Scales'}</span>
              </div>
              {isPreviewSnakeEquipped ? (
                <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> EQUIPPED
                </span>
              ) : isPreviewSnakeUnlocked ? (
                <button
                  onClick={() => equipArrow(previewSnake.id)}
                  className="px-3.5 py-1.5 min-h-[38px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs active:scale-95 transition-all shadow"
                >
                  EQUIP NOW
                </button>
              ) : isPreviewSnakeAdLocked ? (
                <div className="flex w-full items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className={`text-[10px] font-bold ${isLight ? 'text-sky-700' : 'text-sky-300'}`}>
                      {previewSnakeAdsWatched}/{previewSnakeAdsRequired} Ads Watched · {Math.max(0, previewSnakeAdsRequired - previewSnakeAdsWatched)} more
                    </div>
                    <div className={`mt-1 h-1.5 overflow-hidden rounded-full ${isLight ? 'bg-sky-100' : 'bg-slate-800'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${Math.min(100, (previewSnakeAdsWatched / previewSnakeAdsRequired) * 100)}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => void handleWatchSnakeAd(previewSnake.id)}
                    className="min-h-[38px] rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-2.5 text-white shadow active:scale-95"
                    aria-label="Watch rewarded ad"
                  >
                    <Video className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => buyArrow(previewSnake.id, previewSnake.price)}
                  disabled={!canAffordPreviewSnake}
                  className={`px-3.5 py-1.5 min-h-[38px] rounded-lg font-black text-xs flex items-center gap-1 active:scale-95 transition-all ${
                    canAffordPreviewSnake
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow'
                      : isLight
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-3 h-3" />
                  <span>{previewSnake.price} COINS</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Category Navigation Tabs */}
      <div
        className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl border my-1.5 ${
          isLight ? 'bg-stone-200/90 border-stone-300' : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <button
          onClick={() => {
            soundManager.playTap();
            setActiveTab('snakes');
            setCurrentPage(1);
          }}
          className={`py-2.5 min-h-[44px] rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'snakes'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
              : isLight
              ? 'text-stone-600 hover:text-stone-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🐍</span>
          <span>Snakes ({ARROW_SKINS.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setActiveTab('boards');
            setCurrentPage(1);
          }}
          className={`py-2.5 min-h-[44px] rounded-xl text-xs font-black transition-all ${
            activeTab === 'boards'
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
              : isLight
              ? 'text-stone-600 hover:text-stone-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Arenas
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            setActiveTab('trails');
            setCurrentPage(1);
          }}
          className={`py-2.5 min-h-[44px] rounded-xl text-xs font-black transition-all ${
            activeTab === 'trails'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : isLight
              ? 'text-stone-600 hover:text-stone-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Trails
        </button>
      </div>

      {/* Rarity Filter Bar for Snakes Tab */}
      {activeTab === 'snakes' && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar mb-1">
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedRarity('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 min-h-[36px] rounded-xl text-[11px] font-black whitespace-nowrap transition-all ${
              selectedRarity === 'all'
                ? isLight
                  ? 'bg-stone-900 text-white shadow'
                  : 'bg-white text-slate-950 shadow'
                : isLight
                ? 'bg-stone-200 text-stone-700 hover:text-stone-950 border border-stone-300'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Breeds ({ARROW_SKINS.length})
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedRarity('starter');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 min-h-[36px] rounded-xl text-[11px] font-black whitespace-nowrap transition-all ${
              selectedRarity === 'starter'
                ? 'bg-emerald-600 text-white shadow'
                : isLight
                ? 'bg-stone-200 text-stone-700 hover:text-stone-950 border border-stone-300'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Starters ({starterCount})
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedRarity('rare');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 min-h-[36px] rounded-xl text-[11px] font-black whitespace-nowrap transition-all ${
              selectedRarity === 'rare'
                ? 'bg-sky-600 text-white shadow'
                : isLight
                ? 'bg-stone-200 text-stone-700 hover:text-stone-950 border border-stone-300'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Rare ({rareCount})
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedRarity('epic');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 min-h-[36px] rounded-xl text-[11px] font-black whitespace-nowrap transition-all ${
              selectedRarity === 'epic'
                ? 'bg-purple-600 text-white shadow'
                : isLight
                ? 'bg-stone-200 text-stone-700 hover:text-stone-950 border border-stone-300'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Epic ({epicCount})
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              setSelectedRarity('legendary');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 min-h-[36px] rounded-xl text-[11px] font-black whitespace-nowrap transition-all ${
              selectedRarity === 'legendary'
                ? 'bg-amber-500 text-slate-950 shadow'
                : isLight
                ? 'bg-stone-200 text-stone-700 hover:text-stone-950 border border-stone-300'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Legendary &amp; Mythic ({legCount})
          </button>
        </div>
      )}

      {/* Pagination Controls Header (Page 1: 10, Page 2: 10, Page 3: 5) */}
      {activeTab === 'snakes' && totalPages > 1 && (
        <div
          className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-2xl border my-1 ${
            isLight ? 'bg-stone-100/95 border-stone-300' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <button
            onClick={() => {
              soundManager.playTap();
              setCurrentPage(prev => Math.max(1, prev - 1));
            }}
            disabled={validCurrentPage <= 1}
            className={`flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition-all ${
              validCurrentPage <= 1
                ? 'opacity-30 cursor-not-allowed'
                : isLight
                ? 'bg-white hover:bg-stone-200 text-stone-800 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Current Page Indicator */}
          <span className={`text-xs font-black px-2 ${isLight ? 'text-stone-900' : 'text-white'}`}>
            Page {validCurrentPage} of {totalPages}
          </span>

          <button
            onClick={() => {
              soundManager.playTap();
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
            }}
            disabled={validCurrentPage >= totalPages}
            className={`flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition-all ${
              validCurrentPage >= totalPages
                ? 'opacity-30 cursor-not-allowed'
                : isLight
                ? 'bg-white hover:bg-stone-200 text-stone-800 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm'
            }`}
            title="Next Page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Items Grid */}
      <div
        className="my-1 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehaviorY: 'auto',
        }}
      >
        {/* SNAKES TAB */}
        {activeTab === 'snakes' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2.5 pb-2">
              {paginatedSnakes.map(skin => {
                const isUnlocked = progress.unlockedArrows.includes(skin.id);
                const isEquipped = progress.selectedArrow === skin.id;
                const canAfford = progress.coins >= skin.price;
                const isAdLocked = skin.unlockType === 'ads';
                const adsWatched = progress.snakeAdProgress?.[skin.id] || 0;
                const adsRequired = skin.adsRequired || 10;
                const isSelected = previewSnakeId === skin.id;

                return (
                  <div
                    key={skin.id}
                    onClick={() => {
                      setPreviewSnakeId(skin.id);
                      soundManager.playTap();
                    }}
                    className={`relative p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isLight
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/40'
                          : 'border-emerald-400 bg-slate-850 shadow-xl ring-2 ring-emerald-400/50'
                        : isLight
                        ? 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {/* Visual Image of Snake in its Habitat Background */}
                    <div className="w-full h-24 mb-2 rounded-xl overflow-hidden shadow-md">
                      <SnakeShopVisual skin={skin} mode="card" className="h-full" />
                    </div>

                    {/* Snake Details */}
                    <div className="mb-2 px-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs font-black truncate flex-1 ${isLight ? 'text-stone-900' : 'text-white'}`}>{skin.name}</h4>
                        <span className="text-sm flex-shrink-0">{skin.headIcon || '🐍'}</span>
                      </div>
                      <p className={`text-[9.5px] line-clamp-1 mt-0.5 ${isLight ? 'text-stone-500 font-medium' : 'text-slate-400'}`}>{skin.description}</p>
                    </div>

                    {/* Actions */}
                    {isEquipped ? (
                      <div className={`w-full py-2 min-h-[40px] rounded-xl border text-[11px] font-black flex items-center justify-center gap-1 ${
                        isLight
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>EQUIPPED</span>
                      </div>
                    ) : isUnlocked ? (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          equipArrow(skin.id);
                        }}
                        className={`w-full py-2 min-h-[40px] rounded-xl text-[11px] font-black active:scale-95 transition-all shadow ${
                          isLight
                            ? 'bg-stone-800 hover:bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        EQUIP
                      </button>
                    ) : isAdLocked ? (
                          <div>
                            <div className={`mb-1.5 text-center text-[10px] font-bold ${isLight ? 'text-sky-700' : 'text-sky-300'}`}>
                              {adsWatched}/{adsRequired} Ads Watched · {Math.max(0, adsRequired - adsWatched)} more to unlock
                            </div>
                            <div className={`mb-2 h-1.5 overflow-hidden rounded-full ${isLight ? 'bg-sky-100' : 'bg-slate-800'}`}>
                              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${Math.min(100, (adsWatched / adsRequired) * 100)}%` }} />
                            </div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                void handleWatchSnakeAd(skin.id);
                              }}
                              className="w-full py-2 min-h-[40px] rounded-xl text-[11px] font-black flex items-center justify-center gap-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:scale-[1.02] active:scale-95 shadow-sm"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>WATCH REWARDED AD</span>
                            </button>
                          </div>
                    ) : (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          buyArrow(skin.id, skin.price);
                        }}
                        disabled={!canAfford}
                        className={`w-full py-2 min-h-[40px] rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-[1.02] active:scale-95 shadow-sm'
                            : isLight
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{skin.price} Coins</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Pagination Bar */}
            {totalPages > 1 && (
              <div
                className={`flex items-center justify-between gap-1.5 px-3 py-2 rounded-2xl border my-1 ${
                  isLight ? 'bg-stone-100/95 border-stone-300' : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <span className={`text-[11px] font-bold ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
                  Showing {(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredSnakes.length)} of {filteredSnakes.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      soundManager.playTap();
                      setCurrentPage(prev => Math.max(1, prev - 1));
                    }}
                    disabled={validCurrentPage <= 1}
                    className={`p-1.5 rounded-lg border transition-all ${
                      validCurrentPage <= 1
                        ? 'opacity-30 cursor-not-allowed border-transparent'
                        : isLight
                        ? 'bg-white hover:bg-stone-200 border-stone-300 text-stone-800'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    }`}
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className={`text-xs font-black px-2 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                    {validCurrentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => {
                      soundManager.playTap();
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    }}
                    disabled={validCurrentPage >= totalPages}
                    className={`p-1.5 rounded-lg border transition-all ${
                      validCurrentPage >= totalPages
                        ? 'opacity-30 cursor-not-allowed border-transparent'
                        : isLight
                        ? 'bg-white hover:bg-stone-200 border-stone-300 text-stone-800'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    }`}
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOARDS TAB */}
        {activeTab === 'boards' && (
          <div className="grid grid-cols-2 gap-2.5">
            {BOARD_THEMES.map(board => {
              const isUnlocked = progress.unlockedBoards.includes(board.id);
              const isEquipped = progress.selectedBoard === board.id;
              const canAfford = progress.coins >= board.price;

              return (
                <div
                  key={board.id}
                  onClick={() => {
                    setPreviewBoardId(board.id);
                    soundManager.playTap();
                  }}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    previewBoardId === board.id
                      ? isLight
                        ? 'border-sky-600 bg-sky-50/60 shadow-md ring-1 ring-sky-500'
                        : 'border-sky-400 bg-slate-850 shadow-lg ring-1 ring-sky-400'
                      : isLight
                      ? 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  {board.tag && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[9px] font-black tracking-wider">
                      {board.tag}
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl border ${board.boardBg} ${board.borderColor} shadow-inner flex items-center justify-center`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: board.accentColor }} />
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>{board.name}</h4>
                      <p className={`text-[9px] line-clamp-1 ${isLight ? 'text-stone-500 font-medium' : 'text-slate-400'}`}>{board.description}</p>
                    </div>
                  </div>

                  {isEquipped ? (
                    <div className={`w-full py-2 min-h-[40px] rounded-xl border text-[11px] font-black flex items-center justify-center gap-1 ${
                      isLight
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>EQUIPPED</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        equipBoard(board.id);
                      }}
                      className={`w-full py-2 min-h-[40px] rounded-xl text-[11px] font-black active:scale-95 transition-all ${
                        isLight
                          ? 'bg-stone-800 hover:bg-sky-600 text-white'
                          : 'bg-slate-800 hover:bg-sky-600 text-white'
                      }`}
                    >
                      EQUIP
                    </button>
                  ) : (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        buyBoard(board.id, board.price);
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2 min-h-[40px] rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105 active:scale-95 shadow-sm'
                          : isLight
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{board.price} Coins</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TRAILS TAB */}
        {activeTab === 'trails' && (
          <div className="grid grid-cols-2 gap-2.5">
            {TRAIL_VFYS.map(trail => {
              const isUnlocked = progress.unlockedTrails.includes(trail.id);
              const isEquipped = progress.selectedTrail === trail.id;
              const canAfford = progress.coins >= trail.price;

              return (
                <div
                  key={trail.id}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    progress.selectedTrail === trail.id
                      ? isLight
                        ? 'border-amber-600 bg-amber-50/60 shadow-md ring-1 ring-amber-500'
                        : 'border-amber-400 bg-slate-850 shadow-lg ring-1 ring-amber-400'
                      : isLight
                      ? 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-md ${
                      isLight ? 'bg-stone-100 border-stone-200' : 'bg-slate-950 border-white/10'
                    }`}>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>{trail.name}</h4>
                      <p className={`text-[9px] line-clamp-1 ${isLight ? 'text-stone-500 font-medium' : 'text-slate-400'}`}>{trail.description}</p>
                    </div>
                  </div>

                  {isEquipped ? (
                    <div className={`w-full py-2 min-h-[40px] rounded-xl border text-[11px] font-black flex items-center justify-center gap-1 ${
                      isLight
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>EQUIPPED</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => equipTrail(trail.id)}
                      className={`w-full py-2 min-h-[40px] rounded-xl text-[11px] font-black active:scale-95 transition-all ${
                        isLight
                          ? 'bg-stone-800 hover:bg-amber-600 text-white'
                          : 'bg-slate-800 hover:bg-amber-600 text-white'
                      }`}
                    >
                      EQUIP
                    </button>
                  ) : (
                    <button
                      onClick={() => buyTrail(trail.id, trail.price)}
                      disabled={!canAfford}
                      className={`w-full py-2 min-h-[40px] rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105 active:scale-95 shadow-sm'
                          : isLight
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{trail.price} Coins</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Coins Balance Bar */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between ${
          isLight ? 'bg-white border-stone-200 text-stone-800 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className={`text-[10px] block font-semibold ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>Your Coins</span>
            <span className="text-sm font-mono font-black text-amber-500">{progress.coins}</span>
          </div>
        </div>
        <span className={`text-[11px] font-medium ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>Earn coins by untangling snakes!</span>
      </div>
    </div>
  );
};
