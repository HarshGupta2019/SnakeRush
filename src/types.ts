export type GameMode = 'emergency' | 'shape';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'up-right' | 'up-left' | 'down-right' | 'down-left';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane';

export type ScreenType = 
  | 'home'
  | 'mode_select'
  | 'shape_category'
  | 'level_select'
  | 'game'
  | 'shop'
  | 'daily'
  | 'achievements'
  | 'leaderboard'
  | 'profile'
  | 'settings';

export interface ArrowPoint {
  x: number;
  y: number;
}

export interface ArrowItem {
  id: string;
  x: number; // Head X coordinate
  y: number; // Head Y coordinate
  points: ArrowPoint[]; // Polyline vertices from tail to head
  dir: Direction; // Direction the arrowhead is pointing
  isEmergency?: boolean;
  rescueAnimal?: RescueAnimal;
  colorKey?: string;
  isObstacle?: boolean;
  length?: number;
}

export interface FlyingArrow {
  id: string;
  startX: number;
  startY: number;
  dir: Direction;
  isEmergency?: boolean;
  skinId: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface RescueTierConfig {
  tierNumber: number;
  tierName: string;
  dangerBadge: string;
  badgeColor: string;
  gridW: number;
  gridH: number;
  targetSnakes: number;
  minBlockersOnRay: number;
  minRescueStep: number;
  maxSnakeLength: number;
  timeLimit: number;
  difficulty: Difficulty;
  description: string;
}

export interface RescueAnimal {
  id: string;
  name: string;
  species: string;
  emoji: string;
  quote?: string;
  color?: string;
  tierNumber?: number;
  tierName?: string;
  dangerBadge?: string;
  badgeColor?: string;
}

export interface PuzzleLevel {
  id: number;
  mode: GameMode;
  name: string;
  category?: string;
  categoryName?: string;
  gridWidth: number;
  gridHeight: number;
  arrows: ArrowItem[];
  timeLimit: number; // in seconds (for emergency mode)
  difficulty: Difficulty;
  shapeDescription?: string;
  shapeIcon?: string;
  hint?: string;
  rescueAnimal?: RescueAnimal;
  rescueAnimals?: RescueAnimal[];
  tierNumber?: number;
  tierName?: string;
  dangerBadge?: string;
  badgeColor?: string;
  targetSnakes?: number;
  rescueStep?: number;
}

export interface ShapeCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  levelStart: number;
  levelEnd: number;
  gradient: string;
}

export interface BoardTheme {
  id: string;
  name: string;
  price: number;
  description: string;
  bgGradient: string;
  boardBg: string;
  gridColor: string;
  borderColor: string;
  accentColor: string;
  previewColor: string;
  tag?: string;
  isLight?: boolean;
}

export type SnakeStyle =
  | 'garter'
  | 'python'
  | 'cobra'
  | 'viper'
  | 'adder'
  | 'dragon'
  | 'cyber'
  | 'void'
  | 'electric'
  | 'lightning'
  | 'ocean'
  | 'rainbow'
  | 'albino'
  | 'toxic'
  | 'magma'
  | 'frost'
  | 'celestial'
  | 'basilisk'
  | 'bone'
  | 'gummy'
  | 'desert'
  | 'sakura'
  | 'anaconda'
  | 'coral'
  | 'shadow'
  | 'phoenix'
  | 'cyclops'
  | 'steampunk'
  | 'cactus';

export type SnakePatternType =
  | 'scales'
  | 'diamonds'
  | 'stripes'
  | 'rings'
  | 'cyber'
  | 'flames'
  | 'spots'
  | 'spikes'
  | 'bones'
  | 'stars'
  | 'keels'
  | 'petals'
  | 'gears'
  | 'thorns';

export type SnakeBiome =
  | 'jungle'
  | 'volcano'
  | 'cyber'
  | 'arctic'
  | 'desert'
  | 'temple'
  | 'cosmic'
  | 'ocean'
  | 'sakura'
  | 'toxic'
  | 'candy'
  | 'abyss'
  | 'swamp'
  | 'steampunk';

export interface ArrowSkin {
  id: string;
  name: string;
  price: number;
  description: string;
  bodyGradient: string;
  glowColor: string;
  iconColor: string;
  accentColor: string;
  secondaryColor?: string;
  previewColor: string;
  tag?: string;
  snakeStyle?: SnakeStyle;
  headIcon?: string;
  patternType?: SnakePatternType;
  eyeColor?: string;
  tongueColor?: string;
  bgBiome?: SnakeBiome;
  rarity?: 'Starter' | 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  eyeCount?: 1 | 2;
  eyeType?: 'single' | 'normal' | 'visor' | 'hollow' | 'hypnotic';
  bodyThickness?: 'slender' | 'regular' | 'thick' | 'chubby';
  strokeMultiplier?: number;
  unlockType?: 'coins' | 'ads';
  adsRequired?: number;
}

export type SnakeBreed = ArrowSkin;

export interface TrailVfx {
  id: string;
  name: string;
  price: number;
  description: string;
  particleColors: string[];
  type: 'sparks' | 'nebula' | 'fire' | 'frost' | 'rainbow' | 'blossom' | 'lightning' | 'bubbles' | 'gold' | 'hearts';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  icon: string;
  category: 'progress' | 'emergency' | 'shape' | 'cosmetics' | 'mastery';
  isUnlocked: (stats: UserStats, userProgress: UserProgress) => boolean;
}

export interface UserStats {
  totalCleared: number;
  perfectRuns: number;
  emergencyWins: number;
  shapeWins: number;
  hintsUsed: number;
  noMistakeRuns: number;
  fastestEmergencyEscape: number; // in seconds remaining
}

export interface UserProgress {
  coins: number;
  currentEmergencyLevel: number;
  currentShapeLevel: number;
  unlockedBoards: string[];
  unlockedArrows: string[];
  unlockedTrails: string[];
  selectedBoard: string;
  selectedArrow: string;
  selectedTrail: string;
  stars: Record<string, number>; // levelKey -> 1..3
  highScores: Record<string, number>;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  dailyStreak: number;
  lastDailyDate: string;
  dailyCompletedToday: boolean;
  hintsCount: number;
  freezesCount: number;
  healthRestoresCount: number;
  claimedAchievements: string[];
  stats: UserStats;
  playerName: string;
  playerAvatar: string;
  hasRemovedAds: boolean;
  snakeAdProgress?: Record<string, number>;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  mode: GameMode;
  stars: number;
  badge?: string;
  isUser?: boolean;
}
