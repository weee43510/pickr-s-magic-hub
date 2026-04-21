import { loadFromStorage, saveToStorage } from "./storage";

export interface WheelTemplate {
  id: string;
  name: string;
  emoji: string;
  slices: { id: string; label: string; weight: number }[];
}

export const WHEEL_TEMPLATES: WheelTemplate[] = [
  {
    id: "lunch", name: "What's for lunch?", emoji: "🍽️",
    slices: [
      { id: "1", label: "Pizza 🍕", weight: 1 },
      { id: "2", label: "Sushi 🍣", weight: 1 },
      { id: "3", label: "Tacos 🌮", weight: 1 },
      { id: "4", label: "Burger 🍔", weight: 1 },
      { id: "5", label: "Pasta 🍝", weight: 1 },
      { id: "6", label: "Salad 🥗", weight: 1 },
      { id: "7", label: "Ramen 🍜", weight: 1 },
      { id: "8", label: "Sandwich 🥪", weight: 1 },
    ],
  },
  {
    id: "chores", name: "Who does the chore?", emoji: "🧹",
    slices: [
      { id: "1", label: "Dishes", weight: 1 },
      { id: "2", label: "Laundry", weight: 1 },
      { id: "3", label: "Vacuum", weight: 1 },
      { id: "4", label: "Trash", weight: 1 },
      { id: "5", label: "Cooking", weight: 1 },
    ],
  },
  {
    id: "dares", name: "Random Dare", emoji: "🔥",
    slices: [
      { id: "1", label: "Sing a song", weight: 1 },
      { id: "2", label: "Tell a joke", weight: 1 },
      { id: "3", label: "Do 10 push-ups", weight: 1 },
      { id: "4", label: "Imitate a celebrity", weight: 1 },
      { id: "5", label: "Speak in accent", weight: 1 },
      { id: "6", label: "30s plank", weight: 1 },
    ],
  },
  {
    id: "movie", name: "Movie Night Genre", emoji: "🎬",
    slices: [
      { id: "1", label: "Action", weight: 1 },
      { id: "2", label: "Comedy", weight: 1 },
      { id: "3", label: "Horror", weight: 1 },
      { id: "4", label: "Sci-Fi", weight: 1 },
      { id: "5", label: "Romance", weight: 1 },
      { id: "6", label: "Documentary", weight: 1 },
      { id: "7", label: "Animation", weight: 1 },
    ],
  },
  {
    id: "drink", name: "Drink Picker", emoji: "🍹",
    slices: [
      { id: "1", label: "Coffee ☕", weight: 1 },
      { id: "2", label: "Tea 🍵", weight: 1 },
      { id: "3", label: "Water 💧", weight: 1 },
      { id: "4", label: "Smoothie 🥤", weight: 1 },
      { id: "5", label: "Juice 🧃", weight: 1 },
    ],
  },
  {
    id: "yesno", name: "Yes / No / Maybe", emoji: "🤔",
    slices: [
      { id: "1", label: "YES", weight: 2 },
      { id: "2", label: "NO", weight: 2 },
      { id: "3", label: "Maybe", weight: 1 },
      { id: "4", label: "Ask again", weight: 1 },
    ],
  },
];

export function loadCustomTemplates(): WheelTemplate[] {
  return loadFromStorage<WheelTemplate[]>("wheel_templates_custom", []);
}

export function saveCustomTemplate(t: WheelTemplate) {
  const existing = loadCustomTemplates().filter((x) => x.id !== t.id);
  saveToStorage("wheel_templates_custom", [...existing, t]);
}
