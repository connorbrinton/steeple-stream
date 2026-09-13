// Vidstack's default layout reads settings storage during module evaluation.
// Keep those optional settings usable when browser storage is unavailable,
// without replacing window.localStorage or changing application persistence.
const memory = new Map();
export const localStorage = {
  getItem(key) {
    try { return window.localStorage.getItem(key); } catch { return memory.get(key) ?? null; }
  },
  setItem(key, value) {
    memory.set(key, String(value));
    try { window.localStorage.setItem(key, value); } catch { /* In-page fallback. */ }
  },
  removeItem(key) {
    memory.delete(key);
    try { window.localStorage.removeItem(key); } catch { /* In-page fallback. */ }
  }
};
