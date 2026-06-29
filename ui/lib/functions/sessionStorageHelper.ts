import { checkWindow } from './_helpers.lib';
import { SessionStorageKey } from './keys/sesssionStorageKeys';

export const sessionStorageHelper = {
  set<T>(key: SessionStorageKey, value: T) {
    if (!checkWindow()) return;

    window.sessionStorage.setItem(key, JSON.stringify(value));
  },

  get<T>(key: SessionStorageKey): T | null {
    if (!checkWindow()) return null;

    const value = window.sessionStorage.getItem(key);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  remove(key: SessionStorageKey) {
    if (!checkWindow()) return;

    window.sessionStorage.removeItem(key);
  },

  clear() {
    if (!checkWindow()) return;

    window.sessionStorage.clear();
  },
};
