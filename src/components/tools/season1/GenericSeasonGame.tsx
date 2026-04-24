import { useState } from "react";
import { sounds } from "@/lib/sounds";
import { celebrate } from "@/lib/confetti";
import type { Season, SeasonExclusiveGame } from "@/lib/seasons";
import { CasinoHeader, DailyEventBanner, useChipCounter, playRound } from "@/components/tools/casino/_shared";

interface Props {
  game: SeasonExclusiveGame;
  season: Season;
}

/** Generic playable shell for season exclusives that don't have a custom screen yet.
 *  A quick "press your luck" mini-game themed to the season. Uses the chips economy. */
export default function GenericSeasonGame({ game, season }: Props) {
  const { chips, refresh } = useChipCounter();
  const [history, setHistory] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const play = () => {
    if (busy || chips < 5) return;
    if (!playRound({ stake: 5, rawPayout: 0, coreGameId: `exclusive_${game.id}` }).ok) return;
    setBusy(true);
    refresh();
    sounds.click();
    const roll = Math.random();
    setTimeout(() => {
      let line: string;
      if (roll > 0.92) {
        const round = playRound({ stake: 0, rawPayout: 50, coreGameId: `exclusive_${game.id}` });
        line = `💥 BIG WIN +${round.finalPayout}`;
        celebrate("medium");
        sounds.win();
      } else if (roll > 0.55) {
        const round = playRound({ stake: 0, rawPayout: 12, coreGameId: `exclusive_${game.id}` });
        line = `✅ Win +${round.finalPayout}`;
        sounds.win();
      } else {
        line = `❌ Loss −5`;
      }
      setHistory((h) => [line, ...h].slice(0, 8));
      setBusy(false);
      refresh();
    }, 600);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <CasinoHeader title={game.label} subtitle={`${season.name} · Exclusive`} emoji={game.emoji} chips={chips} />
      <DailyEventBanner />

      <div className="rounded-2xl p-8 border border-amber-500/30 bg-gradient-to-br from-black/70 to-amber-950/30 text-center space-y-4">
        <div className="text-7xl">{game.emoji}</div>
        <p className="text-xs text-muted-foreground italic max-w-md mx-auto">
          {game.description} — costs 5 chips per play. Win up to 50.
          A deeper version is in the workshop.
        </p>
        <button
          onClick={play}
          disabled={busy || chips < 5}
          className="spring-btn px-8 py-4 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-lg disabled:opacity-50"
        >
          {busy ? "…" : "Play · 5 chips"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="rounded-xl p-3 border border-border/40 bg-muted/10">
          <p className="text-[10px] font-mono uppercase text-muted-foreground mb-2">Recent rolls</p>
          <ul className="text-sm space-y-1 font-mono">
            {history.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
