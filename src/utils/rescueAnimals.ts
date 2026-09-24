import { RescueAnimal, RescueTierConfig } from '../types';

export const RESCUE_ANIMALS_LIST: Omit<RescueAnimal, 'id'>[] = [
  { name: 'Fluffy', species: 'Bunny', emoji: '🐇', quote: 'Hop hop! Thank you for clearing the snakes!', color: '#fbcfe8' },
  { name: 'Hoppy', species: 'Tree Frog', emoji: '🐸', quote: 'Ribbit! That was a close call with those vipers!', color: '#86efac' },
  { name: 'Rusty', species: 'Red Fox', emoji: '🦊', quote: 'Yip! My bushy tail was almost tangled!', color: '#fdba74' },
  { name: 'Ziggy', species: 'Savanna Zebra', emoji: '🦓', quote: 'Neigh! Free to gallop across the plains again!', color: '#e2e8f0' },
  { name: 'Pip', species: 'Field Mouse', emoji: '🐭', quote: 'Squeak! Giant snakes are so scary, thank you!', color: '#cbd5e1' },
  { name: 'Daisy', species: 'Meadow Cow', emoji: '🐄', quote: 'Mooo! You guided the serpents away peacefully!', color: '#fef08a' },
  { name: 'Remy', species: 'City Rat', emoji: '🐀', quote: 'Squeak! Smart moves untangling those serpents!', color: '#94a3b8' },
  { name: 'Grace', species: 'Royal Swan', emoji: '🦢', quote: 'Honk! My feathers are safe thanks to your quick taps!', color: '#f8fafc' },
  { name: 'Shelly', species: 'Sea Turtle', emoji: '🐢', quote: 'Slow and steady, but your untangling was super fast!', color: '#6ee7b7' },
  { name: 'Inky', species: 'Coral Octopus', emoji: '🐙', quote: 'Eight tentacles free from the snake tangle!', color: '#f472b6' },
  { name: 'Puffy', species: 'Pufferfish', emoji: '🐡', quote: 'Blub blub! I was so puffed up with worry!', color: '#fde047' },
  { name: 'Ignis', species: 'Firebird Phoenix', emoji: '🐦‍🔥', quote: 'Screeech! Rising from the snake nest safe and sound!', color: '#fb923c' },
  { name: 'Coby', species: 'Silk Caterpillar', emoji: '🐛', quote: 'Wiggle wiggle! Now I can cocoon safely!', color: '#a3e635' },
  { name: 'Turbo', species: 'Garden Snail', emoji: '🐌', quote: 'Slithering snakes are too fast for me, you saved my shell!', color: '#fed7aa' },
  { name: 'Lumina', species: 'Moon Jellyfish', emoji: '🪼', quote: 'Glow glow! Floating free in the ocean current!', color: '#c084fc' },
  { name: 'Talon', species: 'Sky Eagle', emoji: '🦅', quote: 'Screee! Soaring back to the high mountain peaks!', color: '#d97706' },
  { name: 'Peace', species: 'White Dove', emoji: '🕊️', quote: 'Coo coo! Harmony restored to the forest!', color: '#f1f5f9' },
  { name: 'Gobble', species: 'Forest Turkey', emoji: '🦃', quote: 'Gobble gobble! That snake trap was tricky!', color: '#b45309' },
  { name: 'Blizzard', species: 'Polar Bear', emoji: '🐻‍❄️', quote: 'Roar! Back to the chilly snowy icebergs!', color: '#e0f2fe' },
  { name: 'Stretch', species: 'Tall Giraffe', emoji: '🦒', quote: 'Looking down from high up, you solved it great!', color: '#fde047' },
  { name: 'Tusk', species: 'Wild Boar', emoji: '🐗', quote: 'Oink-grunt! Charging back into the bamboo grove!', color: '#78716c' },
  { name: 'Barnaby', species: 'Farm Piglet', emoji: '🐖', quote: 'Oink! Time for a celebratory mud bath!', color: '#f472b6' },
  { name: 'Spirit', species: 'Wild Mustang', emoji: '🐴', quote: 'Whinny! Free to run with the wind!', color: '#d97706' },
  { name: 'Whiskers', species: 'Calico Cat', emoji: '🐈', quote: 'Purrrr! Nine lives intact thanks to your rescue!', color: '#fb923c' },
  { name: 'Pongo', species: 'Rainforest Orangutan', emoji: '🦧', quote: 'Ooh ooh! Swinging back into the jungle trees!', color: '#ea580c' },
  { name: 'Banjo', species: 'Capuchin Monkey', emoji: '🐒', quote: 'Eee-eee! Thank you for untying the snake knot!', color: '#ca8a04' },
  { name: 'Koko', species: 'Jungle Ape', emoji: '🐵', quote: 'Aha! Clever moves freeing me from the serpent trap!', color: '#a16207' },
  { name: 'Bamboo', species: 'Giant Panda', emoji: '🐼', quote: 'Munch munch! Safe to eat yummy bamboo shoots!', color: '#e2e8f0' },
  { name: 'Spiky', species: 'Hedgehog', emoji: '🦔', quote: 'Uncurling my quills now that the danger is gone!', color: '#a8a29e' },
  { name: 'Coral', species: 'Flamingo', emoji: '🦩', quote: 'Standing tall on one leg to celebrate freedom!', color: '#fb7185' },
  { name: 'Pip', species: 'Emperor Penguin', emoji: '🐧', quote: 'Waddle waddle! Sliding back to the icy sea!', color: '#38bdf8' },
  { name: 'Gumdrop', species: 'Koala', emoji: '🐨', quote: 'Yawn... hugging my eucalyptus tree safely again!', color: '#94a3b8' },
  { name: 'Splash', species: 'Harbor Seal', emoji: '🦭', quote: 'Arf arf! Splashing with joy in the clear water!', color: '#67e8f9' },
  { name: 'Echo', species: 'Dolphin', emoji: '🐬', quote: 'Click-whistle! Surfing through the ocean waves!', color: '#38bdf8' },
  { name: 'Stardust', species: 'Mythic Unicorn', emoji: '🦄', quote: 'Neigh! Magic sparkle blessings for your heroic rescue!', color: '#e879f9' },
  { name: 'Roary', species: 'Golden Lion', emoji: '🦁', quote: 'Roaaar! The king of beasts thanks you humbly!', color: '#fbbf24' },
  { name: 'Stripes', species: 'Bengal Tiger', emoji: '🐯', quote: 'Grrrr-purr! Prowling back into the lush forest!', color: '#f97316' },
  { name: 'Peanut', species: 'Baby Elephant', emoji: '🐘', quote: 'Pawooo! Trumpeting happy notes with my trunk!', color: '#94a3b8' },
  { name: 'Joey', species: 'Kangaroo', emoji: '🦘', quote: 'Boing boing! Bouncing across the outback in freedom!', color: '#d97706' },
  { name: 'Digby', species: 'Honey Badger', emoji: '🦡', quote: 'Snakes are tough, but with your help we conquered!', color: '#64748b' },
  { name: 'Castor', species: 'Builder Beaver', emoji: '🦫', quote: 'Slap tail! Back to building happy river dams!', color: '#78350f' },
  { name: 'Moss', species: 'Tree Sloth', emoji: '🦥', quote: 'Thaaank... youuu... so... much...', color: '#84cc16' },
  { name: 'Splash', species: 'River Otter', emoji: '🦦', quote: 'Squeal! Holding paws and floating happily!', color: '#a16207' },
  { name: 'Rio', species: 'Scarlet Macaw', emoji: '🦜', quote: 'Squawk! Colorful feathers fluttering in safety!', color: '#ef4444' },
  { name: 'Jewel', species: 'Royal Peacock', emoji: '🦚', quote: 'Spreading my glorious fan feathers in celebration!', color: '#06b6d4' },
  { name: 'Buzzy', species: 'Honeybee', emoji: '🐝', quote: 'Bzzzz! Flying back to the sweet blossom flowers!', color: '#eab308' },
  { name: 'Dotty', species: 'Lucky Ladybug', emoji: '🐞', quote: 'Bringing you good luck for saving my tiny wings!', color: '#f43f5e' },
  { name: 'Quackers', species: 'Mallard Duck', emoji: '🦆', quote: 'Quack quack! Swimming peacefully in the pond!', color: '#10b981' },
  { name: 'Hoot', species: 'Wise Owl', emoji: '🦉', quote: 'Hoo-hoo! Your puzzle wisdom solved the riddle!', color: '#b45309' },
  { name: 'Luna', species: 'Arctic Wolf', emoji: '🐺', quote: 'Awoooo! Howling in gratitude to the moonlight!', color: '#cbd5e1' },
];

/**
 * Retrieves the comprehensive difficulty, grid size, snake count, and tier configuration
 * for Animal Rescue mode, scaling progressively harder from level 1 up to 1000+.
 */
export function getRescueTierConfig(levelId: number): RescueTierConfig {
  if (levelId === 1) {
    return {
      tierNumber: 1,
      tierName: 'Meadow Outskirts',
      dangerBadge: 'TUTORIAL',
      badgeColor: 'emerald',
      gridW: 5,
      gridH: 5,
      targetSnakes: 6,
      minBlockersOnRay: 1,
      minRescueStep: 1,
      maxSnakeLength: 3,
      timeLimit: 50,
      difficulty: 'easy',
      description: 'Gentle training ground. Untangle 6 beginner snakes to rescue your first animal!',
    };
  }

  if (levelId === 2) {
    return {
      tierNumber: 1,
      tierName: 'Meadow Outskirts',
      dangerBadge: 'BEGINNER',
      badgeColor: 'emerald',
      gridW: 6,
      gridH: 6,
      targetSnakes: 8,
      minBlockersOnRay: 1,
      minRescueStep: 2,
      maxSnakeLength: 3,
      timeLimit: 48,
      difficulty: 'easy',
      description: 'Light serpent barrier. 8 snakes guard the meadow exit.',
    };
  }

  if (levelId <= 5) {
    const step = levelId - 2;
    return {
      tierNumber: 2,
      tierName: 'Forest Trail',
      dangerBadge: 'EASY',
      badgeColor: 'teal',
      gridW: 6,
      gridH: 6,
      targetSnakes: 8 + step * 2, // 10, 12, 14 snakes
      minBlockersOnRay: 2,
      minRescueStep: 2 + step, // 3, 4, 5
      maxSnakeLength: 3,
      timeLimit: 45,
      difficulty: 'easy',
      description: 'Woodland serpents start coiling along escape paths.',
    };
  }

  if (levelId <= 10) {
    const step = levelId - 5;
    return {
      tierNumber: 3,
      tierName: 'Bramble Thicket',
      dangerBadge: 'NOVICE',
      badgeColor: 'cyan',
      gridW: 7,
      gridH: 7,
      targetSnakes: 14 + step * 2, // 16 to 24 snakes
      minBlockersOnRay: 2,
      minRescueStep: 4 + step, // 5 to 9
      maxSnakeLength: 4,
      timeLimit: 42,
      difficulty: 'easy',
      description: 'L-bends and double-turn snakes wrap into tighter knots.',
    };
  }

  if (levelId <= 20) {
    const step = levelId - 10;
    return {
      tierNumber: 4,
      tierName: 'Serpent Hollow',
      dangerBadge: 'MEDIUM',
      badgeColor: 'sky',
      gridW: 8,
      gridH: 8,
      targetSnakes: 24 + Math.round(step * 1.2), // 25 to 36 snakes
      minBlockersOnRay: 3,
      minRescueStep: 8 + Math.round(step * 0.8), // 9 to 16
      maxSnakeLength: 4,
      timeLimit: 40,
      difficulty: 'medium',
      description: 'Nested serpent layers require strategic outward-in untangling.',
    };
  }

  if (levelId <= 35) {
    const step = levelId - 20;
    return {
      tierNumber: 5,
      tierName: 'Viper Nest',
      dangerBadge: 'HARD',
      badgeColor: 'amber',
      gridW: 9,
      gridH: 9,
      targetSnakes: 36 + Math.round(step * 1.2), // 37 to 54 snakes
      minBlockersOnRay: 4,
      minRescueStep: 14 + step, // 15 to 29
      maxSnakeLength: 5,
      timeLimit: 38,
      difficulty: 'hard',
      description: 'Fast-moving vipers with multi-turn S-curves and interlocking traps.',
    };
  }

  if (levelId <= 55) {
    const step = levelId - 35;
    return {
      tierNumber: 6,
      tierName: 'Cobra Den',
      dangerBadge: 'EXPERT',
      badgeColor: 'orange',
      gridW: 10,
      gridH: 10,
      targetSnakes: 54 + Math.round(step * 1.1), // 55 to 76 snakes
      minBlockersOnRay: 5,
      minRescueStep: 24 + Math.round(step * 1.1), // 25 to 46
      maxSnakeLength: 5,
      timeLimit: 36,
      difficulty: 'hard',
      description: 'Massive 10x10 board with dense cobra coils defending the hostage animal.',
    };
  }

  if (levelId <= 80) {
    const step = levelId - 55;
    return {
      tierNumber: 7,
      tierName: 'Python Labyrinth',
      dangerBadge: 'MASTER',
      badgeColor: 'rose',
      gridW: 11,
      gridH: 11,
      targetSnakes: 76 + Math.round(step * 1.0), // 77 to 101 snakes
      minBlockersOnRay: 6,
      minRescueStep: 36 + step, // 37 to 61
      maxSnakeLength: 6,
      timeLimit: 35,
      difficulty: 'insane',
      description: 'Over 80 serpents intertwining in concentric perimeter rings.',
    };
  }

  if (levelId <= 120) {
    const step = levelId - 80;
    return {
      tierNumber: 8,
      tierName: 'Basilisk Cavern',
      dangerBadge: 'INSANE',
      badgeColor: 'purple',
      gridW: 12,
      gridH: 12,
      targetSnakes: 100 + Math.round(step * 0.8), // 101 to 132 snakes
      minBlockersOnRay: 8,
      minRescueStep: 50 + step, // 51 to 90
      maxSnakeLength: 6,
      timeLimit: 34,
      difficulty: 'insane',
      description: 'Epic 12x12 labyrinth where every move opens or seals cross-junctions.',
    };
  }

  if (levelId <= 200) {
    const step = levelId - 120;
    return {
      tierNumber: 9,
      tierName: 'Hydra Abyss',
      dangerBadge: 'NIGHTMARE',
      badgeColor: 'fuchsia',
      gridW: 13,
      gridH: 13,
      targetSnakes: 132 + Math.round(step * 0.45), // 133 to 168 snakes
      minBlockersOnRay: 10,
      minRescueStep: 70 + Math.round(step * 0.8),
      maxSnakeLength: 7,
      timeLimit: 32,
      difficulty: 'insane',
      description: 'Colossal 13x13 pit with up to 160+ serpents coiled around the animal.',
    };
  }

  if (levelId <= 400) {
    const step = levelId - 200;
    return {
      tierNumber: 10,
      tierName: "Dragon's Maw",
      dangerBadge: 'TITANIC',
      badgeColor: 'red',
      gridW: 14,
      gridH: 14,
      targetSnakes: 165 + Math.min(30, Math.round(step * 0.2)), // 165 to 195 snakes
      minBlockersOnRay: 12,
      minRescueStep: 90 + Math.min(40, Math.round(step * 0.3)),
      maxSnakeLength: 7,
      timeLimit: 30,
      difficulty: 'insane',
      description: 'Titanic 14x14 arena packed with near-200 interlocking serpents.',
    };
  }

  if (levelId <= 700) {
    const step = levelId - 400;
    return {
      tierNumber: 11,
      tierName: 'Mythic Vortex',
      dangerBadge: 'MYTHIC',
      badgeColor: 'crimson',
      gridW: 15,
      gridH: 15,
      targetSnakes: 195 + Math.min(35, Math.round(step * 0.15)), // 195 to 230 snakes
      minBlockersOnRay: 14,
      minRescueStep: 110 + Math.min(40, Math.round(step * 0.2)),
      maxSnakeLength: 8,
      timeLimit: 30,
      difficulty: 'insane',
      description: 'Mythic 15x15 dimensional maze where clearing one serpent triggers deep chain reactions.',
    };
  }

  // Level 701 - 1000+
  const step = Math.min(300, levelId - 700);
  return {
    tierNumber: 12,
    tierName: 'Leviathan Hellgate',
    dangerBadge: 'IMPOSSIBLE',
    badgeColor: 'violet',
    gridW: 16,
    gridH: 16,
    targetSnakes: 230 + Math.min(30, Math.round(step * 0.1)), // 230 to 260 snakes
    minBlockersOnRay: 16,
    minRescueStep: 130 + Math.min(40, Math.round(step * 0.15)),
    maxSnakeLength: 8,
    timeLimit: 30,
    difficulty: 'insane',
    description: 'The ultimate serpent trial. Over 240 venomous snakes guarding the grand mythical beasts.',
  };
}

/**
 * Deterministically checks if a level is a multi-animal rescue level
 */
export function isMultiAnimalLevel(levelId: number): boolean {
  if (levelId <= 1) return false; // Level 1 is always the single-animal tutorial
  // Deterministic pseudo-random distribution: ~38% of random levels have > 1 animal, plus periodic milestone levels
  const hash = Math.sin(levelId * 9973 + 1337) * 10000;
  const rand = hash - Math.floor(hash);
  return rand < 0.38 || levelId % 4 === 0;
}

/**
 * Deterministically determines how many animals to rescue on a level (1, 2, or 3)
 */
export function getAnimalCountForLevel(levelId: number, gridW: number = 6): number {
  if (!isMultiAnimalLevel(levelId)) return 1;
  const hash = Math.sin(levelId * 4327 + 571) * 10000;
  const rand = hash - Math.floor(hash);
  // Large grids (gridW >= 9) have a 35% chance of 3 animals, otherwise 2 animals
  if (gridW >= 9 && rand < 0.35) {
    return 3;
  }
  return 2;
}

/**
 * Deterministically retrieves the rescue animals for any level (1 or more animals)
 */
export function getRescueAnimalsForLevel(levelId: number, count?: number): RescueAnimal[] {
  const tier = getRescueTierConfig(levelId);
  const animalCount = count ?? getAnimalCountForLevel(levelId, tier.gridW);
  const animals: RescueAnimal[] = [];

  for (let i = 0; i < animalCount; i++) {
    const animalLevel = levelId + i * 23;
    const safeIndex = ((Math.floor(Number(animalLevel) || 1) - 1) % RESCUE_ANIMALS_LIST.length + RESCUE_ANIMALS_LIST.length) % RESCUE_ANIMALS_LIST.length;
    const base = RESCUE_ANIMALS_LIST[safeIndex] || RESCUE_ANIMALS_LIST[0];
    const cycle = Math.max(0, Math.floor((Math.max(1, Number(animalLevel) || 1) - 1) / RESCUE_ANIMALS_LIST.length));
    const titlePrefix = cycle === 0 ? '' : cycle === 1 ? 'Hero ' : cycle === 2 ? 'Elder ' : 'Grand ';

    animals.push({
      id: `animal-lvl-${levelId}-${i}`,
      name: `${titlePrefix}${base.name}`,
      species: base.species,
      emoji: base.emoji,
      quote: base.quote,
      color: base.color,
      tierNumber: tier.tierNumber,
      tierName: tier.tierName,
      dangerBadge: tier.dangerBadge,
      badgeColor: tier.badgeColor,
    });
  }

  return animals;
}

/**
 * Deterministically retrieves the primary rescue animal for any level number 1 to 10000+
 */
export function getRescueAnimalForLevel(levelId: number): RescueAnimal {
  return getRescueAnimalsForLevel(levelId, 1)[0];
}
