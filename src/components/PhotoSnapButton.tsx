import { Camera } from "lucide-react";
import { snapshotResultCard } from "@/lib/photoMode";
import { unlock } from "@/lib/achievements";

interface Props {
  title: string;
  result: string;
  emoji?: string;
  subtitle?: string;
  className?: string;
}

/** Reusable "share as image" button. Builds a result card and downloads PNG. */
export default function PhotoSnapButton({ title, result, emoji, subtitle, className }: Props) {
  const click = async () => {
    await snapshotResultCard({ title, result, emoji, subtitle });
    unlock("snapshot");
  };
  return (
    <button
      onClick={click}
      className={`spring-btn inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted/60 border border-border/40 font-mono ${className ?? ""}`}
      title="Save result as PNG"
    >
      <Camera className="w-3.5 h-3.5" /> Snapshot
    </button>
  );
}
