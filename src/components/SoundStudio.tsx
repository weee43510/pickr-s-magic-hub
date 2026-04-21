import { useState } from "react";
import { SOUND_PACKS, getSoundPack, setSoundPack, type SoundPack } from "@/lib/soundPacks";
import { sounds } from "@/lib/sounds";
import { Headphones, Play } from "lucide-react";

export default function SoundStudio() {
  const [pack, setPack] = useState<SoundPack>(getSoundPack);

  const choose = (p: SoundPack) => {
    setPack(p);
    setSoundPack(p);
    setTimeout(() => sounds.click(), 30);
    setTimeout(() => sounds.tick(), 120);
    setTimeout(() => sounds.win(), 250);
  };

  const preview = (s: () => void) => s();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5" /> Sound Studio
        </p>
        <p className="text-[11px] text-muted-foreground">Pick the SFX vibe. Tap a pack to switch + preview.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SOUND_PACKS.map((p) => (
          <button
            key={p.id}
            onClick={() => choose(p.id)}
            className={`spring-btn glass-card p-4 text-left space-y-1 border-2 ${
              pack === p.id ? "border-primary/60 neon-glow-cyan" : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{p.emoji}</span>
              {pack === p.id && <span className="text-[9px] font-mono text-primary">ACTIVE</span>}
            </div>
            <p className="font-display font-bold text-sm">{p.label}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">{p.desc}</p>
          </button>
        ))}
      </div>

      <div className="glass-card p-3 space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Preview sounds</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { l: "Click", fn: sounds.click },
            { l: "Tick", fn: sounds.tick },
            { l: "Flip", fn: sounds.flip },
            { l: "Spin", fn: sounds.spin },
            { l: "Tada", fn: sounds.tada },
            { l: "Mystic", fn: sounds.mystic },
          ].map((s) => (
            <button
              key={s.l}
              onClick={() => preview(s.fn)}
              className="spring-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted/60 text-xs font-mono"
            >
              <Play className="w-3 h-3" /> {s.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
