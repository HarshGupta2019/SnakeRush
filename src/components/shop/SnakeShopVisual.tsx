import React from 'react';
import { ArrowSkin } from '../../types';
import { getSnakeBreedVisual } from '../../utils/snakeBreedVisuals';

interface SnakeShopVisualProps {
  skin: ArrowSkin;
  mode?: 'card' | 'preview';
  className?: string;
}

export const SnakeShopVisual: React.FC<SnakeShopVisualProps> = ({
  skin,
  mode = 'card',
  className = '',
}) => {
  const isPreview = mode === 'preview';
  const biome = skin.bgBiome || 'jungle';
  const style = skin.snakeStyle || 'python';
  const pattern = skin.patternType || 'scales';
  const accent = skin.accentColor || '#10b981';
  const secondary = skin.secondaryColor || '#047857';
  const eyeColor = skin.eyeColor || '#ffffff';
  const tongueColor = skin.tongueColor || '#ef4444';

  const svgId = `snake-${skin.id}-${mode}`;

  // Unique Environment Backdrop Renderers
  const renderBiomeBackground = () => {
    switch (biome) {
      case 'volcano':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-volcano-sky`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#290804" />
                <stop offset="60%" stopColor="#450a0a" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-volcano-sky)`} />
            {/* Molten Lava Cavern Crags */}
            <path d="M 0 120 L 35 75 L 80 95 L 140 70 L 200 115 L 200 120 Z" fill="#1c1917" />
            <path d="M 10 120 L 45 82 L 75 98 L 135 75 L 190 120 Z" fill="#7f1d1d" opacity="0.6" />
            {/* Glowing Lava River at Bottom */}
            <path d="M 0 105 Q 50 115 100 102 T 200 112 L 200 120 L 0 120 Z" fill="#ea580c" />
            <path d="M 0 110 Q 55 118 105 107 T 200 115 L 200 120 L 0 120 Z" fill="#facc15" opacity="0.8" />
            {/* Floating Smoldering Embers */}
            <circle cx="35" cy="30" r="1.5" fill="#f97316" className="animate-pulse" />
            <circle cx="160" cy="25" r="1.2" fill="#fbbf24" className="animate-pulse" />
            <circle cx="180" cy="55" r="1.5" fill="#ef4444" />
            <circle cx="70" cy="45" r="1" fill="#facc15" />
          </g>
        );

      case 'arctic':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-arctic-sky`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="60%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-arctic-sky)`} />
            {/* Aurora Borealis Light Wave */}
            <path d="M 0 35 Q 50 15 100 30 T 200 20 L 200 45 Q 150 35 100 45 T 0 50 Z" fill="#22d3ee" opacity="0.25" />
            <path d="M 0 25 Q 60 40 120 20 T 200 32 L 200 40 Q 140 25 80 42 T 0 32 Z" fill="#34d399" opacity="0.2" />
            {/* Jagged Frozen Glacier Peaks */}
            <polygon points="0,120 40,65 75,120" fill="#0284c7" opacity="0.5" />
            <polygon points="50,120 110,50 160,120" fill="#bae6fd" opacity="0.4" />
            <polygon points="130,120 175,70 200,120" fill="#38bdf8" opacity="0.6" />
            {/* Ice Ground Shelf */}
            <rect x="0" y="100" width="200" height="20" fill="#e0f2fe" opacity="0.85" />
            {/* Crystalline Sparkles */}
            <circle cx="25" cy="25" r="1.2" fill="#ffffff" />
            <circle cx="170" cy="35" r="1.5" fill="#ffffff" />
            <circle cx="105" cy="15" r="1.8" fill="#e0f2fe" className="animate-pulse" />
          </g>
        );

      case 'cyber':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-cyber-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="70%" stopColor="#091e3a" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-cyber-bg)`} />
            {/* Perspective Neon Grid Floor */}
            <line x1="0" y1="85" x2="200" y2="85" stroke="#0ea5e9" strokeWidth="1" opacity="0.4" />
            <line x1="0" y1="95" x2="200" y2="95" stroke="#0ea5e9" strokeWidth="1.2" opacity="0.6" />
            <line x1="0" y1="107" x2="200" y2="107" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.8" />
            <line x1="100" y1="80" x2="10" y2="120" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
            <line x1="100" y1="80" x2="60" y2="120" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
            <line x1="100" y1="80" x2="100" y2="120" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
            <line x1="100" y1="80" x2="140" y2="120" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
            <line x1="100" y1="80" x2="190" y2="120" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
            {/* Cyber HUD Brackets & Circuit Nodes */}
            <path d="M 15 15 L 25 15 M 15 15 L 15 25" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 185 15 L 175 15 M 185 15 L 185 25" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7" />
            <circle cx="150" cy="30" r="1.5" fill="#38bdf8" />
            <line x1="150" y1="30" x2="180" y2="30" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
          </g>
        );

      case 'temple':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-temple-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-temple-bg)`} />
            {/* Grand Egyptian Temple Pillars */}
            <rect x="18" y="20" width="16" height="100" fill="#b45309" opacity="0.4" />
            <rect x="15" y="16" width="22" height="6" fill="#d97706" opacity="0.7" />
            <rect x="166" y="20" width="16" height="100" fill="#b45309" opacity="0.4" />
            <rect x="163" y="16" width="22" height="6" fill="#d97706" opacity="0.7" />
            {/* Solar Disc Wall Relief */}
            <circle cx="100" cy="35" r="14" fill="#fbbf24" opacity="0.35" />
            <circle cx="100" cy="35" r="18" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            {/* Stone Floor Blocks */}
            <rect x="0" y="102" width="200" height="18" fill="#451a03" />
            <line x1="0" y1="102" x2="200" y2="102" stroke="#d97706" strokeWidth="1.5" opacity="0.6" />
          </g>
        );

      case 'cosmic':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-cosmic-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="40%" stopColor="#3b0764" />
                <stop offset="80%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-cosmic-bg)`} />
            {/* Glowing Astral Nebula Swirls */}
            <ellipse cx="60" cy="40" rx="45" ry="25" fill="#a855f7" opacity="0.25" />
            <ellipse cx="140" cy="70" rx="55" ry="30" fill="#ec4899" opacity="0.2" />
            {/* Distant Ringed Gas Planet */}
            <circle cx="160" cy="30" r="11" fill="#c084fc" opacity="0.7" />
            <ellipse cx="160" cy="30" rx="20" ry="4" fill="none" stroke="#e9d5ff" strokeWidth="1.5" transform="rotate(-15 160 30)" opacity="0.8" />
            {/* Starlight Constellation Dots */}
            <circle cx="20" cy="20" r="1" fill="#ffffff" />
            <circle cx="35" cy="55" r="1.5" fill="#fdf4ff" className="animate-pulse" />
            <circle cx="85" cy="25" r="1.2" fill="#ffffff" />
            <circle cx="115" cy="85" r="1.2" fill="#ffffff" />
            <circle cx="185" cy="80" r="1" fill="#ffffff" />
          </g>
        );

      case 'ocean':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-ocean-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#083344" />
                <stop offset="60%" stopColor="#0e7490" />
                <stop offset="100%" stopColor="#164e63" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-ocean-bg)`} />
            {/* Caustic Sunbeams from Surface */}
            <polygon points="30,0 60,0 80,120 40,120" fill="#67e8f9" opacity="0.12" />
            <polygon points="120,0 150,0 170,120 130,120" fill="#67e8f9" opacity="0.15" />
            {/* Coral Reef Silhouettes on Seabed */}
            <path d="M 0 120 L 15 95 Q 25 105 35 90 L 50 120 Z" fill="#155e75" opacity="0.8" />
            <path d="M 155 120 L 170 85 Q 185 92 195 80 L 200 120 Z" fill="#155e75" opacity="0.8" />
            {/* Rising Air Bubbles */}
            <circle cx="45" cy="40" r="2" fill="#a5f3fc" opacity="0.6" />
            <circle cx="48" cy="25" r="1.5" fill="#a5f3fc" opacity="0.5" />
            <circle cx="165" cy="50" r="2.5" fill="#a5f3fc" opacity="0.6" />
            <circle cx="162" cy="32" r="1.8" fill="#a5f3fc" opacity="0.4" />
          </g>
        );

      case 'desert':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-desert-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c2d12" />
                <stop offset="50%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-desert-bg)`} />
            {/* Blazing Desert Sun */}
            <circle cx="155" cy="35" r="16" fill="#fef08a" opacity="0.85" />
            <circle cx="155" cy="35" r="24" fill="#fef08a" opacity="0.25" />
            {/* Distant Canyon Mesas */}
            <polygon points="0,95 25,75 55,75 80,95" fill="#9a3412" opacity="0.7" />
            {/* Sweeping Golden Sand Dunes */}
            <path d="M 0 85 Q 70 65 140 90 T 200 80 L 200 120 L 0 120 Z" fill="#d97706" />
            <path d="M 0 100 Q 60 115 130 98 T 200 108 L 200 120 L 0 120 Z" fill="#b45309" />
          </g>
        );

      case 'sakura':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-sakura-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="50%" stopColor="#831843" />
                <stop offset="100%" stopColor="#fda4af" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-sakura-bg)`} />
            {/* Silhouette of Sacred Mountain Fuji */}
            <polygon points="40,110 100,50 160,110" fill="#500724" opacity="0.5" />
            <polygon points="85,65 100,50 115,65" fill="#fbcfe8" opacity="0.8" />
            {/* Gentle Floating Cherry Blossom Petals */}
            <ellipse cx="25" cy="35" rx="3" ry="1.8" fill="#f472b6" transform="rotate(25 25 35)" />
            <ellipse cx="65" cy="20" rx="3.5" ry="2" fill="#fbcfe8" transform="rotate(-30 65 20)" />
            <ellipse cx="145" cy="40" rx="3" ry="1.5" fill="#f472b6" transform="rotate(45 145 40)" />
            <ellipse cx="175" cy="70" rx="3.2" ry="1.8" fill="#fda4af" transform="rotate(-15 175 70)" />
            {/* Zen Stone Garden Ground */}
            <rect x="0" y="102" width="200" height="18" fill="#374151" opacity="0.7" />
          </g>
        );

      case 'toxic':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-toxic-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#052e16" />
                <stop offset="60%" stopColor="#14532d" />
                <stop offset="100%" stopColor="#1e3a1f" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-toxic-bg)`} />
            {/* Industrial Hazard Pipes */}
            <rect x="20" y="0" width="14" height="60" fill="#334155" opacity="0.7" />
            <rect x="160" y="0" width="14" height="70" fill="#334155" opacity="0.7" />
            {/* Bubbling Glowing Biohazard Acid Vat */}
            <path d="M 0 95 Q 50 88 100 96 T 200 90 L 200 120 L 0 120 Z" fill="#4d7c0f" />
            <path d="M 0 105 Q 60 100 120 108 T 200 102 L 200 120 L 0 120 Z" fill="#84cc16" opacity="0.9" />
            {/* Acid Bubbles */}
            <circle cx="50" cy="85" r="3.5" fill="#a3e635" opacity="0.8" />
            <circle cx="130" cy="88" r="2.5" fill="#bef264" opacity="0.8" />
            <circle cx="85" cy="75" r="1.8" fill="#a3e635" opacity="0.6" />
          </g>
        );

      case 'candy':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-candy-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#701a75" />
                <stop offset="50%" stopColor="#be185d" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-candy-bg)`} />
            {/* Marshmallow Dream Clouds */}
            <circle cx="40" cy="35" r="18" fill="#fdf2f8" opacity="0.4" />
            <circle cx="60" cy="30" r="22" fill="#fdf2f8" opacity="0.5" />
            <circle cx="80" cy="38" r="16" fill="#fdf2f8" opacity="0.4" />
            {/* Swirly Candy Mountains */}
            <path d="M 0 120 L 30 75 Q 55 60 80 85 L 120 120 Z" fill="#ec4899" opacity="0.6" />
            <path d="M 90 120 L 135 68 Q 160 55 185 80 L 200 120 Z" fill="#8b5cf6" opacity="0.6" />
            {/* Sugar Ground Strip */}
            <rect x="0" y="104" width="200" height="16" fill="#fbcfe8" />
            <line x1="0" y1="104" x2="200" y2="104" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 4" />
          </g>
        );

      case 'abyss':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-abyss-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#030712" />
                <stop offset="60%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-abyss-bg)`} />
            {/* Glowing Amethyst Crystal Formations */}
            <polygon points="20,120 28,65 36,120" fill="#7c3aed" opacity="0.75" />
            <polygon points="32,120 42,75 52,120" fill="#a855f7" opacity="0.6" />
            <polygon points="160,120 172,60 184,120" fill="#9333ea" opacity="0.7" />
            <polygon points="150,120 158,80 166,120" fill="#c084fc" opacity="0.5" />
            {/* Ethereal Phantom Wisps */}
            <path d="M 30 40 Q 60 25 100 45 T 180 35" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 6" />
          </g>
        );

      case 'swamp':
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-swamp-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="60%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-swamp-bg)`} />
            {/* Murky Marsh Roots & Mangroves */}
            <path d="M 10 120 Q 30 70 20 20 M 15 65 Q 40 85 45 120" stroke="#065f46" strokeWidth="3" fill="none" opacity="0.7" />
            <path d="M 190 120 Q 170 70 180 20 M 175 65 Q 160 85 155 120" stroke="#065f46" strokeWidth="3" fill="none" opacity="0.7" />
            {/* Murky Waters */}
            <rect x="0" y="100" width="200" height="20" fill="#047857" opacity="0.6" />
            {/* Glowing Firefly Orbs */}
            <circle cx="50" cy="45" r="2" fill="#fef08a" className="animate-pulse" />
            <circle cx="140" cy="35" r="1.8" fill="#bef264" className="animate-pulse" />
            <circle cx="110" cy="60" r="1.2" fill="#a7f3d0" />
          </g>
        );

      case 'jungle':
      case 'steampunk':
        if (biome === 'steampunk') {
          return (
            <g>
              <defs>
                <linearGradient id={`${svgId}-steampunk-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#291606" />
                  <stop offset="60%" stopColor="#451a03" />
                  <stop offset="100%" stopColor="#1c1917" />
                </linearGradient>
              </defs>
              <rect width="200" height="120" fill={`url(#${svgId}-steampunk-bg)`} />
              <circle cx="35" cy="40" r="18" fill="none" stroke="#b45309" strokeWidth="3" opacity="0.4" strokeDasharray="4 4" />
              <circle cx="35" cy="40" r="6" fill="#78350f" opacity="0.5" />
              <circle cx="165" cy="35" r="22" fill="none" stroke="#d97706" strokeWidth="3.5" opacity="0.35" strokeDasharray="5 5" />
              <circle cx="165" cy="35" r="8" fill="#78350f" opacity="0.5" />
              <line x1="0" y1="18" x2="200" y2="18" stroke="#92400e" strokeWidth="4" opacity="0.6" />
              <rect x="0" y="104" width="200" height="16" fill="#292524" />
            </g>
          );
        }
        return (
          <g>
            <defs>
              <linearGradient id={`${svgId}-jungle-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#052e16" />
                <stop offset="50%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" fill={`url(#${svgId}-jungle-bg)`} />
            {/* Sunlight Streaming Rays */}
            <polygon points="50,0 90,0 120,120 70,120" fill="#fef08a" opacity="0.08" />
            <polygon points="120,0 150,0 170,120 130,120" fill="#fef08a" opacity="0.07" />
            {/* Rainforest Leaves Silhouettes */}
            <path d="M 0 0 C 30 20, 45 60, 0 80 Z" fill="#047857" opacity="0.5" />
            <path d="M 200 0 C 170 20, 155 60, 200 80 Z" fill="#047857" opacity="0.5" />
            {/* Hanging Jungle Vines */}
            <path d="M 40 0 Q 55 35 45 70" stroke="#15803d" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M 160 0 Q 145 35 155 70" stroke="#15803d" strokeWidth="2" fill="none" opacity="0.7" />
            {/* Mossy Soil Bed */}
            <rect x="0" y="104" width="200" height="16" fill="#14532d" />
          </g>
        );
    }
  };

  // Unique Geometric Blueprint for the Specific Snake Breed
  const breedConfig = getSnakeBreedVisual(skin.id);
  const bodyPath = breedConfig.bodyPath;
  const headPos = breedConfig.headPos;
  const strokeWidth = breedConfig.strokeWidth;
  const tailPos = breedConfig.tailPos;
  const tailType = breedConfig.tailType;

  // Render Distinctive Tail Feature
  const renderTail = () => {
    switch (tailType) {
      case 'leaf':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <ellipse cx="-6" cy="-2" rx="4.5" ry="2.2" fill="#4ade80" transform="rotate(-30)" />
            <ellipse cx="-6" cy="2" rx="4.5" ry="2.2" fill="#22c55e" transform="rotate(30)" />
          </g>
        );
      case 'desert_rattle':
      case 'rattle':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <ellipse cx="-3" cy="0" rx="3.5" ry="2.5" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx="-7" cy="0" rx="3" ry="2.2" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx="-11" cy="0" rx="2.5" ry="1.8" fill="#92400e" stroke="#78350f" strokeWidth="0.8" />
            <path d="M -14 -4 Q -17 0 -14 4" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        );
      case 'ice_crystal':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <polygon points="0,0 -8,-6 -14,0 -8,6" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="0.8" />
            <circle cx="-7" cy="0" r="1.5" fill="#ffffff" />
          </g>
        );
      case 'flame_plume':
      case 'magma_club':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <path d="M 0 0 Q -10 -7 -16 -3 Q -12 2 -18 6 Q -8 5 0 0 Z" fill="#ea580c" stroke="#facc15" strokeWidth="1" />
          </g>
        );
      case 'cyber_plug':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <rect x="-10" y="-3.5" width="8" height="7" rx="1.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="-12" y1="-1.5" x2="-10" y2="-1.5" stroke="#38bdf8" strokeWidth="1" />
            <line x1="-12" y1="1.5" x2="-10" y2="1.5" stroke="#38bdf8" strokeWidth="1" />
          </g>
        );
      case 'gummy_drop':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <circle cx="-5" cy="0" r="5" fill={accent} stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
            <circle cx="-6" cy="-2" r="1.5" fill="#ffffff" opacity="0.8" />
          </g>
        );
      case 'sakura_blossom':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <circle cx="-6" cy="0" r="4.5" fill="#f472b6" />
            <circle cx="-6" cy="0" r="2" fill="#fef08a" />
          </g>
        );
      case 'paddle_fin':
      case 'scute_fin':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <path d="M 0 0 C -8 -10, -16 -6, -20 0 C -16 6, -8 10, 0 0 Z" fill={secondary} stroke={accent} strokeWidth="1" opacity="0.85" />
          </g>
        );
      case 'phoenix_plumage':
      case 'rainbow_feathers':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <path d="M 0 0 Q -10 -9 -18 -4 Q -12 0 -19 4 Q -10 9 0 0 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="-16" cy="0" r="1.8" fill="#ef4444" />
          </g>
        );
      case 'comet_tail':
      case 'shadow_wisp':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <circle cx="-4" cy="0" r="3.5" fill={accent} opacity="0.6" />
            <circle cx="-9" cy="0" r="2.2" fill={secondary} opacity="0.4" />
            <circle cx="-13" cy="0" r="1.2" fill="#ffffff" opacity="0.3" />
          </g>
        );
      case 'lightning_bolt':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <polyline points="0,0 -6,-5 -4,0 -12,-3" stroke="#facc15" strokeWidth="1.6" fill="none" />
          </g>
        );
      case 'toxic_stinger':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <polygon points="0,-2 -10,0 0,2" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.8" />
            <circle cx="-12" cy="0" r="1.5" fill="#a3e635" className="animate-ping" />
          </g>
        );
      case 'needle_point':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <polygon points="0,-2 -14,0 0,2" fill="#94a3b8" stroke="#0f172a" strokeWidth="0.8" />
          </g>
        );
      case 'gear_wheel':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <circle cx="0" cy="0" r="5.5" fill="#d97706" stroke="#451a03" strokeWidth="1" />
            <circle cx="0" cy="0" r="2.2" fill="#0f172a" />
            <path d="M -5.5 0 L 5.5 0 M 0 -5.5 L 0 5.5" stroke="#78350f" strokeWidth="1.2" />
          </g>
        );
      case 'cactus_thorn':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <polygon points="0,-3 -8,-6 0,0 -8,6 0,3" fill="#15803d" stroke="#052e16" strokeWidth="0.8" />
            <circle cx="-2" cy="0" r="1.5" fill="#facc15" />
          </g>
        );
      case 'single_orb':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <circle cx="0" cy="0" r="4.5" fill="#a855f7" stroke="#3b0764" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="2.5" fill="#22d3ee" className="animate-pulse" />
          </g>
        );
      case 'bubblegum_heart':
        return (
          <g transform={`translate(${tailPos.x}, ${tailPos.y})`}>
            <path d="M 0 0 C -4 -5, -8 0, 0 8 C 8 0, 4 -5, 0 0 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="0.8" transform="rotate(-90)" />
          </g>
        );
      default:
        return (
          <circle cx={tailPos.x} cy={tailPos.y} r={strokeWidth * 0.45} fill={accent} stroke="#0f172a" strokeWidth="1.5" />
        );
    }
  };

  // Render Specialized Anatomical Accessories across the Body
  const renderAccessories = () => {
    switch (skin.id) {
      case 'phoenix': // Outstretched Celestial Solar Wings
        return (
          <g>
            {/* Left Wing */}
            <path
              d="M 84 76 Q 50 45 28 58 Q 58 68 80 82 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* Right Wing */}
            <path
              d="M 84 76 Q 115 45 138 58 Q 110 68 88 82 Z"
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth="1"
              opacity="0.95"
            />
          </g>
        );
      case 'crystal': // Arboreal Resting Tree Branch
        return (
          <g>
            <path
              d="M 10 95 Q 60 85 110 88 T 190 75"
              stroke="#78350f"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M 50 88 Q 65 72 70 70"
              stroke="#78350f"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
          </g>
        );
      case 'bone': // Protruding Ivory Rib Cage Bones
        return (
          <g opacity="0.85">
            <line x1="55" y1="88" x2="50" y2="76" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="88" x2="60" y2="100" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="74" x2="80" y2="62" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="74" x2="90" y2="86" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
            <line x1="115" y1="74" x2="110" y2="62" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
            <line x1="115" y1="74" x2="120" y2="86" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'ocean': // Dorsal Undulating Swimming Fin along spine
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="15"
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity="0.4"
          />
        );
      case 'shadow': // Floating Amethyst Crystal Shards
        return (
          <g>
            <polygon points="60,65 64,55 68,65 64,75" fill="#c084fc" stroke="#9333ea" strokeWidth="0.8" opacity="0.8" />
            <polygon points="105,95 108,86 112,95 108,102" fill="#c084fc" stroke="#9333ea" strokeWidth="0.8" opacity="0.7" />
            <polygon points="140,35 143,28 147,35 143,41" fill="#e9d5ff" stroke="#9333ea" strokeWidth="0.8" opacity="0.9" />
          </g>
        );
      case 'tiger': // Bold Black Tiger Slashes
        return (
          <g opacity="0.9">
            <path d="M 60 76 L 68 84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 85 74 L 93 82" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 115 88 L 123 96" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'cactus':
        return (
          <g>
            <circle cx="65" cy="88" r="1.5" fill="#facc15" />
            <circle cx="95" cy="74" r="1.5" fill="#facc15" />
            <circle cx="120" cy="78" r="1.5" fill="#facc15" />
          </g>
        );
      case 'pink_bubblegum':
        return (
          <g>
            <circle cx="55" cy="85" r="2" fill="#fbcfe8" opacity="0.8" />
            <circle cx="105" cy="82" r="2.5" fill="#f472b6" opacity="0.7" />
          </g>
        );
      case 'cyclops_alien':
        return (
          <g>
            <circle cx="95" cy="72" r="16" fill="none" stroke="#e879f9" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            <circle cx="148" cy="54" r="12" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
          </g>
        );
      case 'steampunk':
        return (
          <g>
            <circle cx="70" cy="82" r="3" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
            <circle cx="110" cy="76" r="3.5" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Body Pattern
  const renderPattern = () => {
    switch (pattern) {
      case 'diamonds':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity="0.65"
          />
        );
      case 'rings':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke={secondary || '#fbbf24'}
            strokeWidth="9"
            strokeDasharray="3.5 9"
            strokeLinecap="butt"
            opacity="0.9"
          />
        );
      case 'stripes':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke={secondary || '#ffffff'}
            strokeWidth="2.8"
            strokeDasharray="5 7"
            strokeLinecap="round"
            opacity="0.8"
          />
        );
      case 'spots':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke={secondary || '#0f172a'}
            strokeWidth="6"
            strokeDasharray="1 8"
            strokeLinecap="round"
            opacity="0.8"
          />
        );
      case 'flames':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#facc15"
            strokeWidth="3.8"
            strokeDasharray="4 6"
            strokeLinecap="round"
            opacity="0.8"
          />
        );
      case 'spikes':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="4"
            strokeDasharray="2 8"
            strokeLinecap="round"
            opacity="0.8"
          />
        );
      case 'bones':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#1e293b"
            strokeWidth="6.5"
            strokeDasharray="2 6"
            strokeLinecap="butt"
            opacity="0.9"
          />
        );
      case 'cyber':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeLinecap="square"
            opacity="0.9"
          />
        );
      case 'stars':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#fdf4ff"
            strokeWidth="2.5"
            strokeDasharray="1 6"
            strokeLinecap="round"
            opacity="0.85"
          />
        );
      case 'petals':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#fda4af"
            strokeWidth="3.5"
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity="0.85"
          />
        );
      case 'keels':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#a7f3d0"
            strokeWidth="3"
            strokeDasharray="3 5"
            strokeLinecap="round"
            opacity="0.75"
          />
        );
      case 'gears':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.2"
            strokeDasharray="2 6"
            strokeLinecap="square"
            opacity="0.85"
          />
        );
      case 'thorns':
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#eab308"
            strokeWidth="3"
            strokeDasharray="1 5"
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      case 'scales':
      default:
        return (
          <path
            d={bodyPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="2 5"
            strokeLinecap="round"
            opacity="0.5"
          />
        );
    }
  };

  // Render Head & Breed Anatomical Features
  const renderSnakeHead = () => {
    return (
      <g transform={`translate(${headPos.x}, ${headPos.y}) rotate(${headPos.angle})`}>
        {/* 1. COBRA FLARING HOOD */}
        {(style === 'cobra' || style === 'shadow') && (
          <g>
            <path
              d="M -16 -4 C -22 -10, -22 -22, -13 -26 C -5 -29, 5 -29, 13 -26 C 22 -22, 22 -10, 16 -4 Z"
              fill={secondary || accent}
              stroke="#0f172a"
              strokeWidth="1.2"
              opacity="0.95"
            />
            {/* Hood Ocellus Eye-Spot Pattern */}
            <circle cx="-9" cy="-15" r="3.2" fill="#ffffff" />
            <circle cx="-9" cy="-15" r="1.6" fill="#0f172a" />
            <circle cx="9" cy="-15" r="3.2" fill="#ffffff" />
            <circle cx="9" cy="-15" r="1.6" fill="#0f172a" />
          </g>
        )}

        {/* 2. DRAGON HORNS & WHISKERS */}
        {style === 'dragon' && (
          <g>
            <path d="M -8 0 Q -18 -12 -20 -24 M 8 0 Q 18 -12 20 -24" stroke="#f59e0b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <path d="M -6 -10 Q -15 -6 -18 4 M 6 -10 Q 15 -6 18 4" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 3. PHOENIX PLUMED CREST */}
        {style === 'phoenix' && (
          <g>
            <path d="M -6 -8 Q -16 -18 -22 -14 Q -16 -4 -8 0" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <path d="M 6 -8 Q 16 -18 22 -14 Q 16 -4 8 0" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="0" cy="-18" r="3" fill="#ef4444" />
          </g>
        )}

        {/* 4. FROST DRAGON ICICLE SPUR HORNS */}
        {style === 'frost' && (
          <polygon points="-8,-4 -14,-22 -5,-10" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" />
        )}
        {style === 'frost' && (
          <polygon points="8,-4 14,-22 5,-10" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" />
        )}

        {/* 5. BASILISK WEBBED SPINE FIN */}
        {style === 'basilisk' && (
          <path d="M -10 -4 L -16 -18 L -6 -12 L 0 -22 L 6 -12 L 16 -18 L 10 -4 Z" fill="#047857" stroke="#34d399" strokeWidth="1" />
        )}

        {/* 6. DESERT HORNED VIPER BROW HORNS */}
        {style === 'desert' && (
          <g>
            <polygon points="-7,-4 -11,-14 -4,-6" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
            <polygon points="7,-4 11,-14 4,-6" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
          </g>
        )}

        {/* 7. TOXIC BIOHAZARD CREST */}
        {style === 'toxic' && (
          <g>
            <polygon points="-6,-10 0,-18 6,-10" fill="#a3e635" stroke="#15803d" strokeWidth="1" />
            <circle cx="0" cy="-14" r="1.5" fill="#0f172a" />
          </g>
        )}

        {/* 8. SAKURA BLOSSOM CROWN */}
        {style === 'sakura' && (
          <g transform="translate(0, -14)">
            <circle cx="0" cy="0" r="3" fill="#fbcfe8" />
            <circle cx="-3" cy="-3" r="2.5" fill="#fda4af" />
            <circle cx="3" cy="-3" r="2.5" fill="#fda4af" />
            <circle cx="-3" cy="3" r="2.5" fill="#fda4af" />
            <circle cx="3" cy="3" r="2.5" fill="#fda4af" />
            <circle cx="0" cy="0" r="1.5" fill="#fef08a" />
          </g>
        )}

        {/* 9. FORKED TONGUE FLICKING */}
        <path
          d="M 0 -13 L 0 -23 M 0 -23 L -4 -28 M 0 -23 L 4 -28"
          stroke={tongueColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 10. MAIN SNAKE HEAD CONTOUR */}
        {style === 'bone' ? (
          // Skeleton Skull Head
          <g>
            <path
              d="M 0 -14 C 9 -14, 12 -4, 10 5 C 8 10, -8 10, -10 5 C -12 -4, -9 -14, 0 -14 Z"
              fill="#f8fafc"
              stroke="#334155"
              strokeWidth="1.6"
            />
            {/* Hollow Eye Sockets */}
            <ellipse cx="-5" cy="-3" rx="3.5" ry="4" fill="#0f172a" />
            <ellipse cx="5" cy="-3" rx="3.5" ry="4" fill="#0f172a" />
            <circle cx="-5" cy="-3" r="1.8" fill={eyeColor} />
            <circle cx="5" cy="-3" r="1.8" fill={eyeColor} />
            {/* Skeletal Nasal Cavity */}
            <polygon points="-1.5,-10 0,-12 1.5,-10" fill="#0f172a" />
          </g>
        ) : style === 'cyber' ? (
          // Angular Cybernetic Plated Head
          <g>
            <polygon
              points="0,-16 11,-8 9,6 -9,6 -11,-8"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="1.6"
            />
            {/* Glowing Laser Optic Visor */}
            <line x1="-8" y1="-3" x2="8" y2="-3" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <line x1="-5" y1="-3" x2="5" y2="-3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ) : (
          // Organic Reptilian Head
          <g>
            <path
              d="M 0 -15 C 10 -15, 13 -4, 11 6 C 9 12, -9 12, -11 6 C -13 -4, -10 -15, 0 -15 Z"
              fill={accent}
              stroke="#0f172a"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Expressive Snake Eyes (1 eye for Cyclops, 2 eyes for others) */}
            {skin.eyeCount === 1 || style === 'cyclops' ? (
              <g>
                <circle cx="0" cy="-4" r="5" fill="#0f172a" />
                <circle cx="0" cy="-4" r="4.2" fill={eyeColor} />
                <ellipse cx="0" cy="-4" rx="1.8" ry="3.2" fill="#0f172a" />
                <circle cx="-1.2" cy="-5.5" r="1.1" fill="#ffffff" />
                <circle cx="0" cy="-4" r="4.8" fill="none" stroke="#e879f9" strokeWidth="0.8" opacity="0.8" />
              </g>
            ) : (
              <>
                <ellipse cx="-5.5" cy="-3" rx="3.4" ry="3.8" fill={eyeColor} />
                <ellipse cx="-5.5" cy="-3" rx="1.4" ry="2.6" fill="#0f172a" />
                <circle cx="-6.2" cy="-4.2" r="0.8" fill="#ffffff" />

                <ellipse cx="5.5" cy="-3" rx="3.4" ry="3.8" fill={eyeColor} />
                <ellipse cx="5.5" cy="-3" rx="1.4" ry="2.6" fill="#0f172a" />
                <circle cx="4.8" cy="-4.2" r="0.8" fill="#ffffff" />
              </>
            )}

            {/* Nostrils */}
            <circle cx="-2.2" cy="-11" r="0.8" fill="#0f172a" opacity="0.7" />
            <circle cx="2.2" cy="-11" r="0.8" fill="#0f172a" opacity="0.7" />
          </g>
        )}

        {/* 11. ROYAL PHARAOH / GILDED CROWN / CACTUS FLOWER / STEAMPUNK LENS */}
        {skin.id === 'golden' && (
          <polygon points="-6,-12 -3,-18 0,-14 3,-18 6,-12" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        )}
        {skin.id === 'cactus' && (
          <g transform="translate(0, -15)">
            <polygon points="0,-7 3,-2 7,0 3,2 0,7 -3,2 -7,0 -3,-2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="2.2" fill="#ef4444" />
          </g>
        )}
        {skin.id === 'steampunk' && (
          <g transform="translate(0, -14)">
            <circle cx="0" cy="0" r="4" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="2" fill="#fbbf24" />
          </g>
        )}
        {skin.id === 'pharaoh' && (
          <g transform="translate(0, -13)">
            <ellipse cx="0" cy="-4" rx="4.5" ry="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
            <path d="M -5 -2 L -8 4 M 5 -2 L 8 4" stroke="#1e40af" strokeWidth="1.5" />
          </g>
        )}
      </g>
    );
  };

  // Rarity styling badge
  const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
    Starter: { bg: 'bg-stone-800/80', text: 'text-stone-300', border: 'border-stone-600/40' },
    Common: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-500/40' },
    Rare: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-500/40' },
    Epic: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-500/40' },
    Legendary: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-500/40' },
    Mythic: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-500/40' },
  };

  const rarityInfo = rarityColors[skin.rarity || 'Common'] || rarityColors.Common;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg select-none group transition-all duration-300 ${className}`}
    >
      {/* SVG Image Container */}
      <svg
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid meet"
        className={`w-full h-full min-h-0 aspect-[5/3] block transform transition-transform duration-500 ${
          isPreview ? 'scale-100' : 'group-hover:scale-105'
        }`}
      >
        <defs>
          {/* Subtle Outer Drop Shadow */}
          <filter id={`${svgId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Habitat Environment Background Art */}
        {renderBiomeBackground()}

        {/* 2. Specialized Habitat / Breed Accessories */}
        {renderAccessories()}

        {/* 3. Distinctive Tail Feature */}
        {renderTail()}

        {/* 4. Snake Body Shadow & Outer Dark Border */}
        <path
          d={bodyPath}
          fill="none"
          stroke="#0f172a"
          strokeWidth={strokeWidth + 3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${svgId}-shadow)`}
        />

        {/* 5. Snake Main Color Body */}
        <path
          d={bodyPath}
          fill="none"
          stroke={accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Gummy Snake Translucent Jelly Highlight */}
        {style === 'gummy' && (
          <path
            d={bodyPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth={strokeWidth * 0.35}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
        )}

        {/* 7. Unique Breed Pattern Overlay */}
        {renderPattern()}

        {/* 8. Snake Head & Anatomical Features */}
        {renderSnakeHead()}
      </svg>

      {/* Floating Rarity & Biome Chip */}
      <div className="absolute top-2 left-2 flex items-center gap-1 pointer-events-none">
        <span
          className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider backdrop-blur-md border ${rarityInfo.bg} ${rarityInfo.text} ${rarityInfo.border}`}
        >
          {skin.rarity || 'Common'}
        </span>
        <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider backdrop-blur-md bg-black/60 text-slate-300 border border-white/10">
          {biome}
        </span>
      </div>

      {/* Tag Badge on top right */}
      {skin.tag && (
        <div className="absolute top-2 right-2 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm">
            {skin.tag}
          </span>
        </div>
      )}
    </div>
  );
};
