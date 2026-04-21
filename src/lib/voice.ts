import { useEffect, useRef, useState } from "react";

interface Options {
  onCommand?: (cmd: string) => void;
}

const SUPPORTED = typeof window !== "undefined" && (
  "SpeechRecognition" in window || "webkitSpeechRecognition" in window
);

/** Lightweight wrapper around the Web Speech API. */
export function useVoiceCommands({ onCommand }: Options = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (!SUPPORTED) return;
    const SpeechRecognition: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SpeechRecognition();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = (e: any) => {
      const last = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
      setTranscript(last);
      onCommand?.(last);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recRef.current = r;
    return () => { try { r.stop(); } catch {} };
  }, [onCommand]);

  const start = () => {
    if (!recRef.current || listening) return;
    try { recRef.current.start(); setListening(true); } catch {}
  };
  const stop = () => {
    if (!recRef.current) return;
    try { recRef.current.stop(); } catch {}
    setListening(false);
  };

  return { listening, transcript, start, stop, supported: SUPPORTED };
}
