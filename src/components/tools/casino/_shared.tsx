import { useEffect, useState } from "react";
import { getChips, getActiveEvent, applyEventPayout, awardChips, spendChips, recordGamePlayed, recordGameWon, checkMembership } from "@/lib/casino";
import { getCurrentSeason } from "@/lib/seasons";
import { toast } from "sonner";

/** Live chip counter that re-reads on demand. */
export function useChipCounter() {
  const [chips, setChips] = useState(getChips);
  const refresh = () => setChips(getChips());
  useEffect(() => {
    const id = setInterval(refresh, 800);
    return () => clearInterval(id);
  }, []);
  return { chips, refresh };
}

export function useDailyEvent() {
  const cur = getCurrentSeason();
  const daysIn = cur?.daysIn ?? 0;
  return { event: getActiveEvent(daysIn), daysIn };
}

/** Run a single round: spend stake, award (or not), apply event multipliers, count stats. */
export function playRound(opts: {
  stake: number;
  rawPayout: number; // 0 if loss
  coreGameId: string;
}): { ok: boolean; finalPayout: number; reason?: string } {
  if (!spendChips(opts.stake)) return { ok: false, finalPayout: 0, reason: "Not enough chips" };
  const { daysIn } = (() => {
    const cur = getCurrentSeason();
    return { daysIn: cur?.daysIn ?? 0 };
  })();
  recordGamePlayed(opts.coreGameId);
  let finalPayout = 0;
  if (opts.rawPayout > 0) {
    finalPayout = applyEventPayout(opts.rawPayout, daysIn);
    awardChips(finalPayout);
    recordGameWon();
  }
  if (checkMembership()) {
    toast.success("🎟️ You've been noticed by the House… Casino Membership unlocked.");
  }
  return { ok: true, finalPayout };
}

export function CasinoHeader({ title, subtitle, emoji, chips }: { title: string; subtitle: string; emoji: string; chips: number }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500">{subtitle}</p>
        <h1 className="font-display font-black text-3xl md:text-4xl flex items-center gap-2">
          <span>{emoji}</span> {title}
        </h1>
      </div>
      <div className="rounded-xl px-4 py-2 text-right border border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-black/40">
        <p className="text-[10px] font-mono uppercase text-amber-500/80">Chips</p>
        <p className="text-2xl font-display font-black text-amber-400">💰 {chips}</p>
      </div>
    </div>
  );
}

export function DailyEventBanner() {
  const { event, daysIn } = useDailyEvent();
  return (
    <div className="rounded-xl px-4 py-2.5 border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-black/40 to-amber-950/30 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{event.emoji}</span>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Day {daysIn + 1} · {event.name}</p>
          <p className="text-[11px] text-muted-foreground">{event.description}</p>
        </div>
      </div>
      {event.winMultiplier > 1 && (
        <span className="text-xs font-mono px-2 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40">
          ×{event.winMultiplier} payouts
        </span>
      )}
    </div>
  );
}
