import { ScrollView, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingToggle, SettingsHeader } from "../../components/settings/SettingRow";
import { cn } from "../../lib/utils";
import type { AppearanceSettings } from "../../types/settings";

const LANGUAGES: { id: AppearanceSettings["language"]; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
];

const CANVAS_STYLES: { id: AppearanceSettings["canvasStyle"]; label: string; desc: string }[] = [
  { id: "default", label: "Default", desc: "Classic Spotify dark theme" },
  { id: "vibrant", label: "Vibrant", desc: "Bolder colors on album art" },
  { id: "minimal", label: "Minimal", desc: "Cleaner, less visual noise" },
];

export default function AppearanceSettingsScreen() {
  const { settings, updateAppearance } = useSettings();
  const { appearance } = settings;

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <SettingsHeader title="Appearance" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Navigation">
          <SettingToggle
            icon="text-outline"
            title="Show tab labels"
            subtitle="Display text under bottom tab icons"
            value={appearance.showTabLabels}
            onValueChange={(v) => updateAppearance({ showTabLabels: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>

        <SettingSection title="Library view">
          <SettingToggle
            icon="list-outline"
            title="Compact library"
            subtitle="Smaller rows with less spacing"
            value={appearance.compactLibrary}
            onValueChange={(v) => updateAppearance({ compactLibrary: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>

        <SettingSection title="Now playing canvas">
          {CANVAS_STYLES.map((style, i) => (
            <View key={style.id}>
              {i > 0 && <View className="h-px bg-onviza-border" />}
              <Pressable
                onPress={() => updateAppearance({ canvasStyle: style.id })}
                className="flex-row items-center px-4 py-4 active:bg-spotify-highlight/50"
              >
                <View className="flex-1">
                  <Text className="text-base font-medium text-spotify-text-primary">{style.label}</Text>
                  <Text className="text-sm text-spotify-text-secondary">{style.desc}</Text>
                </View>
                {appearance.canvasStyle === style.id && (
                  <View className="h-5 w-5 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                )}
              </Pressable>
            </View>
          ))}
        </SettingSection>

        <SettingSection title="Language">
          {LANGUAGES.map((lang, i) => (
            <View key={lang.id}>
              {i > 0 && <View className="h-px bg-onviza-border" />}
              <Pressable
                onPress={() => updateAppearance({ language: lang.id })}
                className="flex-row items-center px-4 py-4 active:bg-spotify-highlight/50"
              >
                <Text className="flex-1 text-base font-medium text-spotify-text-primary">{lang.label}</Text>
                {appearance.language === lang.id && (
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
