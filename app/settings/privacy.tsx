import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingToggle, SettingsHeader } from "../../components/settings/SettingRow";

export default function PrivacySettingsScreen() {
  const { settings, updatePrivacy } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <SettingsHeader title="Privacy" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Listening activity">
          <SettingToggle
            icon="eye-outline"
            title="Show listening activity"
            subtitle="Friends can see what you're playing"
            value={settings.privacy.showListeningActivity}
            onValueChange={(v) => updatePrivacy({ showListeningActivity: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-spotify-base" />
          <SettingToggle
            icon="lock-closed-outline"
            title="Private session"
            subtitle="Listen without appearing in friend activity"
            value={settings.privacy.privateSession}
            onValueChange={(v) => updatePrivacy({ privateSession: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>

        <SettingSection title="Recommendations">
          <SettingToggle
            icon="analytics-outline"
            title="Personalized recommendations"
            subtitle="Use listening data to improve suggestions"
            value={settings.privacy.shareDataForRecommendations}
            onValueChange={(v) => updatePrivacy({ shareDataForRecommendations: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
