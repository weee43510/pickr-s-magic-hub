export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    // Support legacy "pickr_" keys for backward compatibility
    const stored =
      localStorage.getItem(`randomizr_${key}`) ??
      localStorage.getItem(`pickr_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`randomizr_${key}`, JSON.stringify(value));
  } catch {}
}
