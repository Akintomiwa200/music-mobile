import type { UserSettings } from "../types/settings";
import { DEFAULT_SETTINGS } from "../types/settings";

export function mergeSettings(stored: Partial<UserSettings>): UserSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    homeSections: { ...DEFAULT_SETTINGS.homeSections, ...stored.homeSections },
    playback: { ...DEFAULT_SETTINGS.playback, ...stored.playback },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...stored.notifications },
    privacy: { ...DEFAULT_SETTINGS.privacy, ...stored.privacy },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...stored.appearance },
    library: { ...DEFAULT_SETTINGS.library, ...stored.library },
  };
}
