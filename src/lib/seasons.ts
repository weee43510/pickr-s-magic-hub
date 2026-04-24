import { loadFromStorage, saveToStorage } from "./storage";
import { getStats, getActiveEvent, permanentlyUnlock, isPermanentlyUnlocked } from "./casino";
import type { ToolId } from "./toolMeta";

export interface Season {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  durationDays: number;
  accent: string;
  bannerGradient: string;
  /** Core PERMANENT casino tool ids that always live in the toolbar. */
  coreToolIds: ToolId[];
  /** 4 game ids from the global tool list that are also "featured" for this season. */
  mainGames: ToolId[];
  /** Brand-new exclusive games per season. */
  exclusiveGames: SeasonExclusiveGame[];
}

export interface UnlockTask {
  /** Plain-English description: "Win 3 Casino games" */
  label: string;
  /** Suggested next action so player knows what to click */
  hint: string;
  /** Returns { progress, target } */
  progress: () => { progress: number; target: number };
}

export interface SeasonExclusiveGame {
  id: string;
  label: string;
  emoji: string;
  description: string;
  /** Reason shown when locked (single sentence). */
  lockReason: string;
  /** One concrete unlock task with progress tracking. */
  task: UnlockTask;
}

// ───────────────── Season 1: The Casino ─────────────────
const SEASON_1: Season = {
  id: "casino",
  name: "The Casino",
  emoji: "🎰",
  tagline: "High rollers only. Place your bets.",
  durationDays: 14,
  accent: "45 95% 55%",
  bannerGradient: "linear-gradient(135deg, hsl(45 95% 55% / 0.25), hsl(0 80% 50% / 0.25), hsl(45 95% 35% / 0.3))",
  coreToolIds: ["flipduel", "neonRoulette", "dealersBluff", "chipCascade", "mindArena"],
  mainGames: ["flipduel", "neonRoulette", "dealersBluff", "chipCascade"],
  exclusiveGames: [
    {
      id: "ex_jackpot_vault",
      label: "Jackpot Vault Break",
      emoji: "🏦",
      description: "Crack the vault — pick the right combo to score the jackpot.",
      lockReason: "Locked: Try the casino floor first.",
      task: {
        label: "Play 3 casino games",
        hint: "Try High Stakes Flip Duel",
        progress: () => ({ progress: getStats().gamesPlayed, target: 3 }),
      },
    },
    {
      id: "ex_golden_dice",
      label: "Golden Dice Arena",
      emoji: "🎲",
      description: "Beat the AI's dice rolls in best-of-three duels.",
      lockReason: "Locked: Win some chips first.",
      task: {
        label: "Earn 50 total chips",
        hint: "Win a round of Neon Roulette",
        progress: () => ({ progress: getStats().totalChipsEarned, target: 50 }),
      },
    },
    {
      id: "ex_neon_slots",
      label: "Neon Slot Frenzy",
      emoji: "🎰",
      description: "Triple-reel neon slots with cascading wilds.",
      lockReason: "Locked: Spin up some wins.",
      task: {
        label: "Win 2 casino games",
        hint: "Try Dealer's Bluff Table",
        progress: () => ({ progress: getStats().gamesWon, target: 2 }),
      },
    },
    {
      id: "ex_roulette_shift",
      label: "Roulette Dimension Shift",
      emoji: "🌀",
      description: "Roulette with rotating multiplier zones every spin.",
      lockReason: "Locked: Master Neon Roulette first.",
      task: {
        label: "Play Neon Roulette 5 times",
        hint: "Open Neon Roulette Wheel",
        progress: () => ({ progress: getStats().coreGamesPlayed["roulette"] || 0, target: 5 }),
      },
    },
    {
      id: "ex_high_roller_poker",
      label: "High Roller Poker Clash",
      emoji: "🃏",
      description: "Five-card draw vs an AI shark with bluff mechanics.",
      lockReason: "Locked: Prove you can read a bluff.",
      task: {
        label: "Play Dealer's Bluff 5 times",
        hint: "Open Dealer's Bluff Table",
        progress: () => ({ progress: getStats().coreGamesPlayed["bluff"] || 0, target: 5 }),
      },
    },
    {
      id: "ex_keno_grid",
      label: "Keno Grid Fortune",
      emoji: "🔢",
      description: "Pick 8 numbers, hope the draw matches yours.",
      lockReason: "Locked: Stack up some chips.",
      task: {
        label: "Earn 100 total chips",
        hint: "Cash out a big Chip Cascade run",
        progress: () => ({ progress: getStats().totalChipsEarned, target: 100 }),
      },
    },
    {
      id: "ex_scratch_reveal",
      label: "Scratch Card Revelation",
      emoji: "🎫",
      description: "Scratch the panels — reveal three matching icons.",
      lockReason: "Locked: Play more casino rounds.",
      task: {
        label: "Play 6 casino games",
        hint: "Any core casino game counts",
        progress: () => ({ progress: getStats().gamesPlayed, target: 6 }),
      },
    },
    {
      id: "ex_casino_heist",
      label: "Casino Heist Run",
      emoji: "🦹",
      description: "Time-based heist: open vaults before security catches you.",
      lockReason: "Locked: Need a steady winning streak.",
      task: {
        label: "Win 5 casino games",
        hint: "Try Mind Arena — guaranteed ×3 on correct",
        progress: () => ({ progress: getStats().gamesWon, target: 5 }),
      },
    },
    {
      id: "ex_double_or_nothing",
      label: "Double or Nothing Reactor",
      emoji: "⚛️",
      description: "Each round, double your stake — or lose it all.",
      lockReason: "Locked: Play more.",
      task: {
        label: "Play 8 casino games",
        hint: "Any casino game counts",
        progress: () => ({ progress: getStats().gamesPlayed, target: 8 }),
      },
    },
    {
      id: "ex_lucky_chase",
      label: "Lucky Number Chase",
      emoji: "🍀",
      description: "Chase your lucky number across a rolling dice grid.",
      lockReason: "Locked: Play Mind Arena first.",
      task: {
        label: "Play Mind Arena 4 times",
        hint: "Open Casino Mind Arena",
        progress: () => ({ progress: getStats().coreGamesPlayed["mindarena"] || 0, target: 4 }),
      },
    },
    {
      id: "ex_chip_storm",
      label: "Chip Storm Survival",
      emoji: "🌪️",
      description: "Dodge falling chip-bombs while collecting golden ones.",
      lockReason: "Locked: Earn more chips.",
      task: {
        label: "Earn 200 total chips",
        hint: "Push Chip Cascade to higher levels",
        progress: () => ({ progress: getStats().totalChipsEarned, target: 200 }),
      },
    },
    {
      id: "ex_royal_jackpot",
      label: "Royal Jackpot Ladder",
      emoji: "👑",
      description: "Climb 10 floors of escalating risk for the Royal Jackpot.",
      lockReason: "Locked: Reach the casino's top tier.",
      task: {
        label: "Unlock 5 other exclusives first",
        hint: "Unlock smaller exclusives to build progress",
        progress: () => ({ progress: getStats().exclusivesUnlocked.length, target: 5 }),
      },
    },
  ],
};

export const ALL_SEASONS: Season[] = [SEASON_1];

// ───────────────── Active season tracking ─────────────────
interface SeasonState {
  seasons: Record<string, { startedAt: number; endedAt?: number }>;
  currentSeasonId: string;
}

const KEY = "season_state_v2";

function loadState(): SeasonState {
  return loadFromStorage<SeasonState>(KEY, {
    seasons: { casino: { startedAt: Date.now() } },
    currentSeasonId: "casino",
  });
}

export function getCurrentSeason(): { season: Season; daysLeft: number; daysIn: number } | null {
  const state = loadState();
  const season = ALL_SEASONS.find((s) => s.id === state.currentSeasonId);
  if (!season) return null;
  const meta = state.seasons[season.id];
  if (!meta) return null;
  const elapsedMs = Date.now() - meta.startedAt;
  const daysIn = Math.floor(elapsedMs / 86400000);
  const daysLeft = Math.max(0, season.durationDays - daysIn);
  return { season, daysLeft, daysIn };
}

export function isSeasonActive(seasonId: string): boolean {
  const cur = getCurrentSeason();
  return cur?.season.id === seasonId && cur.daysLeft > 0;
}

/** Game considered unlocked if (a) season active AND task complete, OR (b) permanently unlocked previously. */
export function isExclusiveUnlocked(seasonId: string, gameId: string): boolean {
  if (isPermanentlyUnlocked(gameId)) return true;
  if (!isSeasonActive(seasonId)) return false;
  const season = ALL_SEASONS.find((s) => s.id === seasonId);
  const game = season?.exclusiveGames.find((g) => g.id === gameId);
  if (!game) return false;
  const { progress, target } = game.task.progress();
  if (progress >= target) {
    permanentlyUnlock(gameId);
    return true;
  }
  // VIP Preview event briefly unlocks all
  if (getActiveEvent(getCurrentSeason()?.daysIn ?? 0).day === 11) return true;
  return false;
}

/** Used for the unlock-status UI. */
export interface UnlockStatus {
  unlocked: boolean;
  permanent: boolean;
  progress: number;
  target: number;
  pct: number;
  badge: "just-started" | "close" | "almost" | "ready" | "done" | "missed";
  task: UnlockTask;
}

export function getUnlockStatus(seasonId: string, gameId: string): UnlockStatus | null {
  const season = ALL_SEASONS.find((s) => s.id === seasonId);
  const game = season?.exclusiveGames.find((g) => g.id === gameId);
  if (!season || !game) return null;
  const permanent = isPermanentlyUnlocked(gameId);
  const { progress, target } = game.task.progress();
  const pct = Math.min(100, Math.round((progress / target) * 100));
  const unlocked = isExclusiveUnlocked(seasonId, gameId);
  const seasonOver = !isSeasonActive(seasonId);
  let badge: UnlockStatus["badge"];
  if (permanent || unlocked) badge = "done";
  else if (seasonOver) badge = "missed";
  else if (pct >= 100) badge = "ready";
  else if (pct >= 70) badge = "almost";
  else if (pct >= 30) badge = "close";
  else badge = "just-started";
  return { unlocked, permanent, progress, target, pct, badge, task: game.task };
}

/** Re-check unlock progress for all exclusives, persisting any newly-finished ones. Returns newly unlocked ids. */
export function checkUnlocks(): string[] {
  const cur = getCurrentSeason();
  if (!cur) return [];
  const newly: string[] = [];
  for (const game of cur.season.exclusiveGames) {
    if (isPermanentlyUnlocked(game.id)) continue;
    const { progress, target } = game.task.progress();
    if (progress >= target) {
      if (permanentlyUnlock(game.id)) newly.push(game.id);
    }
  }
  return newly;
}
