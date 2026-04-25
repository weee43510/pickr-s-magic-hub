/** Developer notes restored & expanded across the v4.0 → v6.2 journey. */
export interface DevNote {
  date: string;
  title: string;
  body: string;
  mood: "💭" | "🚀" | "🐛" | "✨" | "😅" | "🔥" | "🎯";
}

export const DEV_NOTES: DevNote[] = [
  {
    date: "2026-04-19",
    title: "The whole point",
    body: "I made this in study hall because I was bored. Then I kept adding stuff. Then I couldn't stop. Send help.",
    mood: "😅",
  },
  {
    date: "2026-04-20",
    title: "v4.0 — Themes everywhere",
    body: "Shipped 10 themes today. The HSL editor is honestly the most fun thing in the app. Next up: streaks, mini-games, and the 30-day roadmap.",
    mood: "🎯",
  },
  {
    date: "2026-04-20",
    title: "Easter eggs are addictive",
    body: "Added the Konami code, secret words, and the matrix overlay. Spent way more time on rainbow mode than I should have. Worth it.",
    mood: "✨",
  },
  {
    date: "2026-04-21",
    title: "v5.0 — Settings glow-up",
    body: "Fullscreen settings, tabs, a mini-game inside settings. The Konami code listener was busted — captured key.length === 1 instead of the actual key. Fixed.",
    mood: "🐛",
  },
  {
    date: "2026-04-21",
    title: "v6.0 — Roadmap v1 done",
    body: "All 9 unshipped roadmap stops in one drop. Bingo Tournament, Achievements, Sound Studio, Voice Commands, Pixel Pet — full send. The 3D device picker came out really clean.",
    mood: "🚀",
  },
  {
    date: "2026-04-22",
    title: "v6.1 — Polish day",
    body: "Three new games (Rhythm Tap, Balloon Pop, Math Sprint), Game of the Week rotates by ISO week, suggestions box wired to my email.",
    mood: "✨",
  },
  {
    date: "2026-04-22",
    title: "Pets were a mistake",
    body: "The pixel pet was cute for like a day. Then it just sat there draining stats. Removing it in v6.2 — sorry Pip.",
    mood: "💭",
  },
  {
    date: "2026-04-23",
    title: "v6.2 — Seasons begin",
    body: "First season: The Casino. Four core games + ten exclusives that lock forever once the season ends. FOMO is a feature.",
    mood: "🔥",
  },
  {
    date: "2026-04-23",
    title: "Discovery > pets",
    body: "Replaced the pet with Trending / Hot / Most Replayed sections. Way more useful. Streaks are gone too — they made people feel bad for missing a day.",
    mood: "🎯",
  },
  {
    date: "2026-04-24",
    title: "v7 — Casino Rework",
    body: "Tore down the seasonal placeholders and built a real casino layer: 5 brand-new core games, 12 fresh exclusives with clear unlock panels, persistent chips, a chip shop for cosmetics, Casino Membership, and 14 daily events. Killed the rollback system — nobody used it and it muddied the codebase.",
    mood: "🚀",
  },
  {
    date: "2026-04-24"
    title: "adressing the casino update".
    body: "🎰 So, The Casino Season has been out for 1-2 days now, and i just wanna say, I've been hearing alot of you're guys' problems, and, yes, I AM currently working on fixing them.
📛The main issues that even I experienced myself are chips running out, exclusives games not feeling fun, lots of bugs, membership pass issues, bad shop, toolbar issues, etc. and... you're not crazy 😅

🛠️Now, I cant fix all of these ASAP but, the update WILL be coming out May 1st or 2nd, and heres what I plan on fixing:

Chip recovery system (no more getting stuck at 0)
Interactive exclusive games 
Membership progression + rewards
Better shop + rewards that actually feel worth it
Casino visuals + live countdown
Casino Membership/Season Pass Rework
Toolbar Rework
etc.
🤫

📅Just a reminder that this will NOT be coming out until May 1st so in around 6 more days.

🤷As for Season 2 and my expectations... well, everything will hopefully go according to plan and be infinitely better, with MORE content and exciting features. P.S. this is NOT the final version,  it's more like a live beta.

Thanks for being patient 🙏 more updates May 1st.",
mood: "🛠️",
  },   
];
