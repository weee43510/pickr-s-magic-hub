import { useEffect, useState } from "react";
import { ACHIEVEMENTS, getUnlocked, rarityColor, type Achievement } from "@/lib/achievements";
import { Trophy, Lock } from "lucide-react";

export default function AchievementsPanel() {
  const [unlocked, setUnlocked] = useState(getUnlocked);
  const [filter, setFilter] = useState<"all" | Achievement["rarity"]>("all");

  useEffect(() => {
    const id = setInterval(() => setUnlocked(getUnlocked()), 1500);
    return () => clearInterval(id);
  }, []);

  const filtered = ACHIEVEMENTS.filter((a) => filter === "all" || a.rarity === filter);
  const totalUnlocked = Object.keys(unlocked).length;
  const pct = Math.round((totalUnlocked / ACHIEVEMENTS.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Achievements
          </p>
          <p className="text-sm font-bold">{totalUnlocked} / {ACHIEVEMENTS.length} unlocked · {pct}%</p>
        </div>
        <div className="flex gap-1">
          {(["all","common","rare","epic","legendary"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`spring-btn text-[10px] font-mono uppercase px-2 py-1 rounded ${
                filter === r ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((a) => {
          const u = !!unlocked[a.id];
          return (
            <div
              key={a.id}
              className={`glass-card p-3 space-y-1 transition-all ${u ? "" : "opacity-50 grayscale"}`}
              style={{ borderColor: u ? `${rarityColor(a.rarity)}66` : undefined }}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{u ? a.icon : "🔒"}</span>
                <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: rarityColor(a.rarity) }}>
                  {a.rarity}
                </span>
              </div>
              <p className="text-sm font-display font-bold leading-tight">{a.title}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{a.description}</p>
              {u && <p className="text-[9px] font-mono text-neon-green">UNLOCKED</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
