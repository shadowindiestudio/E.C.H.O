// Type-safe LocalStorage wrapper with error handling & default initializers

const NAMESPACE_PREFIX = 'echo_app_';

export const storageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${NAMESPACE_PREFIX}${key}`);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (err) {
      console.warn(`[StorageService] Failed to read key: ${key}`, err);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(`${NAMESPACE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to set key: ${key}`, err);
      return false;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${NAMESPACE_PREFIX}${key}`);
    } catch (err) {
      console.error(`[StorageService] Failed to remove key: ${key}`, err);
    }
  },

  clearAllNamespace(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(NAMESPACE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (err) {
      console.error(`[StorageService] Failed to clear namespace`, err);
    }
  },
};
