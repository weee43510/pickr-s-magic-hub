import { loadFromStorage, saveToStorage } from "./storage";

// ─────────────── CHIPS ECONOMY ───────────────
const CHIPS_KEY = "casino_chips";
const STARTING_CHIPS = 100;

export function getChips(): number {
  const v = loadFromStorage<number | null>(CHIPS_KEY, null);
  if (v === null) {
    saveToStorage(CHIPS_KEY, STARTING_CHIPS);
    return STARTING_CHIPS;
  }
  return v;
}

export function setChips(n: number) { saveToStorage(CHIPS_KEY, Math.max(0, Math.floor(n))); }

export function spendChips(n: number): boolean {
  const c = getChips();
  if (c < n) return false;
  setChips(c - n);
  return true;
}

export function awardChips(n: number) { setChips(getChips() + Math.floor(n)); recordChipsEarned(Math.floor(n)); }

// ─────────────── CHIP STATS (for unlocks) ───────────────
const STATS_KEY = "casino_stats_v1";
export interface CasinoStats {
  gamesPlayed: number;
  gamesWon: number;
  totalChipsEarned: number;
  eventsCompleted: number;
  coreGamesPlayed: Record<string, number>; // by game id
  exclusivesUnlocked: string[];
}

export function getStats(): CasinoStats {
  return loadFromStorage<CasinoStats>(STATS_KEY, {
    gamesPlayed: 0,
    gamesWon: 0,
    totalChipsEarned: 0,
    eventsCompleted: 0,
    coreGamesPlayed: {},
    exclusivesUnlocked: [],
  });
}

function saveStats(s: CasinoStats) { saveToStorage(STATS_KEY, s); }

export function recordGamePlayed(coreGameId?: string) {
  const s = getStats();
  s.gamesPlayed += 1;
  if (coreGameId) s.coreGamesPlayed[coreGameId] = (s.coreGamesPlayed[coreGameId] || 0) + 1;
  saveStats(s);
}

export function recordGameWon() { const s = getStats(); s.gamesWon += 1; saveStats(s); }
function recordChipsEarned(n: number) { const s = getStats(); s.totalChipsEarned += n; saveStats(s); }
export function recordEventCompleted() { const s = getStats(); s.eventsCompleted += 1; saveStats(s); }

// ─────────────── CASINO MEMBERSHIP ───────────────
const MEMBERSHIP_KEY = "casino_membership_v1";

export function isMember(): boolean { return loadFromStorage(MEMBERSHIP_KEY, false); }

/** Returns true if just unlocked. */
export function checkMembership(): boolean {
  if (isMember()) return false;
  const s = getStats();
  if (s.totalChipsEarned >= 100 || s.gamesPlayed >= 3) {
    saveToStorage(MEMBERSHIP_KEY, true);
    return true;
  }
  return false;
}

// ─────────────── CHIP SHOP ───────────────
export interface ShopItem {
  id: string;
  label: string;
  emoji: string;
  cost: number;
  category: "theme" | "fx" | "sound" | "ui";
  description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "theme_velvet",    label: "Velvet Casino Theme",  emoji: "🟣", cost: 50,  category: "theme",  description: "Deep purple felt + gold trim across the casino." },
  { id: "theme_obsidian",  label: "Obsidian VIP Theme",   emoji: "⚫", cost: 80,  category: "theme",  description: "Pitch-black UI with neon-gold accents." },
  { id: "fx_chip_rain",    label: "Chip Rain on Win",     emoji: "💸", cost: 40,  category: "fx",     description: "Cascading chips fall from the top whenever you win." },
  { id: "fx_neon_pulse",   label: "Neon Pulse Borders",   emoji: "💡", cost: 35,  category: "fx",     description: "Glowing pulse around your chip counter." },
  { id: "sound_velvet",    label: "Velvet Dealer Voice",  emoji: "🎙️", cost: 60,  category: "sound",  description: "Smooth cinematic announcements on big wins." },
  { id: "sound_jackpot",   label: "Jackpot Sirens Pack",  emoji: "🚨", cost: 45,  category: "sound",  description: "Old-school jackpot sirens replace win chimes." },
  { id: "ui_gold_ring",    label: "Gold Ring Cursor",     emoji: "💍", cost: 30,  category: "ui",     description: "Cursor leaves a faint gold trail in casino games." },
  { id: "ui_chip_skin",    label: "Antique Chip Skin",    emoji: "🪙", cost: 55,  category: "ui",     description: "Replace the 💰 chip icon with vintage casino chips." },
];

const OWNED_KEY = "casino_shop_owned";
export function getOwned(): string[] { return loadFromStorage<string[]>(OWNED_KEY, []); }
export function isOwned(id: string): boolean { return getOwned().includes(id); }
export function buy(id: string): { ok: boolean; reason?: string } {
  if (isOwned(id)) return { ok: false, reason: "Already owned" };
  const item = SHOP_ITEMS.find((i) => i.id === id);
  if (!item) return { ok: false, reason: "Unknown item" };
  if (!spendChips(item.cost)) return { ok: false, reason: "Not enough chips" };
  saveToStorage(OWNED_KEY, [...getOwned(), id]);
  return { ok: true };
}

// ─────────────── DAILY EVENTS ───────────────
export interface DailyEvent {
  day: number;
  name: string;
  emoji: string;
  description: string;
  /** Multiplier applied to chip wins. */
  winMultiplier: number;
  /** Extra chips on each game played. */
  bonusOnPlay: number;
  /** UI flag for special visual treatment. */
  visualMode?: "neon" | "gold" | "silent" | "chaos" | "cinematic";
}

export const DAILY_EVENTS: DailyEvent[] = [
  { day: 1,  name: "Grand Opening",   emoji: "🎉", description: "+5 bonus chips every game.",        winMultiplier: 1,    bonusOnPlay: 5 },
  { day: 2,  name: "Lucky Doubles",   emoji: "🍀", description: "All payouts ×2.",                   winMultiplier: 2,    bonusOnPlay: 0 },
  { day: 3,  name: "Neon Surge",      emoji: "💡", description: "Visuals turn neon. Pure vibes.",    winMultiplier: 1.1,  bonusOnPlay: 0, visualMode: "neon" },
  { day: 4,  name: "Dealer Shift",    emoji: "🎩", description: "AI dealers play smarter.",          winMultiplier: 1.5,  bonusOnPlay: 0 },
  { day: 5,  name: "Golden Night",    emoji: "🌙", description: "Casino bathed in gold.",            winMultiplier: 1.25, bonusOnPlay: 0, visualMode: "gold" },
  { day: 6,  name: "High Stakes Day", emoji: "🔥", description: "Wins ×3, losses sting more.",       winMultiplier: 3,    bonusOnPlay: 0 },
  { day: 7,  name: "Mid-Season Boost",emoji: "🎁", description: "+10 chips per game.",               winMultiplier: 1,    bonusOnPlay: 10 },
  { day: 8,  name: "Silent Casino",   emoji: "🤫", description: "Sound dialed back. Focus mode.",    winMultiplier: 1.2,  bonusOnPlay: 0, visualMode: "silent" },
  { day: 9,  name: "Jackpot Week",    emoji: "🎰", description: "Rare wins are 4× more frequent.",   winMultiplier: 1.5,  bonusOnPlay: 0 },
  { day: 10, name: "Chaos Mode",      emoji: "🌀", description: "Random multipliers per session.",   winMultiplier: 2,    bonusOnPlay: 0, visualMode: "chaos" },
  { day: 11, name: "VIP Preview",     emoji: "🎟️", description: "Locked games briefly playable.",    winMultiplier: 1,    bonusOnPlay: 0 },
  { day: 12, name: "Double Stakes",   emoji: "💰", description: "Bets ×2, payouts ×2.",              winMultiplier: 2,    bonusOnPlay: 0 },
  { day: 13, name: "Final Build-Up",  emoji: "⚡", description: "Progress accelerated.",             winMultiplier: 1.5,  bonusOnPlay: 5 },
  { day: 14, name: "Grand Finale",    emoji: "🏆", description: "Cinematic finish — wins ×5.",       winMultiplier: 5,    bonusOnPlay: 15, visualMode: "cinematic" },
];

/** Returns the active event based on the day-of-season passed in. */
export function getActiveEvent(daysIn: number): DailyEvent {
  const d = Math.max(1, Math.min(14, daysIn + 1));
  return DAILY_EVENTS.find((e) => e.day === d) || DAILY_EVENTS[0];
}

/** Apply the active event's multiplier to a raw payout. */
export function applyEventPayout(rawPayout: number, daysIn: number): number {
  const e = getActiveEvent(daysIn);
  return Math.floor(rawPayout * e.winMultiplier + e.bonusOnPlay);
}

// ─────────────── PERMANENT SEASONAL UNLOCKS ───────────────
const PERM_UNLOCK_KEY = "casino_perm_unlocks_v1";

export function getPermanentlyUnlocked(): string[] {
  return loadFromStorage<string[]>(PERM_UNLOCK_KEY, []);
}

export function permanentlyUnlock(id: string): boolean {
  const list = getPermanentlyUnlocked();
  if (list.includes(id)) return false;
  const next = [...list, id];
  saveToStorage(PERM_UNLOCK_KEY, next);
  const s = getStats();
  if (!s.exclusivesUnlocked.includes(id)) {
    s.exclusivesUnlocked.push(id);
    saveStats(s);
  }
  return true;
}

export function isPermanentlyUnlocked(id: string): boolean {
  return getPermanentlyUnlocked().includes(id);
}
