import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingToggle, SettingsHeader } from "../../components/settings/SettingRow";

export default function ContentSettingsScreen() {
  const { settings, updateSettings } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <SettingsHeader title="Content" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Content filters">
          <SettingToggle
            icon="warning-outline"
            title="Allow explicit content"
            subtitle="Play songs marked as explicit"
            value={settings.explicitContent}
            onValueChange={(v) => updateSettings({ explicitContent: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>

        <SettingSection title="Data usage">
          <SettingToggle
            icon="cellular-outline"
            title="Data saver"
            subtitle="Lower image quality and disable autoplay on cellular"
            value={settings.dataSaver}
            onValueChange={(v) => updateSettings({ dataSaver: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
