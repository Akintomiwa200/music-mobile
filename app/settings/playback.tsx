import { ScrollView, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingToggle, SettingsHeader } from "../../components/settings/SettingRow";
import { cn } from "../../lib/utils";
import type { StreamingQuality } from "../../types/settings";

const QUALITIES: { id: StreamingQuality; label: string; desc: string }[] = [
  { id: "auto", label: "Automatic", desc: "Adjusts based on connection" },
  { id: "high", label: "High", desc: "Best quality, more data" },
  { id: "low", label: "Low", desc: "Saves data, lower quality" },
];

export default function PlaybackSettingsScreen() {
  const { settings, updatePlayback } = useSettings();
  const { playback } = settings;

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <SettingsHeader title="Playback" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="General">
          <SettingToggle
            icon="play-circle-outline"
            title="Autoplay"
            subtitle="Similar music plays when your queue ends"
            value={playback.autoplay}
            onValueChange={(v) => updatePlayback({ autoplay: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-onviza-border" />
          <SettingToggle
            icon="git-merge-outline"
            title="Crossfade"
            subtitle="Smooth transitions between songs"
            value={playback.crossfade}
            onValueChange={(v) => updatePlayback({ crossfade: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-onviza-border" />
          <SettingToggle
            icon="volume-high-outline"
            title="Normalize volume"
            subtitle="Set the same volume level for all songs"
            value={playback.normalizeVolume}
            onValueChange={(v) => updatePlayback({ normalizeVolume: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-onviza-border" />
          <SettingToggle
            icon="infinite-outline"
            title="Gapless playback"
            subtitle="No silence between consecutive tracks"
            value={playback.gaplessPlayback}
            onValueChange={(v) => updatePlayback({ gaplessPlayback: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>

        {playback.crossfade && (
          <SettingSection title="Crossfade duration">
            <View className="flex-row justify-around p-4">
              {[3, 5, 8, 12].map((sec) => (
                <Pressable
                  key={sec}
                  onPress={() => updatePlayback({ crossfadeDuration: sec })}
                  className={cn(
                    "rounded-full px-5 py-2.5",
                    playback.crossfadeDuration === sec ? "" : "bg-onviza-elevated"
                  )}
                  style={playback.crossfadeDuration === sec ? { backgroundColor: settings.accentColor } : undefined}
                >
                  <Text className={cn("font-semibold", playback.crossfadeDuration === sec ? "text-black" : "text-white")}>
                    {sec}s
                  </Text>
                </Pressable>
              ))}
            </View>
          </SettingSection>
        )}

        <SettingSection title="Lyrics">
          <SettingToggle
            icon="mic-outline"
            title="Show lyrics"
            subtitle="Display lyrics on the now playing screen"
            value={playback.showLyrics}
            onValueChange={(v) => updatePlayback({ showLyrics: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-onviza-border" />
          <SettingToggle
            icon="sync-outline"
            title="Synced lyrics"
            subtitle="Highlight lyrics in real time as the song plays"
            value={playback.lyricsSync}
            onValueChange={(v) => updatePlayback({ lyricsSync: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>

        <SettingSection title="Streaming quality">
          {QUALITIES.map((q, i) => (
            <View key={q.id}>
              {i > 0 && <View className="h-px bg-onviza-border" />}
              <Pressable
                onPress={() => updatePlayback({ streamingQuality: q.id })}
                className="flex-row items-center px-4 py-4 active:bg-spotify-highlight/50"
              >
                <View className="flex-1">
                  <Text className="text-base font-medium text-spotify-text-primary">{q.label}</Text>
                  <Text className="text-sm text-spotify-text-secondary">{q.desc}</Text>
                </View>
                {playback.streamingQuality === q.id && (
                  <View className="h-5 w-5 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                )}
              </Pressable>
            </View>
          ))}
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
