import { useEffect, useState } from "react";
import { CustomTriviaPack, loadCustomPacks, saveCustomPack, deleteCustomPack, parsePack } from "@/lib/triviaPacks";
import { Plus, Trash2, Brain, FileText } from "lucide-react";
import { toast } from "sonner";

export default function CustomTriviaPanel() {
  const [packs, setPacks] = useState<CustomTriviaPack[]>(loadCustomPacks);
  const [name, setName] = useState("");
  const [src, setSrc] = useState("");
  const [show, setShow] = useState(false);

  const refresh = () => setPacks(loadCustomPacks());

  const create = () => {
    if (!src.trim()) { toast.error("Add some questions first"); return; }
    const pack = parsePack(name, src);
    if (pack.questions.length === 0) {
      toast.error("Couldn't parse any questions — check the format");
      return;
    }
    saveCustomPack(pack);
    refresh();
    setName(""); setSrc(""); setShow(false);
    toast.success(`📦 ${pack.questions.length} questions added`);
  };

  const remove = (id: string) => {
    deleteCustomPack(id);
    refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" /> Custom Trivia Packs
          </p>
          <p className="text-[11px] text-muted-foreground">Make your own quizzes — used by the Trivia tool.</p>
        </div>
        <button onClick={() => setShow((s) => !s)} className="spring-btn inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/40 font-bold">
          <Plus className="w-3.5 h-3.5" /> {show ? "Cancel" : "New pack"}
        </button>
      </div>

      {show && (
        <div className="glass-card p-3 space-y-2 animate-fade-in">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pack name (e.g. Office trivia)"
            className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-sm outline-none focus:border-primary/50"
          />
          <textarea
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder={`Paste JSON [{"question":"...","choices":["a","b"],"answer":0}] OR text:\n\nQ: What's 2+2?\nA: 3 | *4* | 5 | 6\n\nQ: ...`}
            rows={8}
            className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-xs font-mono outline-none focus:border-primary/50 resize-y"
          />
          <button onClick={create} className="spring-btn w-full py-2 rounded-lg bg-primary/20 text-primary border border-primary/40 font-bold text-sm">
            Save Pack
          </button>
        </div>
      )}

      {packs.length === 0 ? (
        <p className="text-[11px] text-muted-foreground italic glass-card p-3">
          No custom packs yet. Create one above!
        </p>
      ) : (
        <ul className="space-y-2">
          {packs.map((p) => (
            <li key={p.id} className="glass-card p-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{p.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{p.questions.length} Qs</span>
              </div>
              <button onClick={() => remove(p.id)} className="spring-btn p-1.5 rounded text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
