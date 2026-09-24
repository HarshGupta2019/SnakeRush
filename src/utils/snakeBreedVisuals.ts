import React from 'react';

export interface SnakeBreedVisualConfig {
  skinId: string;
  bodyPath: string;
  strokeWidth: number;
  headPos: { x: number; y: number; angle: number };
  tailPos: { x: number; y: number };
  tailType:
    | 'leaf'
    | 'rattle'
    | 'prehensile'
    | 'gummy_drop'
    | 'royal_bell'
    | 'flame_plume'
    | 'ice_crystal'
    | 'desert_rattle'
    | 'heavy_coil'
    | 'tiger_stripes'
    | 'neon_ring'
    | 'lightning_bolt'
    | 'sakura_blossom'
    | 'toxic_stinger'
    | 'comet_tail'
    | 'magma_club'
    | 'cyber_plug'
    | 'paddle_fin'
    | 'bone_rings'
    | 'shadow_wisp'
    | 'scute_fin'
    | 'ankh_pedestal'
    | 'rainbow_feathers'
    | 'phoenix_plumage'
    | 'needle_point'
    | 'gear_wheel'
    | 'cactus_thorn'
    | 'single_orb'
    | 'bubblegum_heart';
  customAccessories?: (svgId: string, accent: string, secondary: string) => React.ReactNode;
}

/**
 * 25 Truly Unique Snake Breed Geometric Blueprints:
 * Distinct SVG paths, thicknesses, coils, and anatomical poses!
 */
export const SNAKE_BREED_CONFIGS: Record<string, SnakeBreedVisualConfig> = {
  // 1. Garden Garter (Gentle, friendly, round cartoon curves)
  eye_comfort_arrow: {
    skinId: 'eye_comfort_arrow',
    bodyPath: 'M 28 92 C 45 96, 75 96, 95 82 C 115 68, 130 82, 146 72 C 158 64, 148 48, 126 50',
    strokeWidth: 9.5,
    headPos: { x: 126, y: 50, angle: -155 },
    tailPos: { x: 28, y: 92 },
    tailType: 'leaf',
  },

  // 2. Azure Corn Snake (Fast, aerodynamic oceanic wave)
  classic: {
    skinId: 'classic',
    bodyPath: 'M 22 88 Q 50 62 80 88 T 138 86 Q 160 74 148 50',
    strokeWidth: 8.5,
    headPos: { x: 148, y: 50, angle: -140 },
    tailPos: { x: 22, y: 88 },
    tailType: 'neon_ring',
  },

  // 3. Sakura Bubblegum (Completely pink, sweet ribbon curves with heart tail)
  pink_bubblegum: {
    skinId: 'pink_bubblegum',
    bodyPath: 'M 24 90 C 44 104, 68 70, 96 84 C 118 96, 136 68, 146 52',
    strokeWidth: 10,
    headPos: { x: 146, y: 52, angle: -130 },
    tailPos: { x: 24, y: 90 },
    tailType: 'bubblegum_heart',
  },

  // 4. Gummy Jelly Worm (Chubby, bulbous bouncy segmented candy worm)
  gummy: {
    skinId: 'gummy',
    bodyPath: 'M 24 88 Q 50 104 76 82 Q 102 60 128 86 Q 148 104 156 70',
    strokeWidth: 14, // Extra thick chubby body
    headPos: { x: 156, y: 70, angle: -85 },
    tailPos: { x: 24, y: 88 },
    tailType: 'gummy_drop',
  },

  // 5. Silver Needle Viper (Ultra-slender liquid silver needle body with keen point)
  slender_viper: {
    skinId: 'slender_viper',
    bodyPath: 'M 20 94 L 56 68 L 92 90 L 132 62 L 152 48',
    strokeWidth: 6.8, // Ultra slender thin body
    headPos: { x: 152, y: 48, angle: -145 },
    tailPos: { x: 20, y: 94 },
    tailType: 'needle_point',
  },

  // 6. Emerald Tree Python (Draped over tree branch, coiled resting loops)
  crystal: {
    skinId: 'crystal',
    bodyPath: 'M 25 78 C 38 60, 68 60, 78 82 C 88 102, 118 102, 128 76 C 138 56, 162 66, 148 44',
    strokeWidth: 10.5,
    headPos: { x: 148, y: 44, angle: -145 },
    tailPos: { x: 25, y: 78 },
    tailType: 'prehensile',
  },

  // 7. Cosmic Cyclops Naga (Hypnotic alien serpent with ONE centered glowing eye)
  cyclops_alien: {
    skinId: 'cyclops_alien',
    bodyPath: 'M 26 94 C 52 108, 60 62, 94 72 C 122 82, 138 98, 148 54',
    strokeWidth: 10,
    headPos: { x: 148, y: 54, angle: -115 },
    tailPos: { x: 26, y: 94 },
    tailType: 'single_orb',
  },

  // 8. Royal Sun Cobra (High vertical striking stance with flared hood)
  golden: {
    skinId: 'golden',
    bodyPath: 'M 22 102 C 52 108, 76 94, 92 86 C 104 78, 110 56, 114 36',
    strokeWidth: 9.5,
    headPos: { x: 114, y: 36, angle: -90 },
    tailPos: { x: 22, y: 102 },
    tailType: 'royal_bell',
  },

  // 9. Inferno Fire Wyrm (Rising undulating flame serpent with draconic horns)
  fire: {
    skinId: 'fire',
    bodyPath: 'M 24 96 Q 52 106 80 78 Q 108 50 136 82 Q 154 70 142 46',
    strokeWidth: 10.5,
    headPos: { x: 142, y: 46, angle: -140 },
    tailPos: { x: 24, y: 96 },
    tailType: 'flame_plume',
  },

  // 10. Frost Glacial Drake (Sharp crystalline jagged arcs with icicle horns)
  ice: {
    skinId: 'ice',
    bodyPath: 'M 20 84 L 54 98 L 84 66 L 118 94 L 146 54',
    strokeWidth: 9.2,
    headPos: { x: 146, y: 54, angle: -135 },
    tailPos: { x: 20, y: 84 },
    tailType: 'ice_crystal',
  },

  // 11. Horned Sand Viper (Sidewinder S-coils with devil brow spikes)
  desert: {
    skinId: 'desert',
    bodyPath: 'M 26 94 C 44 80, 56 104, 82 92 C 108 80, 120 102, 144 68',
    strokeWidth: 9.8,
    headPos: { x: 144, y: 68, angle: -130 },
    tailPos: { x: 26, y: 94 },
    tailType: 'desert_rattle',
  },

  // 12. Amazon Giant Anaconda (Massive heavy-bodied constrictor)
  anaconda: {
    skinId: 'anaconda',
    bodyPath: 'M 24 88 C 42 106, 76 102, 92 84 C 108 66, 134 76, 146 58',
    strokeWidth: 13, // Massive heavyweight constrictor
    headPos: { x: 146, y: 58, angle: -125 },
    tailPos: { x: 24, y: 88 },
    tailType: 'heavy_coil',
  },

  // 13. Titan Tiger Boa (Coiled apex ambush pose with bold tiger stripes)
  tiger: {
    skinId: 'tiger',
    bodyPath: 'M 22 82 Q 54 62 82 86 Q 110 110 136 84 Q 156 66 142 46',
    strokeWidth: 10,
    headPos: { x: 142, y: 46, angle: -140 },
    tailPos: { x: 22, y: 82 },
    tailType: 'tiger_stripes',
  },

  // 14. Coral Neon Viper (Geometric luminous zig-zag bands)
  neon: {
    skinId: 'neon',
    bodyPath: 'M 20 86 Q 48 58 78 86 T 136 86 Q 156 64 144 48',
    strokeWidth: 9,
    headPos: { x: 144, y: 48, angle: -145 },
    tailPos: { x: 20, y: 86 },
    tailType: 'neon_ring',
  },

  // 15. Prickly Saguaro Viper (Desert cactus green, ribbed thorns, flower crown)
  cactus: {
    skinId: 'cactus',
    bodyPath: 'M 24 94 Q 52 106 82 80 Q 112 54 134 84 Q 152 74 144 50',
    strokeWidth: 10.5,
    headPos: { x: 144, y: 50, angle: -130 },
    tailPos: { x: 24, y: 94 },
    tailType: 'cactus_thorn',
  },

  // 16. Thunderbolt Mamba (Lightning angular crackling zig-zag)
  lightning: {
    skinId: 'lightning',
    bodyPath: 'M 18 90 L 48 68 L 78 96 L 112 66 L 148 52',
    strokeWidth: 8,
    headPos: { x: 148, y: 52, angle: -155 },
    tailPos: { x: 18, y: 90 },
    tailType: 'lightning_bolt',
  },

  // 17. Albino Blossom Boa (Gentle peaceful zen S-flow with blossom crown)
  albino: {
    skinId: 'albino',
    bodyPath: 'M 26 88 C 48 106, 78 94, 96 80 C 114 66, 134 82, 146 54',
    strokeWidth: 9.5,
    headPos: { x: 146, y: 54, angle: -135 },
    tailPos: { x: 26, y: 88 },
    tailType: 'sakura_blossom',
  },

  // 18. Toxic Biohazard Hydra (Twitching jagged mutant bends with toxic stinger)
  toxic: {
    skinId: 'toxic',
    bodyPath: 'M 22 92 Q 54 62 76 96 Q 100 118 126 82 Q 150 56 142 42',
    strokeWidth: 9.6,
    headPos: { x: 142, y: 42, angle: -130 },
    tailPos: { x: 22, y: 92 },
    tailType: 'toxic_stinger',
  },

  // 19. Cosmic Void Serpent (Astral orbital looping vortex with stardust tail)
  galaxy: {
    skinId: 'galaxy',
    bodyPath: 'M 24 96 C 46 112, 70 60, 98 74 C 122 88, 140 102, 150 58',
    strokeWidth: 9.8,
    headPos: { x: 150, y: 58, angle: -115 },
    tailPos: { x: 24, y: 96 },
    tailType: 'comet_tail',
  },

  // 20. Cyber Mecha Serpent (Modular mechanical 90-degree chassis segments)
  robot: {
    skinId: 'robot',
    bodyPath: 'M 20 88 L 60 88 L 60 62 L 110 62 L 110 88 L 148 54',
    strokeWidth: 10,
    headPos: { x: 148, y: 54, angle: -135 },
    tailPos: { x: 20, y: 88 },
    tailType: 'cyber_plug',
  },

  // 21. Deep Sea Leviathan (Aquatic swimming crest wave with dorsal fins)
  ocean: {
    skinId: 'ocean',
    bodyPath: 'M 22 82 C 48 58, 76 66, 92 88 C 108 110, 134 100, 146 56',
    strokeWidth: 10.5,
    headPos: { x: 146, y: 56, angle: -125 },
    tailPos: { x: 22, y: 82 },
    tailType: 'paddle_fin',
  },

  // 22. Clockwork Brass Naga (Victorian riveted gear chassis with rotating wheel tail)
  steampunk: {
    skinId: 'steampunk',
    bodyPath: 'M 22 92 L 56 72 L 88 94 L 122 70 L 148 52',
    strokeWidth: 10,
    headPos: { x: 148, y: 52, angle: -140 },
    tailPos: { x: 22, y: 92 },
    tailType: 'gear_wheel',
  },

  // 23. Skeleton Bone Naga (Undead skeletal vertebrae links with bone rings)
  bone: {
    skinId: 'bone',
    bodyPath: 'M 20 90 Q 45 68 75 90 T 132 88 Q 152 70 144 48',
    strokeWidth: 8.5,
    headPos: { x: 144, y: 48, angle: -140 },
    tailPos: { x: 20, y: 90 },
    tailType: 'bone_rings',
  },

  // 24. Prismatic Rainbow Serpent (Majestic multi-loop celestial rainbow wave)
  rainbow: {
    skinId: 'rainbow',
    bodyPath: 'M 20 86 Q 50 60 80 86 Q 110 112 140 86 Q 162 68 148 46',
    strokeWidth: 11,
    headPos: { x: 148, y: 46, angle: -145 },
    tailPos: { x: 20, y: 86 },
    tailType: 'rainbow_feathers',
  },

  // 25. Solar Phoenix Serpent (Outstretched winged celestial serpent with fiery plumage)
  phoenix: {
    skinId: 'phoenix',
    bodyPath: 'M 24 96 Q 55 104 84 76 Q 112 48 138 78 Q 156 64 142 42',
    strokeWidth: 10,
    headPos: { x: 142, y: 42, angle: -135 },
    tailPos: { x: 24, y: 96 },
    tailType: 'phoenix_plumage',
  },

  // Backwards compatibility fallbacks
  magma: {
    skinId: 'magma',
    bodyPath: 'M 22 96 Q 54 108 82 82 Q 110 56 136 86 Q 154 74 144 50',
    strokeWidth: 10.5,
    headPos: { x: 144, y: 50, angle: -140 },
    tailPos: { x: 22, y: 96 },
    tailType: 'magma_club',
  },
  shadow: {
    skinId: 'shadow',
    bodyPath: 'M 24 98 C 50 106, 74 94, 90 84 C 104 76, 112 54, 116 36',
    strokeWidth: 9.5,
    headPos: { x: 116, y: 36, angle: -90 },
    tailPos: { x: 24, y: 98 },
    tailType: 'shadow_wisp',
  },
  basilisk: {
    skinId: 'basilisk',
    bodyPath: 'M 24 84 Q 54 60 84 86 Q 114 112 138 82 Q 158 60 144 42',
    strokeWidth: 10,
    headPos: { x: 144, y: 42, angle: -130 },
    tailPos: { x: 24, y: 84 },
    tailType: 'scute_fin',
  },
  pharaoh: {
    skinId: 'pharaoh',
    bodyPath: 'M 26 102 C 55 106, 80 94, 94 85 C 104 76, 110 52, 114 34',
    strokeWidth: 9,
    headPos: { x: 114, y: 34, angle: -90 },
    tailPos: { x: 26, y: 102 },
    tailType: 'ankh_pedestal',
  },
};

/**
 * Retrieve breed configuration by ID or fallback to standard python
 */
export function getSnakeBreedVisual(skinId: string): SnakeBreedVisualConfig {
  return (
    SNAKE_BREED_CONFIGS[skinId] || {
      skinId,
      bodyPath: 'M 28 92 C 45 96, 75 96, 95 82 C 115 68, 130 82, 146 72 C 158 64, 148 48, 126 50',
      strokeWidth: 10,
      headPos: { x: 126, y: 50, angle: -150 },
      tailPos: { x: 28, y: 92 },
      tailType: 'neon_ring',
    }
  );
}
