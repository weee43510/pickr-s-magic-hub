import { Heart, Sparkles } from "lucide-react";

interface Props {
  variant?: "full" | "compact";
}

/**
 * Farewell banner. The app stays online forever — but development has stopped.
 * Shown on the Dashboard, Season Hub, and Settings → About.
 */
export default function GoodbyeBanner({ variant = "full" }: Props) {
  if (variant === "compact") {
    return (
      <div className="rounded-xl px-4 py-3 border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/30 flex items-center gap-3">
        <Heart className="w-4 h-4 text-rose-300 shrink-0" />
        <p className="text-[11px] text-rose-100/90">
          <span className="font-bold">Farewell — no more updates.</span>{" "}
          <span className="text-rose-200/70">The app stays online forever. Thanks for playing. — Elias</span>
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 p-5 sm:p-6"
      style={{ background: "linear-gradient(135deg, hsl(340 60% 20% / 0.6), hsl(270 50% 18% / 0.6), hsl(40 70% 22% / 0.5))" }}>
      <div className="absolute inset-0 pointer-events-none opacity-50"
        style={{ background: "radial-gradient(circle at 25% 30%, hsl(340 90% 60% / 0.25), transparent 55%), radial-gradient(circle at 80% 70%, hsl(45 90% 55% / 0.2), transparent 55%)" }} />
      <div className="relative space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/40 border border-rose-400/40 text-[10px] font-mono uppercase tracking-[0.3em] text-rose-200">
          <Sparkles className="w-3 h-3" /> A note from Elias
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-rose-50">
          This is goodbye 💛
        </h2>
        <p className="text-sm text-rose-100/90 max-w-2xl leading-relaxed">
          This is the final chapter — <span className="font-bold">no more updates</span> are coming. But the app
          isn't going anywhere: <span className="font-bold">it'll stay online and playable forever</span>. Every
          tool, every casino game, every unlock — yours to keep.
        </p>
        <p className="text-xs text-rose-200/70 italic pt-1">
          Season 1 — The Casino — is officially the <span className="font-bold">first and last season</span>.
          Thanks for spinning, rolling, and bluffing with me. — Elias
        </p>
      </div>
    </div>
  );
}
