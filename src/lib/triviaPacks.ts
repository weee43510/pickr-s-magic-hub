import { loadFromStorage, saveToStorage } from "./storage";
import { TRIVIA, type TriviaQuestion } from "@/data/trivia";

export interface CustomTriviaPack {
  id: string;
  name: string;
  questions: TriviaQuestion[];
  createdAt: number;
}

export function loadCustomPacks(): CustomTriviaPack[] {
  return loadFromStorage<CustomTriviaPack[]>("trivia_custom_packs", []);
}

export function saveCustomPack(pack: CustomTriviaPack) {
  const existing = loadCustomPacks().filter((p) => p.id !== pack.id);
  saveToStorage("trivia_custom_packs", [...existing, pack]);
}

export function deleteCustomPack(id: string) {
  saveToStorage("trivia_custom_packs", loadCustomPacks().filter((p) => p.id !== id));
}

/** Parse a JSON string or simple text format into a custom pack. */
export function parsePack(name: string, source: string): CustomTriviaPack {
  let questions: TriviaQuestion[] = [];
  // Try JSON first
  try {
    const parsed = JSON.parse(source);
    if (Array.isArray(parsed)) {
      questions = parsed.filter((q) => q && q.question && Array.isArray(q.choices) && typeof q.answer === "number")
        .map((q) => ({ category: (q.category || "General"), question: q.question, choices: q.choices, answer: q.answer }));
    }
  } catch {
    // Fall back to plain text format:
    // Q: ...?
    // A: choice1 | choice2 | choice3 | *correct*
    const blocks = source.split(/\n\s*\n/);
    blocks.forEach((b) => {
      const qm = b.match(/Q:\s*(.+)/i);
      const am = b.match(/A:\s*(.+)/i);
      if (!qm || !am) return;
      const choices = am[1].split("|").map((c) => c.trim());
      const answer = choices.findIndex((c) => c.startsWith("*") && c.endsWith("*"));
      const cleaned = choices.map((c) => c.replace(/^\*|\*$/g, "").trim());
      if (answer >= 0 && cleaned.length >= 2) {
        questions.push({ category: "General", question: qm[1].trim(), choices: cleaned, answer });
      }
    });
  }
  return {
    id: `pack_${Date.now()}`,
    name: name || "My Pack",
    questions,
    createdAt: Date.now(),
  };
}

export function allTrivia(activePackId?: string): TriviaQuestion[] {
  if (!activePackId || activePackId === "builtin") return TRIVIA;
  const pack = loadCustomPacks().find((p) => p.id === activePackId);
  return pack ? pack.questions : TRIVIA;
}
