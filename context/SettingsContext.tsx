import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mergeSettings } from "../lib/settings";
import { DEFAULT_SETTINGS, type UserSettings } from "../types/settings";

const STORAGE_KEY = "@spotify_clone_settings";

type SettingsContextType = {
  settings: UserSettings;
  loaded: boolean;
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>;
  updatePlayback: (patch: Partial<UserSettings["playback"]>) => Promise<void>;
  updateNotifications: (patch: Partial<UserSettings["notifications"]>) => Promise<void>;
  updatePrivacy: (patch: Partial<UserSettings["privacy"]>) => Promise<void>;
  updateHomeSections: (patch: Partial<UserSettings["homeSections"]>) => Promise<void>;
  updateAppearance: (patch: Partial<UserSettings["appearance"]>) => Promise<void>;
  updateLibrary: (patch: Partial<UserSettings["library"]>) => Promise<void>;
  toggleGenre: (genre: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

async function loadSettings(): Promise<UserSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return mergeSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings: UserSettings) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (next: UserSettings) => {
    setSettings(next);
    await saveSettings(next);
  }, []);

  const updateSettings = useCallback(
    async (patch: Partial<UserSettings>) => {
      await persist(mergeSettings({ ...settings, ...patch }));
    },
    [persist, settings]
  );

  const updatePlayback = useCallback(
    async (patch: Partial<UserSettings["playback"]>) => {
      await persist({ ...settings, playback: { ...settings.playback, ...patch } });
    },
    [persist, settings]
  );

  const updateNotifications = useCallback(
    async (patch: Partial<UserSettings["notifications"]>) => {
      await persist({ ...settings, notifications: { ...settings.notifications, ...patch } });
    },
    [persist, settings]
  );

  const updatePrivacy = useCallback(
    async (patch: Partial<UserSettings["privacy"]>) => {
      await persist({ ...settings, privacy: { ...settings.privacy, ...patch } });
    },
    [persist, settings]
  );

  const updateHomeSections = useCallback(
    async (patch: Partial<UserSettings["homeSections"]>) => {
      await persist({ ...settings, homeSections: { ...settings.homeSections, ...patch } });
    },
    [persist, settings]
  );

  const updateAppearance = useCallback(
    async (patch: Partial<UserSettings["appearance"]>) => {
      await persist({ ...settings, appearance: { ...settings.appearance, ...patch } });
    },
    [persist, settings]
  );

  const updateLibrary = useCallback(
    async (patch: Partial<UserSettings["library"]>) => {
      await persist({ ...settings, library: { ...settings.library, ...patch } });
    },
    [persist, settings]
  );

  const toggleGenre = useCallback(
    async (genre: string) => {
      const has = settings.favoriteGenres.includes(genre);
      const favoriteGenres = has
        ? settings.favoriteGenres.filter((g) => g !== genre)
        : [...settings.favoriteGenres, genre];
      await persist({ ...settings, favoriteGenres });
    },
    [persist, settings]
  );

  const completeOnboarding = useCallback(async () => {
    await persist({ ...settings, onboardingComplete: true });
  }, [persist, settings]);

  const resetSettings = useCallback(async () => {
    await persist(DEFAULT_SETTINGS);
  }, [persist]);

  const value = useMemo(
    () => ({
      settings,
      loaded,
      updateSettings,
      updatePlayback,
      updateNotifications,
      updatePrivacy,
      updateHomeSections,
      updateAppearance,
      updateLibrary,
      toggleGenre,
      completeOnboarding,
      resetSettings,
    }),
    [
      settings,
      loaded,
      updateSettings,
      updatePlayback,
      updateNotifications,
      updatePrivacy,
      updateHomeSections,
      updateAppearance,
      updateLibrary,
      toggleGenre,
      completeOnboarding,
      resetSettings,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
