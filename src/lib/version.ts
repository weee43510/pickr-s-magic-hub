export const APP_VERSION = "6.0.0";

export interface ChangelogEntry { version: string; date: string; notes: string[]; }

export const CHANGELOGS: ChangelogEntry[] = [
  {
    version: "6.0.0",
    date: "2026-04-21",
    notes: [
      "🚀 MAJOR: Roadmap v1 fully shipped — 9 new features in one drop",
      "🏆 NEW: Bingo Tournament — 8-player single-elim bracket vs 7 AI personalities",
      "🏅 NEW: Achievements — 30 unlockable badges with rarity tiers",
      "🎧 NEW: Sound Studio — 4 SFX packs (Modern, Retro 8-bit, Silly, Muted)",
      "🧠 NEW: Custom Trivia Packs — paste JSON or text, used by Trivia tool",
      "🎡 NEW: Wheel Templates — 6 one-click presets (lunch, chores, dares, etc.)",
      "🐣 NEW: Pixel Pet — floating mascot, mood-aware, poke for energy",
      "📸 NEW: Photo Mode — snapshot any result as a shareable PNG",
      "🎙️ NEW: Voice Commands — say 'spin', 'roll', 'flip', 'next'",
      "🏠 NEW: Homepage Dashboard — search, favorites, recently used, all tools",
      "📱 Reworked Device Picker — 3D tilt cards, magazine layout, sticker badges",
      "🛣️ Roadmap v2.0 published — 15 new stops, multiplayer-themed",
    ],
  },
  {
    version: "5.0.0",
    date: "2026-04-21",
    notes: [
      "Settings fullscreen with 5 tabs",
      "Theme Editor with live HSL sliders",
      "Daily Streaks with 7-day confetti",
      "Tic-Tac-Toe & Color Match",
      "Konami code fixed",
    ],
  },
  {
    version: "4.0.0",
    date: "2026-04-20",
    notes: ["10 themes, 6 new mini-games, 30-day roadmap, easter eggs"],
  },
];

export interface RoadmapStop {
  day: number; title: string; detail: string; icon: string;
  status: "shipped" | "next" | "planned";
}

export const ROADMAP: RoadmapStop[] = [
  { day: 0, title: "v4.0 Launch", detail: "10 themes, 6 new games", icon: "🚀", status: "shipped" },
  { day: 2, title: "Theme Editor", detail: "Live HSL sliders", icon: "🎨", status: "shipped" },
  { day: 4, title: "Daily Streaks", detail: "Login streak + bonuses", icon: "🔥", status: "shipped" },
  { day: 6, title: "Tic-Tac-Toe", detail: "Vs AI · 3 difficulties", icon: "❌", status: "shipped" },
  { day: 8, title: "Color Match", detail: "Reflex grid", icon: "🎯", status: "shipped" },
  { day: 10, title: "v5.0 Settings", detail: "Fullscreen tabs", icon: "⚙️", status: "shipped" },
  { day: 12, title: "Bingo Tournament", detail: "8-player bracket vs AI", icon: "🏆", status: "shipped" },
  { day: 14, title: "Achievements", detail: "30 unlockable badges", icon: "🏅", status: "shipped" },
  { day: 16, title: "Sound Studio", detail: "4 SFX packs", icon: "🎧", status: "shipped" },
  { day: 18, title: "Custom Trivia", detail: "Paste JSON or text", icon: "🧠", status: "shipped" },
  { day: 20, title: "Wheel Templates", detail: "6 one-click presets", icon: "🎡", status: "shipped" },
  { day: 22, title: "Pixel Pet", detail: "Mood-aware mascot", icon: "🐣", status: "shipped" },
  { day: 24, title: "Photo Mode", detail: "Export as PNG", icon: "📸", status: "shipped" },
  { day: 26, title: "Voice Commands", detail: "Spin/Roll/Flip by voice", icon: "🎙️", status: "shipped" },
  { day: 28, title: "v6.0 Dashboard", detail: "Homepage + 3D device picker", icon: "🏠", status: "shipped" },
];

// Roadmap v2.0 — multiplayer & social, 15 stops
export const ROADMAP_V2: RoadmapStop[] = [
  { day: 0, title: "v6.0 Multiplayer", detail: "Real-time rooms — bring everyone in", icon: "🌐", status: "next" },
  { day: 2, title: "Live Bingo Rooms", detail: "Up to 16 friends, shared caller", icon: "📡", status: "planned" },
  { day: 4, title: "Friends List", detail: "Add by code, see who's online", icon: "👥", status: "planned" },
  { day: 6, title: "Global Leaderboards", detail: "Per-tool top 100", icon: "🏆", status: "planned" },
  { day: 8, title: "Shared Wheels", detail: "Co-edit & spin with friends", icon: "🎡", status: "planned" },
  { day: 10, title: "Voice Chat Rooms", detail: "Built-in WebRTC voice", icon: "🎤", status: "planned" },
  { day: 12, title: "Tournaments 2.0", detail: "Cross-tool brackets, prizes", icon: "🥇", status: "planned" },
  { day: 14, title: "Async Games", detail: "Play moves over hours/days", icon: "📬", status: "planned" },
  { day: 16, title: "Custom Avatars", detail: "Pixel-art editor + accessories", icon: "🧑‍🎨", status: "planned" },
  { day: 18, title: "Party Codes", detail: "4-letter codes to join instantly", icon: "🔑", status: "planned" },
  { day: 20, title: "Spectator Mode", detail: "Watch friends play live", icon: "👁️", status: "planned" },
  { day: 22, title: "Replays", detail: "Save & share game replays", icon: "⏪", status: "planned" },
  { day: 24, title: "Clan System", detail: "Form crews, weekly challenges", icon: "🛡️", status: "planned" },
  { day: 26, title: "Cross-Device Sync", detail: "Continue on any device", icon: "☁️", status: "planned" },
  { day: 28, title: "v7.0 World Cup", detail: "Global Randomizr tournament", icon: "🌍", status: "planned" },
];
