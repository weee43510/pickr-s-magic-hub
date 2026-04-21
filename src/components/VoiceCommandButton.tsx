import { useEffect, useRef, useState } from "react";
import { useVoiceCommands } from "@/lib/voice";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { unlock } from "@/lib/achievements";

interface Props {
  onCommand: (cmd: string) => void;
}

/** Floating voice-command button. Listens for keywords. */
export default function VoiceCommandButton({ onCommand }: Props) {
  const lastRef = useRef("");
  const { listening, transcript, start, stop, supported } = useVoiceCommands({
    onCommand: (t) => {
      if (t === lastRef.current) return;
      lastRef.current = t;
      const lc = t.toLowerCase();
      const keywords = ["spin","roll","flip","next","go","start","call","pick","random"];
      const found = keywords.find((k) => lc.includes(k));
      if (found) {
        onCommand(found);
        toast(`🎙️ Heard: "${found}"`);
        unlock("voice_used");
      }
    },
  });

  if (!supported) return null;

  return (
    <button
      onClick={() => (listening ? stop() : start())}
      title={listening ? "Stop listening" : "Voice commands (try 'spin', 'roll', 'flip', 'next')"}
      className={`spring-btn fixed bottom-4 left-4 z-40 w-12 h-12 rounded-full glass-card flex items-center justify-center transition-all ${
        listening ? "ring-4 ring-neon-pink/60 animate-pulse" : ""
      }`}
    >
      {listening ? <Mic className="w-5 h-5 text-neon-pink" /> : <MicOff className="w-5 h-5 text-muted-foreground" />}
    </button>
  );
}
