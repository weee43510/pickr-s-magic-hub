import { useState, useEffect } from "react";
import { ShoppingBag, Check, Lock } from "lucide-react";
import { SHOP_ITEMS, getOwned, buy, getChips, isMember } from "@/lib/casino";
import { CasinoHeader, DailyEventBanner } from "./_shared";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "theme",  label: "🎨 Themes" },
  { id: "fx",     label: "✨ Effects" },
  { id: "sound",  label: "🎙️ Sound" },
  { id: "ui",     label: "🪙 UI Skins" },
] as const;

export default function ChipShop() {
  const [chips, setChipsState] = useState(getChips());
  const [owned, setOwned] = useState<string[]>(getOwned());
  const [cat, setCat] = useState<typeof CATEGORIES[number]["id"]>("theme");
  const member = isMember();

  useEffect(() => {
    const id = setInterval(() => {
      setChipsState(getChips());
      setOwned(getOwned());
    }, 800);
    return () => clearInterval(id);
  }, []);

  const handleBuy = (id: string, label: string, cost: number) => {
    const r = buy(id);
    if (r.ok) {
      toast.success(`✅ Purchased ${label} for ${cost} chips`);
      setChipsState(getChips());
      setOwned(getOwned());
    } else {
      toast.error(r.reason || "Couldn't buy");
    }
  };

  const items = SHOP_ITEMS.filter((i) => i.category === cat);

  return (
    <div className="space-y-5 animate-fade-in">
      <CasinoHeader title="Chip Shop" subtitle="Casino · Cosmetics" emoji="🛍️" chips={chips} />
      <DailyEventBanner />

      {member && (
        <div className="rounded-xl px-4 py-2.5 border border-amber-400/50 bg-gradient-to-r from-amber-500/15 to-amber-700/15">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-300 flex items-center gap-2">
            🎟️ Casino Membership · Active
          </p>
          <p className="text-[11px] text-muted-foreground">Cosmetic perks unlocked. Spend chips here on visual upgrades.</p>
        </div>
      )}

      <div className="flex gap-1 p-1 rounded-lg bg-muted/30 w-fit border border-border/40">
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`spring-btn px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider ${
            cat === c.id ? "bg-amber-500/20 text-amber-300" : "text-muted-foreground"
          }`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const isOwn = owned.includes(item.id);
          const canAfford = chips >= item.cost;
          return (
            <div key={item.id} className={`rounded-xl p-4 border-2 space-y-2 ${
              isOwn ? "border-emerald-500/50 bg-emerald-500/5"
              : canAfford ? "border-amber-500/40 bg-gradient-to-br from-black/40 to-amber-950/20"
              : "border-border/30 bg-muted/10 opacity-80"
            }`}>
              <div className="flex items-start justify-between">
                <span className="text-3xl">{item.emoji}</span>
                {isOwn ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3" /> OWNED
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400">💰 {item.cost}</span>
                )}
              </div>
              <p className="font-display font-bold text-sm">{item.label}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{item.description}</p>
              {!isOwn && (
                <button
                  onClick={() => handleBuy(item.id, item.label, item.cost)}
                  disabled={!canAfford}
                  className="w-full spring-btn text-xs px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  {canAfford ? <ShoppingBag className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {canAfford ? `Buy · ${item.cost}` : `Need ${item.cost - chips} more`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
