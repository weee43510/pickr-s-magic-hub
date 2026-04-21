import { loadFromStorage, saveToStorage } from "./storage";

export interface PetState {
  mood: "happy" | "neutral" | "sleepy" | "hyped";
  energy: number; // 0-100
  lastInteract: number;
}

export function getPet(): PetState {
  return loadFromStorage<PetState>("pet", { mood: "neutral", energy: 60, lastInteract: 0 });
}

export function pokePet(): PetState {
  const p = getPet();
  const now = Date.now();
  const idle = now - p.lastInteract;
  let energy = Math.min(100, p.energy + (idle > 60_000 ? 8 : 3));
  let mood: PetState["mood"];
  if (energy > 80) mood = "hyped";
  else if (energy > 40) mood = "happy";
  else if (energy > 20) mood = "neutral";
  else mood = "sleepy";
  const next: PetState = { mood, energy, lastInteract: now };
  saveToStorage("pet", next);
  return next;
}

export function petEmoji(mood: PetState["mood"]): string {
  return { happy: "😊", neutral: "🐣", sleepy: "😴", hyped: "🤩" }[mood];
}
