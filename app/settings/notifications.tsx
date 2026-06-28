import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingToggle, SettingsHeader } from "../../components/settings/SettingRow";

export default function NotificationsSettingsScreen() {
  const { settings, updateNotifications } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <SettingsHeader title="Notifications" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Push notifications">
          <SettingToggle
            icon="notifications-outline"
            title="Enable notifications"
            subtitle="Receive alerts on this device"
            value={settings.notifications.pushEnabled}
            onValueChange={(v) => updateNotifications({ pushEnabled: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>

        <SettingSection title="What to notify">
          <SettingToggle
            title="New releases"
            subtitle="Artists you follow drop new music"
            value={settings.notifications.newReleases}
            onValueChange={(v) => updateNotifications({ newReleases: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-spotify-base" />
          <SettingToggle
            title="Artist updates"
            subtitle="News and events from artists"
            value={settings.notifications.artistUpdates}
            onValueChange={(v) => updateNotifications({ artistUpdates: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-spotify-base" />
          <SettingToggle
            title="Recommendations"
            subtitle="Personalized picks and mixes"
            value={settings.notifications.recommendations}
            onValueChange={(v) => updateNotifications({ recommendations: v })}
            accentColor={settings.accentColor}
          />
          <View className="h-px bg-spotify-base" />
          <SettingToggle
            title="Friend activity"
            subtitle="When friends listen to something"
            value={settings.notifications.friendActivity}
            onValueChange={(v) => updateNotifications({ friendActivity: v })}
            accentColor={settings.accentColor}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
