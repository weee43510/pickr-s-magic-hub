import { loadFromStorage, saveToStorage } from "./storage";

export type ThemeId = "cyberpunk" | "matrix" | "sunset";

export interface ThemeDef {
  id: ThemeId;
  label: string;
  description: string;
  // HSL values (no hsl() wrapper)
  vars: Record<string, string>;
}

export const THEMES: ThemeDef[] = [
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    description: "Pink × Blue",
    vars: {
      "--background": "230 25% 7%",
      "--foreground": "210 40% 96%",
      "--primary": "330 90% 60%",
      "--primary-foreground": "230 25% 7%",
      "--secondary": "200 95% 55%",
      "--secondary-foreground": "230 25% 7%",
      "--accent": "200 95% 55%",
      "--accent-foreground": "230 25% 7%",
      "--muted": "230 15% 18%",
      "--muted-foreground": "215 20% 65%",
      "--border": "230 15% 22%",
      "--ring": "330 90% 60%",
      "--neon-cyan": "200 95% 55%",
      "--neon-violet": "330 90% 60%",
      "--neon-pink": "330 90% 60%",
      "--neon-green": "150 80% 55%",
      "--glass-bg": "230 25% 12%",
      "--glass-border": "0 0% 100%",
      "--gradient-a": "230 35% 8%",
      "--gradient-b": "330 50% 14%",
      "--gradient-c": "200 50% 12%",
      "--gradient-d": "260 40% 10%",
    },
  },
  {
    id: "matrix",
    label: "Matrix",
    description: "Green × Black",
    vars: {
      "--background": "140 30% 4%",
      "--foreground": "140 60% 90%",
      "--primary": "140 90% 50%",
      "--primary-foreground": "140 30% 4%",
      "--secondary": "140 70% 35%",
      "--secondary-foreground": "140 30% 4%",
      "--accent": "140 80% 45%",
      "--accent-foreground": "140 30% 4%",
      "--muted": "140 20% 12%",
      "--muted-foreground": "140 30% 60%",
      "--border": "140 30% 18%",
      "--ring": "140 90% 50%",
      "--neon-cyan": "140 90% 50%",
      "--neon-violet": "140 70% 40%",
      "--neon-pink": "100 80% 55%",
      "--neon-green": "140 90% 50%",
      "--glass-bg": "140 25% 8%",
      "--glass-border": "140 80% 60%",
      "--gradient-a": "140 35% 4%",
      "--gradient-b": "140 40% 8%",
      "--gradient-c": "120 30% 6%",
      "--gradient-d": "140 35% 5%",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Orange × Purple",
    vars: {
      "--background": "280 30% 8%",
      "--foreground": "30 50% 95%",
      "--primary": "25 95% 60%",
      "--primary-foreground": "280 30% 8%",
      "--secondary": "280 75% 60%",
      "--secondary-foreground": "30 50% 95%",
      "--accent": "280 75% 60%",
      "--accent-foreground": "30 50% 95%",
      "--muted": "280 20% 16%",
      "--muted-foreground": "30 30% 70%",
      "--border": "280 25% 22%",
      "--ring": "25 95% 60%",
      "--neon-cyan": "25 95% 60%",
      "--neon-violet": "280 75% 60%",
      "--neon-pink": "340 85% 60%",
      "--neon-green": "150 70% 55%",
      "--glass-bg": "280 25% 14%",
      "--glass-border": "30 80% 70%",
      "--gradient-a": "280 35% 8%",
      "--gradient-b": "25 50% 14%",
      "--gradient-c": "340 45% 12%",
      "--gradient-d": "280 35% 10%",
    },
  },
];

export function getStoredTheme(): ThemeId {
  return loadFromStorage<ThemeId>("theme", "cyberpunk");
}

export function applyTheme(id: ThemeId) {
  const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  saveToStorage("theme", id);
}
