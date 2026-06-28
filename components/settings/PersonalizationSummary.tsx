import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MOOD_SEEDS } from "../../lib/config";
import type { UserSettings } from "../../types/settings";

type Props = {
  settings: UserSettings;
};

export function PersonalizationSummary({ settings }: Props) {
  const mood = settings.defaultMood ? MOOD_SEEDS[settings.defaultMood] : null;
  const activeSections = Object.entries(settings.homeSections).filter(([, v]) => v).length;

  return (
    <View className="mx-4 mb-6 overflow-hidden rounded-xl bg-spotify-elevated">
      <View className="p-4" style={{ borderLeftWidth: 4, borderLeftColor: settings.accentColor }}>
        <Text className="text-xs font-bold uppercase tracking-wider text-spotify-text-secondary">
          Your taste profile
        </Text>
        <Text className="mt-2 text-lg font-bold text-spotify-text-primary">{settings.displayName}</Text>

        <View className="mt-4 flex-row flex-wrap gap-4">
          <Stat icon="musical-notes-outline" label="Genres" value={String(settings.favoriteGenres.length)} accent={settings.accentColor} />
          <Stat icon="home-outline" label="Home sections" value={String(activeSections)} accent={settings.accentColor} />
          <Stat
            icon="happy-outline"
            label="Mood"
            value={mood ? mood.emoji : "—"}
            accent={mood?.color ?? settings.accentColor}
          />
        </View>

        {settings.favoriteGenres.length > 0 && (
          <View className="mt-4 flex-row flex-wrap gap-2">
            {settings.favoriteGenres.slice(0, 5).map((g) => (
              <View key={g} className="rounded-full px-3 py-1" style={{ backgroundColor: settings.accentColor + "22" }}>
                <Text className="text-xs font-semibold" style={{ color: settings.accentColor }}>
                  {g}
                </Text>
              </View>
            ))}
            {settings.favoriteGenres.length > 5 && (
              <Text className="self-center text-xs text-spotify-text-muted">
                +{settings.favoriteGenres.length - 5} more
              </Text>
            )}
          </View>
        )}

        {mood && (
          <View className="mt-4 flex-row items-center rounded-lg p-3" style={{ backgroundColor: mood.color + "33" }}>
            <Text className="mr-2 text-xl">{mood.emoji}</Text>
            <View>
              <Text className="text-sm font-bold text-spotify-text-primary">{mood.label} mode</Text>
              <Text className="text-xs text-spotify-text-secondary">Default vibe for recommendations</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <View className="items-center">
      <View className="mb-1 h-9 w-9 items-center justify-center rounded-full bg-spotify-highlight">
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <Text className="text-lg font-bold text-spotify-text-primary">{value}</Text>
      <Text className="text-xs text-spotify-text-secondary">{label}</Text>
    </View>
  );
}
