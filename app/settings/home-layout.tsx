import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingToggle, SettingsHeader } from "../../components/settings/SettingRow";

const SECTIONS = [
  { key: "shortcuts" as const, title: "Quick shortcuts", subtitle: "Your top playlists & artists grid" },
  { key: "jumpBackIn" as const, title: "Jump back in", subtitle: "Recently opened content" },
  { key: "madeForYou" as const, title: "Made for you", subtitle: "Personalized playlists" },
  { key: "recentlyPlayed" as const, title: "Recently played", subtitle: "Albums you've been listening to" },
  { key: "topMixes" as const, title: "Your top mixes", subtitle: "Genre-based mixes" },
  { key: "moodMatch" as const, title: "Mood match", subtitle: "Daily vibe-based recommendations" },
];

export default function HomeLayoutScreen() {
  const { settings, updateHomeSections } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <SettingsHeader title="Home layout" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Show on home">
          {SECTIONS.map((section, i) => (
            <View key={section.key}>
              {i > 0 && <View className="h-px bg-onviza-border" />}
              <SettingToggle
                title={section.title}
                subtitle={section.subtitle}
                value={settings.homeSections[section.key]}
                onValueChange={(v) => updateHomeSections({ [section.key]: v })}
                accentColor={settings.accentColor}
              />
            </View>
          ))}
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
