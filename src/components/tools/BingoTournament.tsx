import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sounds";
import { celebrate, cannons } from "@/lib/confetti";
import { unlock } from "@/lib/achievements";
import { Trophy, Bot, User, Play, RotateCcw, Award, ChevronRight } from "lucide-react";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

const MAX = 75;
function letterFor(n: number) {
  if (n <= 15) return "B";
  if (n <= 30) return "I";
  if (n <= 45) return "N";
  if (n <= 60) return "G";
  return "O";
}

interface Player {
  id: string;
  name: string;
  emoji: string;
  isHuman: boolean;
  speed: number; // ms — lower = faster (AI difficulty)
}

interface Card {
  playerId: string;
  grid: number[];
  marked: boolean[];
}

interface Match {
  a: Player;
  b: Player;
  winner?: Player;
}

const PERSONALITIES: Omit<Player, "isHuman">[] = [
  { id: "ai-1", name: "Speedy Sue",    emoji: "🐎", speed: 250 },
  { id: "ai-2", name: "Lucky Lin",     emoji: "🍀", speed: 320 },
  { id: "ai-3", name: "Big Bot Bob",   emoji: "🤖", speed: 380 },
  { id: "ai-4", name: "Granny Gus",    emoji: "👵", speed: 600 },
  { id: "ai-5", name: "Eagle Ed",      emoji: "🦅", speed: 280 },
  { id: "ai-6", name: "Slow Mo",       emoji: "🦥", speed: 750 },
  { id: "ai-7", name: "Calculator",    emoji: "🧮", speed: 200 },
];

function makeCard(playerId: string): Card {
  const grid: number[] = [];
  for (let col = 0; col < 5; col++) {
    const range = Array.from({ length: 15 }, (_, i) => col * 15 + i + 1);
    for (let i = range.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [range[i], range[j]] = [range[j], range[i]];
    }
    for (let row = 0; row < 5; row++) grid[row * 5 + col] = range[row];
  }
  grid[12] = 0; // free space
  const marked = Array(25).fill(false);
  marked[12] = true;
  return { playerId, grid, marked };
}

function checkBingo(c: Card): boolean {
  const m = c.marked;
  for (let i = 0; i < 5; i++) {
    if (m[i*5] && m[i*5+1] && m[i*5+2] && m[i*5+3] && m[i*5+4]) return true;
    if (m[i] && m[i+5] && m[i+10] && m[i+15] && m[i+20]) return true;
  }
  if (m[0]&&m[6]&&m[12]&&m[18]&&m[24]) return true;
  if (m[4]&&m[8]&&m[12]&&m[16]&&m[20]) return true;
  return false;
}

export default function BingoTournament() {
  const [phase, setPhase] = useState<"setup"|"bracket"|"match"|"final">("setup");
  const [bracket, setBracket] = useState<Match[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [calls, setCalls] = useState<number[]>([]);
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [bestRun, setBestRun] = useState(() => loadFromStorage("bingo_tourney_best", 0));
  const callTimer = useRef<number | null>(null);

  const startTournament = () => {
    const human: Player = { id: "you", name: "You", emoji: "👤", isHuman: true, speed: 9999 };
    const ais: Player[] = [...PERSONALITIES].sort(() => Math.random() - 0.5).slice(0, 7).map((p) => ({ ...p, isHuman: false }));
    const all = [human, ...ais];
    // 8 players → 4 + 2 + 1 matches
    const r1: Match[] = [];
    for (let i = 0; i < 8; i += 2) r1.push({ a: all[i], b: all[i+1] });
    setBracket([r1, [], []]);
    setCurrentRound(0);
    setCurrentMatch(0);
    setPhase("bracket");
  };

  const startNextMatch = () => {
    const round = bracket[currentRound];
    if (currentMatch >= round.length) {
      // round complete — build next round
      const winners = round.map((m) => m.winner!).filter(Boolean);
      if (winners.length === 1) {
        // Tournament over
        setWinnerName(winners[0].name);
        if (winners[0].isHuman) {
          unlock("bingo_tourney");
          cannons();
          if (currentRound + 1 > bestRun) {
            setBestRun(currentRound + 1);
            saveToStorage("bingo_tourney_best", currentRound + 1);
          }
        }
        setPhase("final");
        return;
      }
      const next: Match[] = [];
      for (let i = 0; i < winners.length; i += 2) next.push({ a: winners[i], b: winners[i+1] });
      const nb = [...bracket];
      nb[currentRound + 1] = next;
      setBracket(nb);
      setCurrentRound(currentRound + 1);
      setCurrentMatch(0);
      // Recurse with state
      setTimeout(() => startMatchInternal(next[0]), 100);
      return;
    }
    startMatchInternal(round[currentMatch]);
  };

  const startMatchInternal = (m: Match) => {
    const cs: Record<string, Card> = {};
    cs[m.a.id] = makeCard(m.a.id);
    cs[m.b.id] = makeCard(m.b.id);
    setCards(cs);
    setCalls([]);
    setPhase("match");
    setPaused(false);
  };

  // Number caller loop
  useEffect(() => {
    if (phase !== "match" || paused) return;
    if (callTimer.current) window.clearTimeout(callTimer.current);
    callTimer.current = window.setTimeout(() => {
      setCalls((prev) => {
        const remaining = Array.from({ length: MAX }, (_, i) => i + 1).filter((n) => !prev.includes(n));
        if (!remaining.length) return prev;
        const n = remaining[Math.floor(Math.random() * remaining.length)];
        sounds.click();
        return [...prev, n];
      });
    }, 1800);
    return () => { if (callTimer.current) window.clearTimeout(callTimer.current); };
  }, [calls, phase, paused]);

  // AI auto-mark with personality speed
  useEffect(() => {
    if (phase !== "match" || calls.length === 0) return;
    const lastCall = calls[calls.length - 1];
    const match = bracket[currentRound][currentMatch];
    if (!match) return;
    [match.a, match.b].forEach((p) => {
      if (p.isHuman) return;
      const t = setTimeout(() => {
        setCards((cs) => {
          const c = cs[p.id];
          if (!c) return cs;
          const idx = c.grid.indexOf(lastCall);
          if (idx < 0 || c.marked[idx]) return cs;
          // chance to miss based on speed
          if (Math.random() < 0.05) return cs;
          const newCard = { ...c, marked: c.marked.slice() };
          newCard.marked[idx] = true;
          const updated = { ...cs, [p.id]: newCard };
          if (checkBingo(newCard)) {
            setTimeout(() => declareWinner(p), 200);
          }
          return updated;
        });
      }, p.speed + Math.random() * 200);
      return () => clearTimeout(t);
    });
  }, [calls]);

  const declareWinner = (p: Player) => {
    if (callTimer.current) window.clearTimeout(callTimer.current);
    const nb = bracket.map((round) => round.map((m) => ({ ...m })));
    nb[currentRound][currentMatch] = { ...nb[currentRound][currentMatch], winner: p };
    setBracket(nb);
    if (p.isHuman) celebrate("medium");
    sounds.win();
    setPhase("bracket");
    setCurrentMatch((m) => m + 1);
  };

  const tapMark = (idx: number) => {
    const m = bracket[currentRound][currentMatch];
    if (!m) return;
    const human = [m.a, m.b].find((p) => p.isHuman);
    if (!human) return;
    setCards((cs) => {
      const c = cs[human.id];
      if (!c) return cs;
      const num = c.grid[idx];
      if (!calls.includes(num)) return cs;
      const newCard = { ...c, marked: c.marked.slice() };
      newCard.marked[idx] = !newCard.marked[idx];
      sounds.tick();
      const updated = { ...cs, [human.id]: newCard };
      if (checkBingo(newCard)) setTimeout(() => declareWinner(human), 200);
      return updated;
    });
  };

  const reset = () => { setPhase("setup"); setBracket([]); setCalls([]); setCards({}); setWinnerName(null); };

  const lastCall = calls[calls.length - 1];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">PARTY · TOURNAMENT</p>
        <h1 className="font-display font-black text-4xl gradient-text">Bingo Tournament</h1>
        <p className="text-sm text-muted-foreground mt-1">8-player bracket. Beat 7 AI personalities to take the crown.</p>
      </div>

      {phase === "setup" && (
        <div className="glass-card p-6 space-y-4 text-center">
          <Trophy className="w-12 h-12 text-neon-pink mx-auto" />
          <h2 className="font-display font-bold text-2xl">Ready to compete?</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Single-elimination bracket. 3 rounds. Each match is a fresh card —
            mark fast, win first, advance.
          </p>
          {bestRun > 0 && (
            <p className="text-xs font-mono text-muted-foreground">Best run: round {bestRun}/3</p>
          )}
          <button onClick={startTournament} className="spring-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 border-2 border-primary/50 text-primary font-display font-bold text-lg neon-glow-cyan">
            <Play className="w-5 h-5" /> Start Tournament
          </button>
        </div>
      )}

      {phase === "bracket" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Bracket — Round {currentRound + 1}</p>
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground spring-btn flex items-center gap-1"><RotateCcw className="w-3 h-3" />Restart</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {bracket.map((round, r) => (
              <div key={r} className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center">
                  {r === 0 ? "Quarterfinals" : r === 1 ? "Semis" : "FINAL"}
                </p>
                {round.length === 0 ? (
                  <div className="glass-card p-3 text-center text-xs text-muted-foreground italic">TBD</div>
                ) : round.map((m, i) => (
                  <div key={i} className={`glass-card p-3 space-y-1 ${r === currentRound && i === currentMatch ? "ring-2 ring-neon-cyan/60" : ""}`}>
                    <PlayerRow p={m.a} winner={m.winner?.id === m.a.id} loser={!!m.winner && m.winner.id !== m.a.id} />
                    <PlayerRow p={m.b} winner={m.winner?.id === m.b.id} loser={!!m.winner && m.winner.id !== m.b.id} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            onClick={startNextMatch}
            className="spring-btn w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 border border-primary/40 font-display font-bold inline-flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-5 h-5" /> Play Next Match
          </button>
        </div>
      )}

      {phase === "match" && (() => {
        const m = bracket[currentRound][currentMatch];
        if (!m) return null;
        const human = [m.a, m.b].find((p) => p.isHuman);
        const opponent = [m.a, m.b].find((p) => !p.isHuman) || (m.a.isHuman ? m.b : m.a);
        const myCard = human ? cards[human.id] : null;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between glass-card p-3">
              <div className="text-center">
                <p className="text-[10px] font-mono uppercase text-muted-foreground">Match</p>
                <p className="font-display font-bold">{m.a.emoji} vs {m.b.emoji}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono uppercase text-muted-foreground">Last call</p>
                <p className="font-display font-black text-3xl gradient-text">
                  {lastCall ? `${letterFor(lastCall)}-${lastCall}` : "—"}
                </p>
              </div>
              <button onClick={() => setPaused((p) => !p)} className="text-xs px-3 py-1 rounded bg-muted/40 spring-btn">
                {paused ? "Resume" : "Pause"}
              </button>
            </div>

            {myCard ? (
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2 text-center">Your card · tap called numbers fast</p>
                <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto">
                  {["B","I","N","G","O"].map((l) => (
                    <div key={l} className="aspect-square flex items-center justify-center font-display font-black text-lg gradient-text">{l}</div>
                  ))}
                  {myCard.grid.map((n, i) => {
                    const called = n === 0 || calls.includes(n);
                    const marked = myCard.marked[i];
                    return (
                      <button
                        key={i}
                        onClick={() => tapMark(i)}
                        disabled={!called || n === 0}
                        className={`aspect-square rounded-lg text-sm font-bold spring-btn border-2 ${
                          marked ? "bg-neon-pink/30 border-neon-pink text-neon-pink" :
                          called ? "bg-primary/20 border-primary/40 text-primary animate-pulse" :
                          "bg-muted/30 border-border/30 text-muted-foreground"
                        }`}
                      >
                        {n === 0 ? "★" : n}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground text-center mt-3">
                  Opponent: <span className="font-bold text-foreground">{opponent.emoji} {opponent.name}</span>
                </p>
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-sm">{m.a.emoji} {m.a.name} vs {m.b.emoji} {m.b.name}</p>
                <p className="text-xs text-muted-foreground mt-2">AI vs AI — auto-resolving…</p>
                <div className="mt-3 text-2xl animate-spin inline-block">⚙️</div>
              </div>
            )}
          </div>
        );
      })()}

      {phase === "final" && (
        <div className="glass-card p-8 text-center space-y-4">
          <Award className="w-16 h-16 text-neon-pink mx-auto" />
          <h2 className="font-display font-black text-3xl gradient-text">{winnerName} wins!</h2>
          <p className="text-sm text-muted-foreground">Made it to the final · 3 rounds</p>
          <button onClick={reset} className="spring-btn px-6 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary font-bold">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

function PlayerRow({ p, winner, loser }: { p: Player; winner?: boolean; loser?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded ${winner ? "bg-neon-green/15 text-neon-green" : loser ? "opacity-40 line-through" : ""}`}>
      <span>{p.emoji}</span>
      <span className="text-xs font-medium flex-1 truncate">{p.name}</span>
      {winner && <Trophy className="w-3 h-3" />}
    </div>
  );
}
