export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`pickr_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`pickr_${key}`, JSON.stringify(value));
  } catch {}
}
