import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSettings } from "../../context/SettingsContext";
import { SettingRow, SettingSection, SettingsHeader } from "../../components/settings/SettingRow";
import { SPOTIFY_CLIENT_ID } from "../../lib/config";

export default function AccountSettingsScreen() {
  const { settings, resetSettings } = useSettings();
  const isConnected = Boolean(SPOTIFY_CLIENT_ID);

  const handleReset = () => {
    Alert.alert(
      "Reset settings?",
      "This will restore all personalization, playback, and privacy settings to defaults.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetSettings(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <SettingsHeader title="Account" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Spotify connection">
          <View className="px-4 py-4">
            <Text className="text-base text-spotify-text-primary">
              {isConnected ? "Spotify API configured" : "Spotify API not configured"}
            </Text>
            <Text className="mt-2 text-sm text-spotify-text-secondary">
              {isConnected
                ? "Your app can fetch real-time music from Spotify."
                : "Add EXPO_PUBLIC_SPOTIFY_CLIENT_ID to your .env file to connect."}
            </Text>
          </View>
        </SettingSection>

        <SettingSection title="Your data">
          <SettingRow
            icon="download-outline"
            title="Export preferences"
            subtitle="Save your settings locally"
            showChevron={false}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="trash-outline"
            title="Reset all settings"
            subtitle={`Restore defaults for ${settings.displayName}`}
            danger
            showChevron={false}
            onPress={handleReset}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
