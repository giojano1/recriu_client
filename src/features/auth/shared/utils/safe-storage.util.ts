import { logger } from "@/lib/utils/logger";

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error("localStorage.getItem failed", {
        action: "localstorage_get_failed",
        metadata: { key, error },
      });
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      logger.error("localStorage.setItem failed", {
        action: "localstorage_set_failed",
        metadata: { key, error },
      });
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error("localStorage.removeItem failed", {
        action: "localstorage_remove_failed",
        metadata: { key, error },
      });
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error("localStorage.clear failed", {
        action: "localstorage_clear_failed",
        metadata: { error },
      });
      return false;
    }
  },

  getJSON: <T = unknown>(key: string): T | null => {
    const value = safeLocalStorage.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error("localStorage JSON parse failed", {
        action: "localstorage_parse_failed",
        metadata: { key, error },
      });
      // Remove corrupted data
      safeLocalStorage.removeItem(key);
      return null;
    }
  },

  setJSON: <T = unknown>(key: string, value: T): boolean => {
    try {
      const stringified = JSON.stringify(value);
      return safeLocalStorage.setItem(key, stringified);
    } catch (error) {
      logger.error("localStorage JSON stringify failed", {
        action: "localstorage_stringify_failed",
        metadata: { key, error },
      });
      return false;
    }
  },
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      logger.error("sessionStorage.getItem failed", {
        action: "sessionstorage_get_failed",
        metadata: { key, error },
      });
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      logger.error("sessionStorage.setItem failed", {
        action: "sessionstorage_set_failed",
        metadata: { key, error },
      });
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error("sessionStorage.removeItem failed", {
        action: "sessionstorage_remove_failed",
        metadata: { key, error },
      });
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      logger.error("sessionStorage.clear failed", {
        action: "sessionstorage_clear_failed",
        metadata: { error },
      });
      return false;
    }
  },

  getJSON: <T = unknown>(key: string): T | null => {
    const value = safeSessionStorage.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error("sessionStorage JSON parse failed", {
        action: "sessionstorage_parse_failed",
        metadata: { key, error },
      });
      safeSessionStorage.removeItem(key);
      return null;
    }
  },

  setJSON: <T = unknown>(key: string, value: T): boolean => {
    try {
      const stringified = JSON.stringify(value);
      return safeSessionStorage.setItem(key, stringified);
    } catch (error) {
      logger.error("sessionStorage JSON stringify failed", {
        action: "sessionstorage_stringify_failed",
        metadata: { key, error },
      });
      return false;
    }
  },
};
