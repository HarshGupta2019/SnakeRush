import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ArrowItem, ArrowSkin, Direction, Particle, RescueAnimal } from '../../types';
import { useGame } from '../../context/GameContext';
import { ARROW_SKINS, BOARD_THEMES, TRAIL_VFYS, getDirectionVector, getRotationForDirection } from '../../utils/themes';
import { isArrowFreeable } from '../../utils/levelGenerator';
import { soundManager } from '../../utils/audio';
import { getSnakeBreedVisual } from '../../utils/snakeBreedVisuals';

// Distinct, vibrant color palettes mapped to each of the 24 snake breeds in the shop
const BREED_SKIN_PALETTES: Record<string, string[]> = {
  // Starters
  eye_comfort_arrow: ['#8c6544', '#65a30d', '#a16207', '#4d7c0f', '#78350f', '#84cc16'], // Garden Garter
  classic: ['#38bdf8', '#0ea5e9', '#0284c7', '#2563eb', '#60a5fa', '#0369a1'], // Azure Corn Snake
  crystal: ['#10b981', '#059669', '#34d399', '#047857', '#0d9488', '#14b8a6'], // Emerald Tree Python
  gummy: ['#f43f5e', '#ec4899', '#84cc16', '#06b6d4', '#fbbf24', '#a855f7'], // Gummy Jelly Worm

  // Rare / Epic / Legendary / Mythic
  golden: ['#f59e0b', '#fbbf24', '#d97706', '#eab308', '#ca8a04', '#fde047'], // Royal Sun Cobra
  fire: ['#ea580c', '#f97316', '#dc2626', '#f59e0b', '#ef4444', '#fbbf24'], // Inferno Fire Wyrm
  ice: ['#06b6d4', '#0284c7', '#38bdf8', '#0ea5e9', '#67e8f9', '#2563eb'], // Frost Glacial Drake
  desert: ['#d97706', '#b45309', '#f59e0b', '#78350f', '#92400e', '#facc15'], // Horned Sand Viper
  anaconda: ['#15803d', '#166534', '#14532d', '#16a34a', '#4d7c0f', '#3f6212'], // Amazon Giant Anaconda
  tiger: ['#ea580c', '#d97706', '#f59e0b', '#c2410c', '#b45309', '#f97316'], // Titan Tiger Boa
  neon: ['#ec4899', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'], // Coral Neon Viper
  lightning: ['#eab308', '#facc15', '#fde047', '#f59e0b', '#ca8a04', '#fef08a'], // Thunderbolt Mamba
  albino: ['#f472b6', '#ec4899', '#fb7185', '#fda4af', '#f43f5e', '#f472b6'], // Albino Blossom Boa
  toxic: ['#84cc16', '#65a30d', '#10b981', '#a3e635', '#4ade80', '#22c55e'], // Toxic Biohazard Hydra
  galaxy: ['#8b5cf6', '#a855f7', '#6366f1', '#7c3aed', '#c084fc', '#9333ea'], // Cosmic Void Serpent
  magma: ['#dc2626', '#ea580c', '#f97316', '#b91c1c', '#f59e0b', '#991b1b'], // Molten Magma Wyrm
  robot: ['#38bdf8', '#0ea5e9', '#64748b', '#0284c7', '#06b6d4', '#94a3b8'], // Cyber Mecha Serpent
  ocean: ['#06b6d4', '#0891b2', '#0284c7', '#0369a1', '#22d3ee', '#0c4a6e'], // Deep Sea Leviathan
  bone: ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#f1f5f9'], // Skeleton Bone Naga
  shadow: ['#7c3aed', '#6d28d9', '#8b5cf6', '#4c1d95', '#a855f7', '#581c87'], // Amethyst Shadow Cobra
  basilisk: ['#047857', '#065f46', '#059669', '#10b981', '#047857', '#022c22'], // Emerald Basilisk King
  pharaoh: ['#d97706', '#b45309', '#f59e0b', '#eab308', '#92400e', '#fbbf24'], // Pharaoh Golden Uraeus
  rainbow: ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'], // Prismatic Rainbow Serpent
  phoenix: ['#f59e0b', '#ea580c', '#f97316', '#ef4444', '#fbbf24', '#b45309'], // Solar Phoenix Serpent
};

// Computes snake color honoring the equipped shop skin while maintaining vibrant snake-to-snake variety
const getArrowSnakeColor = (arrow: ArrowItem, index: number, skin: ArrowSkin): string => {
  if (arrow.isEmergency) return '#ef4444';
  const palette = BREED_SKIN_PALETTES[skin.id] || [
    skin.accentColor || '#10b981',
    skin.secondaryColor || '#047857',
    skin.previewColor || '#059669',
  ];
  return palette[index % palette.length];
};

// Computes dynamic thickness honoring the snake breed configuration, snake length & size hierarchy
const getArrowStrokeWidth = (arrow: ArrowItem, baseWidth: number, index: number = 0): number => {
  if (arrow.isEmergency) return 10.5;
  const len = arrow.points?.length || (arrow.length ?? 2);
  // Deterministic size variance: slender (agile racer), standard, heavy (thick constrictor)
  const sizeMod = (index * 7 + (arrow.x * 3 + arrow.y)) % 3;
  const sizeFactor = sizeMod === 0 ? 0.88 : sizeMod === 2 ? 1.14 : 1.0;

  if (len <= 2) return Math.max(7.2, baseWidth * 0.9 * sizeFactor);
  if (len === 3) return baseWidth * sizeFactor;
  return Math.min(18, baseWidth * 1.12 * sizeFactor);
};

interface GameBoardProps {
  levelId: number;
  /** Incremented on every restart/next-level — triggers internal reset without unmounting */
  boardSession: number;
  arrows: ArrowItem[];
  gridWidth: number;
  gridHeight: number;
  isEmergencyMode: boolean;
  /** Boolean: true only when timeLeft <= 10 in emergency mode.
   *  Avoids re-rendering the 300+ SVG element tree every second from the countdown. */
  isUrgentMode: boolean;
  highlightedArrowId: string | null;
  rescueAnimal?: RescueAnimal;
  rescueAnimals?: RescueAnimal[];
  onArrowRemoved: (arrow: ArrowItem, isEmergency: boolean) => void;
  onWrongMove: (arrow: ArrowItem) => void;
}

interface ExitingSnakeState {
  id: string;
  arrow: ArrowItem;
  progress: number; // 0 to 1
  dx: number;
  dy: number;
  headScale: number;
}

interface AnimalEscapeOverlayProps {
  coord: { x: number; y: number; dx: number; dy: number };
  animal: RescueAnimal;
  viewBoxWidth: number;
  viewBoxHeight: number;
  spawnSpark: (svgX: number, svgY: number, color: string) => void;
  onComplete: () => void;
}

const AnimalEscapeOverlay: React.FC<AnimalEscapeOverlayProps> = ({
  coord,
  animal,
  viewBoxWidth,
  viewBoxHeight,
  spawnSpark,
  onComplete,
}) => {
  const [animation, setAnimation] = useState({ progress: 0, pawPrints: [] as { x: number; y: number; id: number }[] });
  const spawnSparkRef = useRef(spawnSpark);
  const onCompleteRef = useRef(onComplete);
  spawnSparkRef.current = spawnSpark;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const duration = 1500;
    const startedAt = performance.now();
    const maxBoardDim = Math.max(viewBoxWidth, viewBoxHeight);
    let lastPawPrintDist = 0;
    let lastRender = -Infinity;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const travelDist = Math.pow(progress, 1.12) * (maxBoardDim * 1.35);
      const curX = coord.x + coord.dx * travelDist;
      const curY = coord.y + coord.dy * travelDist;

      if (travelDist - lastPawPrintDist > 30) {
        lastPawPrintDist = travelDist;
        setAnimation(previous => ({
          progress,
          pawPrints: [
            ...previous.pawPrints,
            { x: curX - coord.dx * 10, y: curY - coord.dy * 10, id: Math.random() },
          ],
        }));
      } else if (now - lastRender >= 32 || progress === 1) {
        lastRender = now;
        setAnimation(previous => ({ ...previous, progress }));
      }

      spawnSparkRef.current(curX - coord.dx * 16, curY - coord.dy * 16, '#10b981');
      if (Math.random() > 0.4) {
        spawnSparkRef.current(curX - coord.dx * 22, curY - coord.dy * 22, '#fbbf24');
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
        completionTimer = setTimeout(() => onCompleteRef.current(), 550);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (completionTimer !== null) clearTimeout(completionTimer);
    };
  }, [coord, viewBoxHeight, viewBoxWidth]);

  const maxBoardDim = Math.max(viewBoxWidth, viewBoxHeight);
  const travelDist = Math.pow(animation.progress, 1.12) * (maxBoardDim * 1.35);
  const curX = coord.x + coord.dx * travelDist;
  const curY = coord.y + coord.dy * travelDist;
  const opacity = animation.progress > 0.92
    ? Math.max(0.2, 1 - (animation.progress - 0.92) / 0.08)
    : 1;
  const trotHop = -Math.abs(Math.sin(animation.progress * Math.PI * 10)) * 9;
  const trotTilt = Math.sin(animation.progress * Math.PI * 10) * 8;

  return (
    <g className="select-none pointer-events-none">
      {animation.pawPrints.map(print => (
        <g key={print.id} transform={`translate(${print.x}, ${print.y})`} opacity="0.85">
          <circle cx="0" cy="0" r="4.2" fill="#10b981" />
          <circle cx="-2.8" cy="-3.5" r="1.8" fill="#6ee7b7" />
          <circle cx="0" cy="-4.8" r="1.8" fill="#6ee7b7" />
          <circle cx="2.8" cy="-3.5" r="1.8" fill="#6ee7b7" />
        </g>
      ))}
      <line
        x1={coord.x}
        y1={coord.y}
        x2={coord.x + coord.dx * maxBoardDim * 1.4}
        y2={coord.y + coord.dy * maxBoardDim * 1.4}
        stroke="#10b981"
        strokeWidth="42"
        strokeLinecap="round"
        opacity={0.25 * opacity}
      />
      <line
        x1={coord.x}
        y1={coord.y}
        x2={coord.x + coord.dx * maxBoardDim * 1.4}
        y2={coord.y + coord.dy * maxBoardDim * 1.4}
        stroke="#34d399"
        strokeWidth="4"
        strokeDasharray="10 8"
        strokeLinecap="round"
        opacity={0.75 * opacity}
      />
      <g transform={`translate(${curX}, ${curY + trotHop})`} style={{ opacity: opacity * 0.95 }}>
        <line x1={-coord.dx * 20} y1={-coord.dy * 20} x2={-coord.dx * 60} y2={-coord.dy * 60} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
        <line x1={-coord.dx * 18 + coord.dy * 14} y1={-coord.dy * 18 - coord.dx * 14} x2={-coord.dx * 48 + coord.dy * 14} y2={-coord.dy * 48 - coord.dx * 14} stroke="#fbbf24" strokeWidth="3.2" strokeLinecap="round" />
        <line x1={-coord.dx * 18 - coord.dy * 14} y1={-coord.dy * 18 + coord.dx * 14} x2={-coord.dx * 48 - coord.dy * 14} y2={-coord.dy * 48 + coord.dx * 14} stroke="#6ee7b7" strokeWidth="3.2" strokeLinecap="round" />
      </g>
      <g transform={`translate(${curX}, ${curY + trotHop}) rotate(${trotTilt})`} style={{ opacity }}>
        <circle cx="0" cy="0" r="30" fill="#064e3b" fillOpacity="0.92" stroke="#34d399" strokeWidth="3.5" className="drop-shadow-xl" />
        <circle cx="0" cy="0" r="35" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" className="animate-spin" style={{ animationDuration: '2s' }} opacity="0.9" />
        <text x="0" y="2" fontSize="34" textAnchor="middle" dominantBaseline="central" className="drop-shadow-[0_4px_14px_rgba(16,185,129,0.95)]">{animal.emoji}</text>
      </g>
    </g>
  );
};

export const GameBoardInner: React.FC<GameBoardProps> = ({
  levelId,
  boardSession,
  arrows,
  gridWidth,
  gridHeight,
  isEmergencyMode,
  isUrgentMode,
  highlightedArrowId,
  rescueAnimal,
  rescueAnimals,
  onArrowRemoved,
  onWrongMove,
}) => {
  const { progress, isLight } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- PERFORMANCE FIX: forceUpdate counter replaces per-frame setState ---
  // Animations update refs directly; this counter is bumped only at animation
  // start/end to trigger a single re-render instead of 30/sec.
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const [blockedArrowId, setBlockedArrowId] = useState<string | null>(null);
  // --- PERFORMANCE FIX: exitingSnakes moved to ref-only (was setState 30x/sec) ---
  const [isAnimalEscaping, setIsAnimalEscaping] = useState(false);
  const [escapingArrowId, setEscapingArrowId] = useState<string | null>(null);
  const [activeEscapingAnimal, setActiveEscapingAnimal] = useState<RescueAnimal | null>(null);
  // --- PERFORMANCE FIX: these are now read from refs during render ---
  const [animalEscapeCoord, setAnimalEscapeCoord] = useState<{
    x: number;
    y: number;
    dx: number;
    dy: number;
  } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isParticleLoopRunningRef = useRef<boolean>(false);
  const particleRafRef = useRef<number | null>(null);
  const escapeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoEscapeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shakeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exitingSnakeRafRef = useRef<number | null>(null);
  const exitingSnakesRef = useRef<ExitingSnakeState[]>([]);
  const exitingSnakeIdsRef = useRef(new Set<string>());
  const isAnimalEscapingRef = useRef(false);
  const escapingArrowRef = useRef<ArrowItem | null>(null);
  const animalEscapeProgressRef = useRef(0);
  const escapePawPrintsRef = useRef<{ x: number; y: number; id: number }[]>([]);
  const hasAnimalArrivedRef = useRef(false);
  const onArrowRemovedRef = useRef(onArrowRemoved);
  const onWrongMoveRef = useRef(onWrongMove);
  onArrowRemovedRef.current = onArrowRemoved;
  onWrongMoveRef.current = onWrongMove;
  // Throttle SVG re-renders during exit animation to ~24fps to avoid jank on complex boards
  const lastSvgUpdateTimeRef = useRef(-Infinity);

  // Reset ALL animation state when level changes OR boardSession increments (restart/next-level).
  // This replaces the old `key` prop unmount/remount cycle that caused white-screen flashes —
  // the component stays mounted; only its internal state is reset in-place.
  useEffect(() => {
    if (escapeTimerRef.current) clearTimeout(escapeTimerRef.current);
    if (autoEscapeTimerRef.current) clearTimeout(autoEscapeTimerRef.current);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    if (exitingSnakeRafRef.current) cancelAnimationFrame(exitingSnakeRafRef.current);
    if (particleRafRef.current) cancelAnimationFrame(particleRafRef.current);
    particlesRef.current = [];
    isParticleLoopRunningRef.current = false;
    exitingSnakeIdsRef.current.clear();
    exitingSnakesRef.current = [];
    exitingSnakeRafRef.current = null;
    isAnimalEscapingRef.current = false;
    setBlockedArrowId(null);
    setIsAnimalEscaping(false);
    setEscapingArrowId(null);
    setActiveEscapingAnimal(null);
    setAnimalEscapeCoord(null);
    forceUpdate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, boardSession]); // ← boardSession added: restart/next-level resets without unmount


  // Clean up timers and animation frames on unmount
  useEffect(() => {
    return () => {
      if (escapeTimerRef.current) clearTimeout(escapeTimerRef.current);
      if (autoEscapeTimerRef.current) clearTimeout(autoEscapeTimerRef.current);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (exitingSnakeRafRef.current) cancelAnimationFrame(exitingSnakeRafRef.current);
      if (particleRafRef.current) cancelAnimationFrame(particleRafRef.current);
      particlesRef.current = [];
      isParticleLoopRunningRef.current = false;
      exitingSnakesRef.current = [];
      exitingSnakeRafRef.current = null;
    };
  }, []);

  // Active theme cosmetics
  const activeBoard = useMemo(
    () => BOARD_THEMES.find(b => b.id === progress.selectedBoard) || BOARD_THEMES[0],
    [progress.selectedBoard],
  );
  const activeSkin = useMemo(
    () => ARROW_SKINS.find(s => s.id === progress.selectedArrow) || ARROW_SKINS[0],
    [progress.selectedArrow],
  );
  const activeTrail = useMemo(
    () => TRAIL_VFYS.find(t => t.id === progress.selectedTrail) || TRAIL_VFYS[0],
    [progress.selectedTrail],
  );
  const activeTrailRef = useRef(activeTrail);
  activeTrailRef.current = activeTrail;

  // Board dimensions for SVG ViewBox
  const CELL_SIZE = 48;
  const PADDING = 34;
  const viewBoxWidth = PADDING * 2 + gridWidth * CELL_SIZE;
  const viewBoxHeight = PADDING * 2 + gridHeight * CELL_SIZE;

  // Converts integer grid coords (gx, gy) to SVG coordinates
  const toSvgCoord = (gx: number, gy: number) => ({
    x: PADDING + gx * CELL_SIZE + CELL_SIZE / 2,
    y: PADDING + gy * CELL_SIZE + CELL_SIZE / 2,
  });

  // Start particle simulation loop on-demand to preserve CPU and battery
  const startParticleLoopIfNeeded = () => {
    if (isParticleLoopRunningRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isParticleLoopRunningRef.current = true;

    const render = () => {
      if (!canvasRef.current) {
        isParticleLoopRunningRef.current = false;
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size * (1 - (p.life / p.maxLife) * 0.4)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Exiting snakes are now animated directly via DOM manipulation in updateExitingSnakes, not drawn on canvas.

      if (particles.length > 0 || exitingSnakesRef.current.length > 0) {
        particleRafRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isParticleLoopRunningRef.current = false;
        particleRafRef.current = null;
      }
    };

    particleRafRef.current = requestAnimationFrame(render);
  };

  // Update canvas size on container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Spawn continuous trailing sparks behind slithering snakes
  const spawnTrailingSpark = (svgX: number, svgY: number, color: string) => {
    if (!containerRef.current || !canvasRef.current) return;
    if (particlesRef.current.length >= 60) return; // Prevent particle accumulation under rapid play
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / viewBoxWidth;
    const scaleY = rect.height / viewBoxHeight;
    const canvasX = svgX * scaleX;
    const canvasY = svgY * scaleY;

    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      particlesRef.current.push({
        id: Math.random(),
        x: canvasX + (Math.random() - 0.5) * 6,
        y: canvasY + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 2.8 + 1.2,
        alpha: 0.85,
        life: 0,
        maxLife: Math.random() * 12 + 8,
      });
    }

    startParticleLoopIfNeeded();
  };

  // Emergency target arrows/locations
  const emergencyArrows = useMemo(() => arrows.filter(a => a.isEmergency), [arrows]);
  const clearEmergencyArrows = useMemo(
    () => emergencyArrows.filter(ea => isArrowFreeable(ea, arrows, gridWidth, gridHeight)),
    [arrows, emergencyArrows, gridWidth, gridHeight],
  );
  const isRouteClear = clearEmergencyArrows.length > 0;

  // Trigger escape for trapped animal (ONLY the animal escapes, no snake!)
  const triggerAnimalEscape = (arrow: ArrowItem) => {
    if (isAnimalEscapingRef.current) return;
    const animal = arrow.rescueAnimal || rescueAnimal || null;
    if (!animal) return;

    isAnimalEscapingRef.current = true;
    escapingArrowRef.current = arrow;
    setIsAnimalEscaping(true);
    setEscapingArrowId(arrow.id);
    setActiveEscapingAnimal(animal);

    const { dx, dy } = getDirectionVector(arrow.dir);
    const headCoord = toSvgCoord(arrow.x, arrow.y);
    setAnimalEscapeCoord({ x: headCoord.x, y: headCoord.y, dx, dy });
    forceUpdate();

    soundManager.playTap();
    soundManager.playArrowLaunch(true);
    soundManager.playArrowExit(4, true);

  };

  // Automatically move the animal to safety as soon as its exit route is clear!
  const clearEmergencyKey = clearEmergencyArrows.map(a => a.id).join(',');
  useEffect(() => {
    if (!isEmergencyMode || clearEmergencyArrows.length === 0 || isAnimalEscaping) return;

    const targetToEscape = clearEmergencyArrows[0];
    if (autoEscapeTimerRef.current) clearTimeout(autoEscapeTimerRef.current);
    autoEscapeTimerRef.current = setTimeout(() => {
      triggerAnimalEscape(targetToEscape);
    }, 120);
    return () => {
      if (autoEscapeTimerRef.current) clearTimeout(autoEscapeTimerRef.current);
    };
  }, [isEmergencyMode, clearEmergencyKey, isAnimalEscaping]);

  // Animation frame for smoothly gliding exiting snakes (stretched) — 60fps delta-time
  const SNAKE_EXIT_DURATION_MS = 520; // total animation time in ms (consistent on all frame rates)
  const updateExitingSnakes = () => {
    let lastFrameTime = -1;
    const updateExits = (now: number) => {
      // Compute delta time; cap at 100ms to avoid huge jumps after tab-switch / sleep
      const dt = lastFrameTime < 0 ? 16 : Math.min(now - lastFrameTime, 100);
      lastFrameTime = now;

      const current = exitingSnakesRef.current;
      if (current.length === 0) {
        exitingSnakeRafRef.current = null;
        return;
      }

      // Spawn trailing sparks for each exiting snake
      // Spawn trailing sparks and update DOM for each exiting snake
      current.forEach(ea => {
        const headCoord = toSvgCoord(ea.arrow.x, ea.arrow.y);
        const easeProgress = Math.pow(ea.progress, 1.2) * (1 + ea.progress * 0.3);
        const maxBoardDim = Math.max(viewBoxWidth, viewBoxHeight);
        const travelDist = easeProgress * maxBoardDim * 1.45;
        const curHeadX = headCoord.x + ea.dx * travelDist;
        const curHeadY = headCoord.y + ea.dy * travelDist;

        let bodyLen = 0;
        if (ea.arrow.points && ea.arrow.points.length > 1) {
          for (let i = 0; i < ea.arrow.points.length - 1; i++) {
            bodyLen += Math.hypot(
              ea.arrow.points[i + 1].x - ea.arrow.points[i].x,
              ea.arrow.points[i + 1].y - ea.arrow.points[i].y
            ) * CELL_SIZE;
          }
        }
        if (bodyLen <= 0) bodyLen = CELL_SIZE * 1.8;
        bodyLen = Math.max(CELL_SIZE * 1.5, Math.min(bodyLen, CELL_SIZE * 3.5));

        const curTailX = curHeadX - ea.dx * bodyLen;
        const curTailY = curHeadY - ea.dy * bodyLen;

        // Directly manipulate the DOM for 60fps SVG animation without React renders
        const opacity = ea.progress > 0.75 ? Math.max(0, 1 - (ea.progress - 0.75) / 0.25) : 1;
        const groupEl = document.getElementById(`exiting-snake-${ea.id}`);
        if (groupEl) groupEl.style.opacity = String(opacity);
        
        const pathD = `M ${curTailX} ${curTailY} L ${curHeadX} ${curHeadY}`;
        
        const bodyShadowEl = document.getElementById(`exiting-snake-body-shadow-${ea.id}`);
        if (bodyShadowEl) bodyShadowEl.setAttribute('d', pathD);
        
        const bodyEl = document.getElementById(`exiting-snake-body-${ea.id}`);
        if (bodyEl) bodyEl.setAttribute('d', pathD);

        const bodyHlEl = document.getElementById(`exiting-snake-body-hl-${ea.id}`);
        if (bodyHlEl) bodyHlEl.setAttribute('d', pathD);
        
        const bodyPatternEl = document.getElementById(`exiting-snake-pattern-${ea.id}`);
        if (bodyPatternEl) bodyPatternEl.setAttribute('d', pathD);

        const headEl = document.getElementById(`exiting-snake-head-${ea.id}`);
        if (headEl) headEl.setAttribute('transform', `translate(${curHeadX}, ${curHeadY}) rotate(${getRotationForDirection(ea.arrow.dir)}) scale(${ea.headScale})`);
        
        const tailEl = document.getElementById(`exiting-snake-tail-${ea.id}`);
        if (tailEl) {
           const tailAngle = Math.atan2(ea.dy, ea.dx) * (180 / Math.PI);
           tailEl.setAttribute('transform', `translate(${curTailX}, ${curTailY}) rotate(${tailAngle}) scale(${ea.headScale * 0.95})`);
        }

        const sparkColor = ea.arrow.isEmergency
          ? '#ef4444'
          : activeTrailRef.current.particleColors[
              Math.floor(Math.random() * activeTrailRef.current.particleColors.length)
            ];
        spawnTrailingSpark(curTailX, curTailY, sparkColor);
      });

      // Advance progress using delta time — speed is frame-rate independent
      const progressStep = dt / SNAKE_EXIT_DURATION_MS;
      const next = current
        .map(ea => ({ ...ea, progress: ea.progress + progressStep }))
        .filter(ea => ea.progress < 1.0);
      exitingSnakesRef.current = next;

      // Ensure particles keep updating
      startParticleLoopIfNeeded();

      if (next.length > 0) {
        exitingSnakeRafRef.current = requestAnimationFrame(updateExits);
      } else {
        exitingSnakeRafRef.current = null;
        // One final React update to clean up state (no exiting snakes left)
        forceUpdate();
      }
    };

    if (exitingSnakeRafRef.current === null) {
      exitingSnakeRafRef.current = requestAnimationFrame(updateExits);
    }
  };

  // Handle Snake Click / Tap
  const handleSnakeTap = (arrow: ArrowItem, e?: React.PointerEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (isAnimalEscapingRef.current || exitingSnakeIdsRef.current.has(arrow.id)) return;

    const freeable = isArrowFreeable(arrow, arrows, gridWidth, gridHeight);

    if (freeable) {
      soundManager.playTap();

      if (arrow.isEmergency) {
        // Direct tap on emergency snake
        triggerAnimalEscape(arrow);
        return;
      }

      // Regular snake exit gliding with stretched body
      const { dx, dy } = getDirectionVector(arrow.dir);
      
      const breedConfig = getSnakeBreedVisual(activeSkin.id);
      const baseStroke = breedConfig.strokeWidth || 9.5;
      let strokeWidth = baseStroke;
      if (arrow.isEmergency) strokeWidth += 1.5;
      const headScale = Math.max(0.85, Math.min(1.35, strokeWidth / 9.5));

      exitingSnakeIdsRef.current.add(arrow.id);
      const nextExitingSnakes = [
        ...exitingSnakesRef.current.filter(existing => existing.id !== arrow.id),
        {
          id: arrow.id,
          arrow,
          progress: 0,
          dx,
          dy,
          headScale,
        },
      ];
      exitingSnakesRef.current = nextExitingSnakes;
      startParticleLoopIfNeeded(); // canvas will draw the exiting snake immediately
      updateExitingSnakes();

      onArrowRemovedRef.current(arrow, !!arrow.isEmergency);
    } else {
      soundManager.playBlockedHit();
      setBlockedArrowId(arrow.id);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => {
        setBlockedArrowId(null);
        shakeTimerRef.current = null;
      }, 400);
      onWrongMoveRef.current(arrow);
    }
  };

  // Helper to build SVG path data string from points
  const buildSvgPath = (points?: { x: number; y: number }[], arrowX?: number, arrowY?: number, dir?: Direction) => {
    if (!points || points.length === 0) {
      if (arrowX !== undefined && arrowY !== undefined && dir) {
        const { dx, dy } = getDirectionVector(dir);
        const head = toSvgCoord(arrowX, arrowY);
        const tailX = head.x - dx * CELL_SIZE * 0.7;
        const tailY = head.y - dy * CELL_SIZE * 0.7;
        return `M ${tailX} ${tailY} L ${head.x} ${head.y}`;
      }
      return '';
    }

    if (points.length === 1 && dir) {
      const { dx, dy } = getDirectionVector(dir);
      const head = toSvgCoord(points[0].x, points[0].y);
      const tailX = head.x - dx * CELL_SIZE * 0.7;
      const tailY = head.y - dy * CELL_SIZE * 0.7;
      return `M ${tailX} ${tailY} L ${head.x} ${head.y}`;
    }

    const svgPoints = points.map(p => toSvgCoord(p.x, p.y));
    let d = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
    for (let i = 1; i < svgPoints.length; i++) {
      d += ` L ${svgPoints[i].x} ${svgPoints[i].y}`;
    }
    return d;
  };

  // Helper to render Snake Head with eyes, tongue, snout, and breed details at SVG coords
  const renderSnakeHeadSvg = (
    svgX: number,
    svgY: number,
    dir: Direction,
    strokeColor: string,
    isEmerg: boolean,
    isBlocked: boolean,
    headScale: number = 1
  ) => {
    const rotation = getRotationForDirection(dir);
    const snakeStyle = activeSkin.snakeStyle || 'python';
    const eyeColor = activeSkin.eyeColor || '#ffffff';
    const tongueColor = isEmerg ? '#ef4444' : activeSkin.tongueColor || '#ef4444';

    return (
      <g transform={`translate(${svgX}, ${svgY}) rotate(${rotation}) scale(${headScale})`}>
        {/* Cobra & Shadow Flared Hood with Ocellus Spots */}
        {(snakeStyle === 'cobra' || snakeStyle === 'shadow') && !isEmerg && (
          <g>
            <path
              d="M -14 -2 C -18 -8, -18 -18, -11 -22 C -4 -25, 4 -25, 11 -22 C 18 -18, 18 -8, 14 -2 Z"
              fill={strokeColor}
              opacity="0.92"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <circle cx="-8" cy="-14" r="2.2" fill="#ffffff" />
            <circle cx="-8" cy="-14" r="1.1" fill="#0f172a" />
            <circle cx="8" cy="-14" r="2.2" fill="#ffffff" />
            <circle cx="8" cy="-14" r="1.1" fill="#0f172a" />
          </g>
        )}

        {/* Dragon Horns/Whiskers */}
        {snakeStyle === 'dragon' && !isEmerg && (
          <path
            d="M -8 2 Q -15 -8 -17 -18 M 8 2 Q 15 -8 17 -18"
            stroke="#f59e0b"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Phoenix Plumed Crest */}
        {snakeStyle === 'phoenix' && !isEmerg && (
          <path
            d="M -6 0 Q -14 -10 -18 -8 Q -12 0 -6 4 M 6 0 Q 14 -10 18 -8 Q 12 0 6 4"
            stroke="#fbbf24"
            strokeWidth="2"
            fill="#ea580c"
          />
        )}

        {/* Frost Icicle Horns */}
        {snakeStyle === 'frost' && !isEmerg && (
          <g>
            <polygon points="-6,-2 -11,-16 -4,-6" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" />
            <polygon points="6,-2 11,-16 4,-6" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" />
          </g>
        )}

        {/* Desert Horned Viper Brow Spikes */}
        {snakeStyle === 'desert' && !isEmerg && (
          <g>
            <polygon points="-6,-2 -9,-11 -3,-5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
            <polygon points="6,-2 9,-11 3,-5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
          </g>
        )}

        {/* Basilisk Crest */}
        {snakeStyle === 'basilisk' && !isEmerg && (
          <path
            d="M -8 -2 L -12 -12 L -5 -8 L 0 -15 L 5 -8 L 12 -12 L 8 -2 Z"
            fill="#047857"
            stroke="#34d399"
            strokeWidth="0.8"
          />
        )}

        {/* Toxic Biohazard Crest */}
        {snakeStyle === 'toxic' && !isEmerg && (
          <g>
            <polygon points="-5,-8 0,-15 5,-8" fill="#a3e635" stroke="#15803d" strokeWidth="0.8" />
            <circle cx="0" cy="-11" r="1.3" fill="#0f172a" />
          </g>
        )}

        {/* Lightning Bolt Crest */}
        {snakeStyle === 'lightning' && !isEmerg && (
          <path
            d="M -4 -4 L -8 -14 L -2 -10 L 0 -16 L 2 -10 L 8 -14 L 4 -4"
            stroke="#facc15"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Ocean Leviathan Dorsal Swimming Crest */}
        {snakeStyle === 'ocean' && !isEmerg && (
          <path
            d="M -7 -2 Q -12 -10 0 -15 Q 12 -10 7 -2"
            fill="#06b6d4"
            stroke="#22d3ee"
            strokeWidth="0.8"
            opacity="0.85"
          />
        )}

        {/* Sakura Blossom Accent */}
        {snakeStyle === 'sakura' && !isEmerg && (
          <circle cx="0" cy="-12" r="3.5" fill="#fda4af" stroke="#ffffff" strokeWidth="0.8" />
        )}

        {/* Forked Snake Tongue (flicking out from snout) */}
        <path
          d="M 0 -13 L 0 -22 M 0 -22 L -3.5 -27 M 0 -22 L 3.5 -27"
          stroke={tongueColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="animate-pulse"
        />

        {/* Main Snake Head Contour */}
        {snakeStyle === 'bone' && !isEmerg ? (
          <g>
            <path
              d="M 0 -14 C 9 -14, 12 -4, 10 5 C 8 11, -8 11, -10 5 C -12 -4, -9 -14, 0 -14 Z"
              fill="#f8fafc"
              stroke="#334155"
              strokeWidth="1.6"
            />
            <ellipse cx="-5" cy="-3" rx="3.2" ry="3.5" fill="#0f172a" />
            <ellipse cx="5" cy="-3" rx="3.2" ry="3.5" fill="#0f172a" />
            <circle cx="-5" cy="-3" r="1.5" fill={eyeColor} />
            <circle cx="5" cy="-3" r="1.5" fill={eyeColor} />
          </g>
        ) : snakeStyle === 'gummy' && !isEmerg ? (
          // Chubby cute rounded cartoon gummy head
          <g>
            <path
              d="M 0 -13 C 11 -13, 14 -3, 12 6 C 9 13, -9 13, -12 6 C -14 -3, -11 -13, 0 -13 Z"
              fill={strokeColor}
              stroke={isBlocked ? '#7f1d1d' : isLight ? '#1e293b' : '#0f172a'}
              strokeWidth="1.6"
            />
            {/* Gloss shine on gummy head */}
            <circle cx="-4" cy="-7" r="2.2" fill="#ffffff" opacity="0.65" />
          </g>
        ) : (
          <path
            d="M 0 -14 C 9 -14, 13 -4, 11 5 C 9 12, -9 12, -11 5 C -13 -4, -9 -14, 0 -14 Z"
            fill={strokeColor}
            stroke={isBlocked ? '#7f1d1d' : isLight ? '#1e293b' : '#0f172a'}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        )}

        {/* Royal Crown on Gilded Cobra */}
        {activeSkin.id === 'golden' && !isEmerg && (
          <polygon
            points="-6,-11 -3,-17 0,-13 3,-17 6,-11"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="0.8"
          />
        )}

        {/* Pharaoh Solar Disc Uraeus */}
        {activeSkin.id === 'pharaoh' && !isEmerg && (
          <g transform="translate(0, -13)">
            <ellipse cx="0" cy="-3" rx="3.5" ry="3.5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
            <path d="M -4 -1 L -7 4 M 4 -1 L 7 4" stroke="#1e40af" strokeWidth="1.2" />
          </g>
        )}

        {/* Cyber Visor on Mecha Snake */}
        {snakeStyle === 'cyber' && !isEmerg ? (
          <line
            x1="-8"
            y1="-3"
            x2="8"
            y2="-3"
            stroke="#38bdf8"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        ) : snakeStyle !== 'bone' ? (
          /* Expressive Snake Eyes with Pupils Looking Forward (Single eye for Cyclops, dual eyes for others) */
          activeSkin.eyeCount === 1 || snakeStyle === 'cyclops' ? (
            <g>
              <circle cx="0" cy="-4" r="4.8" fill="#0f172a" />
              <circle cx="0" cy="-4" r="4" fill={eyeColor} />
              <ellipse cx="0" cy="-4.2" rx="1.6" ry="2.8" fill="#0f172a" />
              <circle cx="-1" cy="-5.2" r="0.9" fill="#ffffff" />
              <circle cx="0" cy="-4" r="4.5" fill="none" stroke="#e879f9" strokeWidth="0.8" opacity="0.8" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <ellipse cx="-5.5" cy="-3" rx="3.2" ry="3.6" fill={eyeColor} />
              <ellipse cx="-5.5" cy="-4.2" rx="1.5" ry="2" fill="#0f172a" />
              <circle cx="-6.2" cy="-5" r="0.8" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="5.5" cy="-3" rx="3.2" ry="3.6" fill={eyeColor} />
              <ellipse cx="5.5" cy="-4.2" rx="1.5" ry="2" fill="#0f172a" />
              <circle cx="4.8" cy="-5" r="0.8" fill="#ffffff" />
            </g>
          )
        ) : null}

        {/* Cactus Desert Bloom */}
        {activeSkin.id === 'cactus' && !isEmerg && (
          <g transform="translate(0, -14)">
            <polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1.8" fill="#ef4444" />
          </g>
        )}

        {/* Steampunk Brass Monocle */}
        {activeSkin.id === 'steampunk' && !isEmerg && (
          <g transform="translate(0, -13)">
            <circle cx="0" cy="0" r="3.5" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1.8" fill="#fbbf24" />
          </g>
        )}

        {/* Snake Snout Nostrils */}
        <circle cx="-2.2" cy="-11" r="0.8" fill="#0f172a" opacity="0.7" />
        <circle cx="2.2" cy="-11" r="0.8" fill="#0f172a" opacity="0.7" />
      </g>
    );
  };

  // Helper to render Distinctive Snake Breed Tail Feature at tail coordinates
  const renderSnakeTail = (
    tailX: number,
    tailY: number,
    prevX: number,
    prevY: number,
    tailType: string,
    strokeColor: string,
    secondaryColor: string,
    isEmerg: boolean,
    sizeScale: number = 1
  ) => {
    if (isEmerg) {
      return (
        <circle
          cx={tailX}
          cy={tailY}
          r="5.5"
          fill="#ef4444"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
      );
    }

    const dx = tailX - prevX;
    const dy = tailY - prevY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
      <g transform={`translate(${tailX}, ${tailY}) rotate(${angle}) scale(${sizeScale})`}>
        {tailType === 'rattle' || tailType === 'desert_rattle' ? (
          <g>
            <ellipse cx="2.5" cy="0" rx="3.4" ry="2.6" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx="6.5" cy="0" rx="3.0" ry="2.2" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx="10" cy="0" rx="2.4" ry="1.7" fill="#92400e" stroke="#78350f" strokeWidth="0.8" />
            <path d="M 12.5 -3.5 Q 15 0 12.5 3.5" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.9" />
          </g>
        ) : tailType === 'flame_plume' || tailType === 'magma_club' ? (
          <g>
            <path
              d="M 0 0 Q 7 -6 13 -2 Q 9 2 15 5 Q 7 4 0 0 Z"
              fill="#ea580c"
              stroke="#facc15"
              strokeWidth="0.9"
            />
            <circle cx="8" cy="1" r="1.5" fill="#fef08a" />
          </g>
        ) : tailType === 'ice_crystal' ? (
          <g>
            <polygon points="0,0 6,-5 12,0 6,5" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="0.8" />
            <circle cx="6" cy="0" r="1.5" fill="#ffffff" />
          </g>
        ) : tailType === 'leaf' ? (
          <g>
            <ellipse cx="4" cy="-2.5" rx="4.2" ry="2" fill="#4ade80" stroke="#15803d" strokeWidth="0.6" transform="rotate(-20 4 -2.5)" />
            <ellipse cx="4" cy="2.5" rx="4.2" ry="2" fill="#22c55e" stroke="#15803d" strokeWidth="0.6" transform="rotate(20 4 2.5)" />
          </g>
        ) : tailType === 'sakura_blossom' ? (
          <g>
            <circle cx="4" cy="0" r="4.2" fill="#f472b6" stroke="#ec4899" strokeWidth="0.6" />
            <circle cx="4" cy="0" r="1.8" fill="#fef08a" />
          </g>
        ) : tailType === 'gummy_drop' ? (
          <g>
            <circle cx="3" cy="0" r="4.8" fill={strokeColor} stroke="#ffffff" strokeWidth="1" opacity="0.95" />
            <circle cx="2" cy="-1.5" r="1.3" fill="#ffffff" opacity="0.8" />
          </g>
        ) : tailType === 'cyber_plug' ? (
          <g>
            <rect x="0" y="-3" width="7" height="6" rx="1.2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <line x1="7" y1="-1.2" x2="9.5" y2="-1.2" stroke="#38bdf8" strokeWidth="1" />
            <line x1="7" y1="1.2" x2="9.5" y2="1.2" stroke="#38bdf8" strokeWidth="1" />
          </g>
        ) : tailType === 'paddle_fin' || tailType === 'scute_fin' ? (
          <path
            d="M 0 0 C 6 -7, 12 -5, 16 0 C 12 5, 6 7, 0 0 Z"
            fill={secondaryColor || strokeColor}
            stroke="#0f172a"
            strokeWidth="0.9"
          />
        ) : tailType === 'toxic_stinger' ? (
          <g>
            <polygon points="0,-2.2 9,0 0,2.2" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.8" />
            <circle cx="9.5" cy="0" r="1.2" fill="#a3e635" />
          </g>
        ) : tailType === 'lightning_bolt' ? (
          <polyline points="0,0 5,-4 3,0 10,-2" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        ) : tailType === 'phoenix_plumage' || tailType === 'rainbow_feathers' ? (
          <g>
            <path d="M 0 0 Q 7 -6 13 -3 Q 9 0 14 3 Q 7 6 0 0 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="11" cy="0" r="1.5" fill="#ef4444" />
          </g>
        ) : tailType === 'comet_tail' || tailType === 'shadow_wisp' ? (
          <g>
            <circle cx="3" cy="0" r="3.2" fill={strokeColor} opacity="0.8" />
            <circle cx="7" cy="0" r="2.0" fill={secondaryColor || strokeColor} opacity="0.6" />
            <circle cx="10" cy="0" r="1.0" fill="#ffffff" opacity="0.5" />
          </g>
        ) : (
          <circle cx="0" cy="0" r="4.2" fill={strokeColor} stroke="#0f172a" strokeWidth="1.2" />
        )}
      </g>
    );
  };

  const renderSnakeHead = (
    hx: number,
    hy: number,
    dir: Direction,
    strokeColor: string,
    isEmerg: boolean,
    isBlocked: boolean,
    headScale: number = 1
  ) => {
    const headCoord = toSvgCoord(hx, hy);
    return renderSnakeHeadSvg(headCoord.x, headCoord.y, dir, strokeColor, isEmerg, isBlocked, headScale);
  };

  return (
    <div className="relative w-full aspect-square max-w-[min(440px,100%,calc(100dvh-200px))] mx-auto my-auto p-1 sm:p-2 flex items-center justify-center">
      {/* Outer Board Frame */}
      <div
        ref={containerRef}
        className={`relative w-full h-full rounded-3xl p-2 border-2 ${activeBoard.boardBg} ${activeBoard.borderColor} transition-all duration-500 ${isAnimalEscaping ? 'overflow-visible' : 'overflow-hidden'} select-none touch-none shadow-2xl flex items-center justify-center`}
        style={{
          boxShadow:
            isEmergencyMode && isUrgentMode
              ? '0 0 45px rgba(239, 68, 68, 0.7), inset 0 0 25px rgba(239, 68, 68, 0.4)'
              : undefined,
        }}
      >
        {/* Dynamic Canvas for Particles & Sparks */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />

        {/* Vector SVG Board for Snake Maze */}
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full relative z-10 select-none overflow-visible"
          style={{ touchAction: 'manipulation' }}
        >
          <defs>
            {/* Subtle Glow Filter for Snakes */}
            <filter id="snake-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Emergency Intense Glow Filter */}
            <filter id="emergency-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            {/* Hint Glow */}
            <filter id="hint-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feFlood floodColor="#fbbf24" floodOpacity="0.9" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Clean Subtle Grid Dots */}
          <g opacity="0.2">
            {Array.from({ length: gridWidth }).map((_, gx) =>
              Array.from({ length: gridHeight }).map((_, gy) => {
                const pt = toSvgCoord(gx, gy);
                return (
                  <circle
                    key={`dot-${gx}-${gy}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="1.5"
                    fill={activeBoard.accentColor || '#94a3b8'}
                  />
                );
              })
            )}
          </g>

          {/* EMERGENCY MODE: Trapped Animal Rescue Pod & Sanctuary Chamber */}
          {isEmergencyMode && (rescueAnimal || (rescueAnimals && rescueAnimals.length > 0)) && (
            <>
              {isAnimalEscaping && animalEscapeCoord && activeEscapingAnimal ? (
                <AnimalEscapeOverlay
                  coord={animalEscapeCoord}
                  animal={activeEscapingAnimal}
                  viewBoxWidth={viewBoxWidth}
                  viewBoxHeight={viewBoxHeight}
                  spawnSpark={spawnTrailingSpark}
                  onComplete={() => {
                    if (escapingArrowRef.current) onArrowRemovedRef.current(escapingArrowRef.current, true);
                    escapingArrowRef.current = null;
                    isAnimalEscapingRef.current = false;
                    setIsAnimalEscaping(false);
                    setEscapingArrowId(null);
                    setActiveEscapingAnimal(null);
                    setAnimalEscapeCoord(null);
                  }}
                />
              ) : null}
              {false && isAnimalEscaping && animalEscapeCoord && (activeEscapingAnimal || rescueAnimal) ? (
                /* ANIMATED RESCUE ANIMAL DASHING SAFELY OFF THE BOARD */
                (() => {
                  const maxBoardDim = Math.max(viewBoxWidth, viewBoxHeight);
                  const travelDist =
                    Math.pow(animalEscapeProgressRef.current, 1.12) * (maxBoardDim * 1.35);
                  const curX = animalEscapeCoord.x + animalEscapeCoord.dx * travelDist;
                  const curY = animalEscapeCoord.y + animalEscapeCoord.dy * travelDist;
                  const opacity =
                    animalEscapeProgressRef.current > 0.92
                      ? Math.max(0.2, 1 - (animalEscapeProgressRef.current - 0.92) / 0.08)
                      : 1;

                  // High-energy trot hop and running tilt
                  const trotHop = -Math.abs(Math.sin(animalEscapeProgressRef.current * Math.PI * 10)) * 9;
                  const trotTilt = Math.sin(animalEscapeProgressRef.current * Math.PI * 10) * 8;

                  return (
                    <g className="select-none pointer-events-none">
                      {/* 0. Glowing Paw Prints Left Behind on Grid Tiles */}
                      {escapePawPrintsRef.current.map(p => (
                        <g key={p.id} transform={`translate(${p.x}, ${p.y})`} opacity="0.85">
                          <circle cx="0" cy="0" r="4.2" fill="#10b981" />
                          <circle cx="-2.8" cy="-3.5" r="1.8" fill="#6ee7b7" />
                          <circle cx="0" cy="-4.8" r="1.8" fill="#6ee7b7" />
                          <circle cx="2.8" cy="-3.5" r="1.8" fill="#6ee7b7" />
                        </g>
                      ))}

                      {/* 1. Luminous Emerald Runway Beam showing the animal's path to freedom */}
                      <line
                        x1={animalEscapeCoord.x}
                        y1={animalEscapeCoord.y}
                        x2={animalEscapeCoord.x + animalEscapeCoord.dx * maxBoardDim * 1.4}
                        y2={animalEscapeCoord.y + animalEscapeCoord.dy * maxBoardDim * 1.4}
                        stroke="#10b981"
                        strokeWidth="42"
                        strokeLinecap="round"
                        opacity={0.25 * opacity}
                      />
                      <line
                        x1={animalEscapeCoord.x}
                        y1={animalEscapeCoord.y}
                        x2={animalEscapeCoord.x + animalEscapeCoord.dx * maxBoardDim * 1.4} 
                        y2={animalEscapeCoord.y + animalEscapeCoord.dy * maxBoardDim * 1.4} 
                        stroke="#34d399"
                        strokeWidth="4"
                        strokeDasharray="10 8"
                        strokeLinecap="round"
                        opacity={0.75 * opacity}
                      />

                      {/* 2. Speed Streaks trailing directly behind the animal */}
                      <g
                        transform={`translate(${curX}, ${curY + trotHop})`}
                        style={{ opacity: opacity * 0.95 }}
                      >
                        <line
                          x1={-animalEscapeCoord.dx * 20}
                          y1={-animalEscapeCoord.dy * 20}
                          x2={-animalEscapeCoord.dx * 60}
                          y2={-animalEscapeCoord.dy * 60}
                          stroke="#10b981"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1={-animalEscapeCoord.dx * 18 + animalEscapeCoord.dy * 14}
                          y1={-animalEscapeCoord.dy * 18 - animalEscapeCoord.dx * 14}
                          x2={-animalEscapeCoord.dx * 48 + animalEscapeCoord.dy * 14}
                          y2={-animalEscapeCoord.dy * 48 - animalEscapeCoord.dx * 14}
                          stroke="#fbbf24"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                        <line
                          x1={-animalEscapeCoord.dx * 18 - animalEscapeCoord.dy * 14}
                          y1={-animalEscapeCoord.dy * 18 + animalEscapeCoord.dx * 14}
                          x2={-animalEscapeCoord.dx * 48 - animalEscapeCoord.dy * 14}
                          y2={-animalEscapeCoord.dy * 48 + animalEscapeCoord.dx * 14}
                          stroke="#6ee7b7"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                      </g>

                      {/* 3. The Rescue Animal Dashing with Joyful Hop, Halo & Badge */}
                      <g
                        transform={`translate(${curX}, ${curY + trotHop}) rotate(${trotTilt})`}
                        style={{ opacity }}
                      >
                        {/* Outer Rescue Glow Shield */}
                        <circle
                          cx="0"
                          cy="0"
                          r="30"
                          fill="#064e3b"
                          fillOpacity="0.92"
                          stroke={hasAnimalArrivedRef.current ? '#fbbf24' : '#34d399'}
                          strokeWidth="3.5"
                          className="drop-shadow-xl"
                        />
                        {/* Shimmering Halo Ring */}
                        <circle
                          cx="0"
                          cy="0"
                          r="35"
                          fill="none"
                          stroke={hasAnimalArrivedRef.current ? '#facc15' : '#10b981'}
                          strokeWidth="2"
                          strokeDasharray="5 3"
                          className="animate-spin"
                          style={{ animationDuration: '2s' }}
                          opacity="0.9"
                        />

                        {/* High-visibility Rescue Animal Emoji */}
                        <text
                          x="0"
                          y="2"
                          fontSize="34"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="drop-shadow-[0_4px_14px_rgba(16,185,129,0.95)]"
                        >
                          {(activeEscapingAnimal || rescueAnimal)?.emoji}
                        </text>

                      </g>
                    </g>
                  );
                })()
              ) : null}

              {/* Trapped Animals Standing on the Board */}
              {emergencyArrows.map((emArrow, emIndex) => {
                if (emArrow.id === escapingArrowId) return null;
                const emAnimal =
                  emArrow.rescueAnimal ||
                  (rescueAnimals && rescueAnimals[emIndex]) ||
                  rescueAnimal;
                if (!emAnimal) return null;

                const headCoord = toSvgCoord(emArrow.x, emArrow.y);
                const isBlocked = blockedArrowId === emArrow.id;
                const rotation = getRotationForDirection(emArrow.dir);
                const isThisRouteClear = isArrowFreeable(
                  emArrow,
                  arrows,
                  gridWidth,
                  gridHeight
                );

                return (
                  <g
                    key={emArrow.id}
                    transform={`translate(${headCoord.x}, ${headCoord.y})`}
                    onPointerDown={e => handleSnakeTap(emArrow, e)}
                    className={`cursor-pointer select-none ${
                      isBlocked ? 'animate-shake' : ''
                    }`}
                  >
                    {/* Touch & Click Hit Area */}
                    <circle cx="0" cy="0" r="32" fill="transparent" pointerEvents="all" />

                    {/* Direction Indicator Pointing to Escape Route */}
                    <g transform={`rotate(${rotation})`}>
                      {/* Runway guideline */}
                      <line
                        x1="0"
                        y1="-20"
                        x2="0"
                        y2="-34"
                        stroke={isThisRouteClear ? '#10b981' : '#ef4444'}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      {/* Arrowhead pointing in the escape direction */}
                      <path
                        d="M -6 -27 L 0 -34 L 6 -27"
                        fill="none"
                        stroke={isThisRouteClear ? '#10b981' : '#ef4444'}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isThisRouteClear ? 'animate-pulse' : 'opacity-70'}
                      />
                    </g>

                    {/* Subtle Status Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r="26"
                      fill="none"
                      stroke={isThisRouteClear ? '#10b981' : '#ef4444'}
                      strokeWidth={isThisRouteClear ? '2.5' : '1.8'}
                      className={isThisRouteClear ? 'opacity-80' : 'opacity-40 animate-pulse'}
                    />

                    {/* Rotating Ring when Route is Clear to Signal Safe Exit */}
                    {isThisRouteClear && (
                      <circle
                        cx="0"
                        cy="0"
                        r="30"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="animate-spin"
                        style={{ animationDuration: '3.5s' }}
                      />
                    )}

                    {/* Standing Animal Pod Base */}
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="#1e1b4b"
                      fillOpacity="0.92"
                      stroke={isThisRouteClear ? '#10b981' : '#ef4444'}
                      strokeWidth="2"
                      className={
                        isThisRouteClear
                          ? 'shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                          : 'shadow-lg'
                      }
                    />

                    {/* Crisp Rescue Animal - Steady, Sharp, No Bouncing */}
                    <text
                      x="0"
                      y="2"
                      fontSize="28"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={
                        isThisRouteClear
                          ? 'drop-shadow-[0_2px_8px_rgba(16,185,129,0.8)]'
                          : 'drop-shadow-[0_2px_8px_rgba(239,68,68,0.7)]'
                      }
                    >
                      {emAnimal.emoji}
                    </text>

                    {/* Floating Prompt when Route is Open */}
                    {isThisRouteClear && (
                      <g transform="translate(0, -32)" className="animate-bounce">
                        <rect
                          x="-32"
                          y="-9"
                          width="64"
                          height="18"
                          rx="9"
                          fill="#10b981"
                          stroke="#ffffff"
                          strokeWidth="1.4"
                          className="drop-shadow-md"
                        />
                        <text
                          x="0"
                          y="1"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          TAP ME! 🐾
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </>
          )}

          {/* Active Snakes */}
          {arrows.map((arrow, arrowIndex) => {
            // Do not make any snake for emergency! Show only the rescue animal!
            if (arrow.isEmergency) return null;

            const isBlocked = blockedArrowId === arrow.id;
            const isHighlighted = highlightedArrowId === arrow.id;
            const isEmerg = !!arrow.isEmergency;

            const pathD = buildSvgPath(arrow.points, arrow.x, arrow.y, arrow.dir);

            // Tail position and preceding coordinate for angle alignment
            let tailCoord = { x: 0, y: 0 };
            let prevCoord = { x: 0, y: 0 };
            if (arrow.points && arrow.points.length > 1) {
              tailCoord = toSvgCoord(arrow.points[0].x, arrow.points[0].y);
              prevCoord = toSvgCoord(arrow.points[1].x, arrow.points[1].y);
            } else {
              const { dx, dy } = getDirectionVector(arrow.dir);
              const h = toSvgCoord(arrow.x, arrow.y);
              tailCoord = { x: h.x - dx * CELL_SIZE * 0.7, y: h.y - dy * CELL_SIZE * 0.7 };
              prevCoord = h;
            }

            // Look up snake breed visual blueprint from equipped shop skin
            const breedConfig = getSnakeBreedVisual(activeSkin.id);
            const baseStroke = breedConfig.strokeWidth || 9.5;
            const tailType = breedConfig.tailType || 'neon_ring';

            // Natural size/thickness variation by breed, length & index
            let strokeWidth = getArrowStrokeWidth(arrow, baseStroke, arrowIndex);
            const headScale = Math.max(0.85, Math.min(1.35, strokeWidth / 9.5));

            // Snake color honoring the equipped skin's vibrant family palette
            let strokeColor = getArrowSnakeColor(arrow, arrowIndex, activeSkin);
            let filterId: string | undefined = undefined;

            if (isBlocked) {
              strokeColor = '#ef4444';
              strokeWidth += 1.5;
            } else if (isEmerg) {
              strokeColor = '#ef4444';
              strokeWidth += 1.5;
              filterId = 'url(#emergency-glow)';
            } else if (isHighlighted) {
              strokeColor = '#fbbf24';
              strokeWidth += 2;
              filterId = 'url(#hint-glow)';
            }

            const patternType = activeSkin.patternType || 'scales';

            return (
              <g
                key={arrow.id}
                    onPointerDown={e => handleSnakeTap(arrow, e)}
                className={`cursor-pointer transition-opacity duration-150 ${
                  isBlocked ? 'animate-shake' : ''
                }`}
                style={{
                  transformOrigin: `${toSvgCoord(arrow.x, arrow.y).x}px ${toSvgCoord(arrow.x, arrow.y).y}px`,
                }}
              >
                {/* Wide Transparent Hit Area for Easy Touch / Click */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="38"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pointerEvents="stroke"
                />

                {/* Distinctive Snake Breed Tail Feature */}
                {renderSnakeTail(
                  tailCoord.x,
                  tailCoord.y,
                  prevCoord.x,
                  prevCoord.y,
                  tailType,
                  strokeColor,
                  activeSkin.secondaryColor || strokeColor,
                  isEmerg,
                  headScale * 0.95
                )}

                {/* Snake Body Outer Contour (Razor-sharp in both Light and Dark themes) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isBlocked ? '#7f1d1d' : isLight ? '#1e293b' : '#0f172a'}
                  strokeWidth={strokeWidth + 2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Snake Body Main Colorful Spine */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={filterId}
                  className="transition-colors duration-150"
                />

                {/* Gummy Snake Translucent Jelly Gloss Sheen */}
                {activeSkin.snakeStyle === 'gummy' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={strokeWidth * 0.35}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.65"
                  />
                )}

                {/* Snake 3D Specular Ridge Highlight for Crisp Depth */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={Math.max(1.2, strokeWidth * 0.18)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isLight ? 0.35 : 0.28}
                />

                {/* Snake Body Scales / Pattern Overlay */}
                {patternType === 'diamonds' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray="2 6"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                )}
                {patternType === 'rings' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#fde047"
                    strokeWidth="6"
                    strokeDasharray="2 8"
                    strokeLinecap="butt"
                    opacity="0.75"
                  />
                )}
                {patternType === 'stripes' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                )}
                {patternType === 'cyber' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="3 5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                )}
                {patternType === 'flames' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="3.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                )}
                {patternType === 'spots' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="5"
                    strokeDasharray="1 7"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                )}
                {patternType === 'spikes' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#e0f2fe"
                    strokeWidth="3.5"
                    strokeDasharray="2 7"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                )}
                {patternType === 'bones' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="6"
                    strokeDasharray="2 5"
                    strokeLinecap="butt"
                    opacity="0.85"
                  />
                )}
                {patternType === 'stars' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#fdf4ff"
                    strokeWidth="2.5"
                    strokeDasharray="1 5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                )}
                {patternType === 'petals' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#fda4af"
                    strokeWidth="3"
                    strokeDasharray="2 6"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                )}
                {patternType === 'keels' && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#a7f3d0"
                    strokeWidth="3"
                    strokeDasharray="3 5"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                )}

            {/* Snake Head with Eyes, Snout, Tongue, and Breed Accessories */}
            {renderSnakeHead(arrow.x, arrow.y, arrow.dir, strokeColor, isEmerg, isBlocked, headScale)}
          </g>
        );
      })}

      {/* EXITING SNAKES (ANIMATED VIA DIRECT DOM FOR 60FPS) */}
      {exitingSnakesRef.current.map((ea) => {
        const arrow = ea.arrow;
        const isEmerg = !!arrow.isEmergency;
        
        const breedConfig = getSnakeBreedVisual(activeSkin.id);
        const baseStroke = breedConfig.strokeWidth || 9.5;
        const tailType = breedConfig.tailType || 'neon_ring';
        const patternType = activeSkin.patternType || 'scales';

        let strokeWidth = baseStroke; 
        const headScale = Math.max(0.85, Math.min(1.35, strokeWidth / 9.5));
        let strokeColor = getArrowSnakeColor(arrow, 0, activeSkin);
        
        if (isEmerg) {
          strokeColor = '#ef4444';
          strokeWidth += 1.5;
        }

        const headCoord = toSvgCoord(arrow.x, arrow.y);
        const curHeadX = headCoord.x;
        const curHeadY = headCoord.y;
        
        let bodyLen = 0;
        if (arrow.points && arrow.points.length > 1) {
          for (let i = 0; i < arrow.points.length - 1; i++) {
            bodyLen += Math.hypot(
              arrow.points[i + 1].x - arrow.points[i].x,
              arrow.points[i + 1].y - arrow.points[i].y
            ) * CELL_SIZE;
          }
        }
        if (bodyLen <= 0) bodyLen = CELL_SIZE * 1.8;
        bodyLen = Math.max(CELL_SIZE * 1.5, Math.min(bodyLen, CELL_SIZE * 3.5));
        
        const curTailX = curHeadX - ea.dx * bodyLen;
        const curTailY = curHeadY - ea.dy * bodyLen;
        const tailAngle = Math.atan2(ea.dy, ea.dx) * (180 / Math.PI);
        const pathD = `M ${curTailX} ${curTailY} L ${curHeadX} ${curHeadY}`;

        return (
          <g
            key={`exiting-${ea.id}`}
            id={`exiting-snake-${ea.id}`}
            className="pointer-events-none drop-shadow-xl"
            style={{ opacity: ea.progress > 0.75 ? Math.max(0, 1 - (ea.progress - 0.75) / 0.25) : 1 }}
          >
            {/* Thick Shadow Base */}
            <path
              id={`exiting-snake-body-shadow-${ea.id}`}
              d={pathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth={strokeWidth + 2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Primary Colored Body */}
            <path
              id={`exiting-snake-body-${ea.id}`}
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Body Highlight / Shine (Glossy Layer) */}
            <path
              id={`exiting-snake-body-hl-${ea.id}`}
              d={pathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth={Math.max(1.2, strokeWidth * 0.18)}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isLight ? 0.35 : 0.28}
            />

            {patternType === 'diamonds' && (
              <path id={`exiting-snake-pattern-${ea.id}`} d={pathD} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" opacity="0.45" />
            )}
            {patternType === 'rings' && (
              <path id={`exiting-snake-pattern-${ea.id}`} d={pathD} fill="none" stroke="#fde047" strokeWidth="6" strokeDasharray="2 8" strokeLinecap="butt" opacity="0.75" />
            )}
            {patternType === 'stripes' && (
              <path id={`exiting-snake-pattern-${ea.id}`} d={pathD} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="4 6" strokeLinecap="round" opacity="0.4" />
            )}
            {patternType === 'cyber' && (
              <path id={`exiting-snake-pattern-${ea.id}`} d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 5" strokeLinecap="round" opacity="0.7" />
            )}
            
            {/* Tail */}
            <g id={`exiting-snake-tail-${ea.id}`} transform={`translate(${curTailX}, ${curTailY}) rotate(${tailAngle}) scale(${headScale * 0.95})`}>
              {renderSnakeTail(0, 0, 0, 0, tailType, strokeColor, activeSkin.secondaryColor || strokeColor, isEmerg, 1)}
            </g>

            {/* Head */}
            <g id={`exiting-snake-head-${ea.id}`} transform={`translate(${curHeadX}, ${curHeadY}) rotate(${getRotationForDirection(arrow.dir)}) scale(${headScale})`}>
              {renderSnakeHeadSvg(0, 0, 'up', strokeColor, isEmerg, false, 1)}
            </g>
          </g>
        );
      })}

    </svg>
      </div>
    </div>
  );
};

const areGameBoardPropsEqual = (previous: GameBoardProps, next: GameBoardProps) =>
  previous.levelId === next.levelId &&
  previous.boardSession === next.boardSession &&
  previous.arrows === next.arrows &&
  previous.gridWidth === next.gridWidth &&
  previous.gridHeight === next.gridHeight &&
  previous.isEmergencyMode === next.isEmergencyMode &&
  previous.isUrgentMode === next.isUrgentMode &&
  previous.highlightedArrowId === next.highlightedArrowId &&
  previous.rescueAnimal === next.rescueAnimal &&
  previous.rescueAnimals === next.rescueAnimals;

export const GameBoard = React.memo(GameBoardInner, areGameBoardPropsEqual);
