import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SpotifyIcon } from "../../components/spotify/SpotifyIcon";
import { useSettings } from "../../context/SettingsContext";
import { useSpotify } from "../../context/SpotifyContext";
import { SettingRow, SettingSection, SettingsHeader } from "../../components/settings/SettingRow";
import { getRedirectUri } from "../../services/spotify/auth";
import { ONVIZA } from "../../lib/theme";

export default function AccountSettingsScreen() {
  const { settings, resetSettings } = useSettings();
  const { isConfigured, isAuthenticated, isLoading, user, login, logout, error } = useSpotify();

  const handleReset = () => {
    Alert.alert(
      "Reset settings?",
      "This will restore all personalization, playback, and privacy settings to defaults.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetSettings() },
      ]
    );
  };

  const handleConnect = async () => {
    try {
      await login();
    } catch (e) {
      Alert.alert("Spotify login failed", e instanceof Error ? e.message : "Unknown error");
    }
  };

  const handleDisconnect = () => {
    Alert.alert("Disconnect Spotify?", "You will need to sign in again to browse music and your library.", [
      { text: "Cancel", style: "cancel" },
      { text: "Disconnect", style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <SettingsHeader title="Account" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SettingSection title="Spotify connection">
          <View className="px-4 py-4">
            <View className="flex-row items-center">
              <View
                className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: isAuthenticated ? ONVIZA.purple : ONVIZA.bgCard }}
              >
                <SpotifyIcon size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-white">
                  {isAuthenticated ? user?.display_name ?? "Connected" : "Not connected"}
                </Text>
                <Text className="mt-0.5 text-sm text-spotify-text-secondary">
                  {isAuthenticated
                    ? "Live tracks, previews, library & search"
                    : isConfigured
                      ? "Connect to use real Spotify data"
                      : "Add your Client ID to .env first"}
                </Text>
              </View>
            </View>

            {error && <Text className="mt-3 text-xs text-red-400">{error}</Text>}

            {!isConfigured && (
              <Text className="mt-3 text-xs leading-5 text-spotify-text-muted">
                Set EXPO_PUBLIC_SPOTIFY_CLIENT_ID in .env{"\n"}
                Redirect URI: {getRedirectUri()}
              </Text>
            )}

            <Pressable
              onPress={isAuthenticated ? handleDisconnect : handleConnect}
              disabled={isLoading || !isConfigured}
              className="mt-4 items-center rounded-full py-3 active:opacity-90"
              style={{
                backgroundColor: isAuthenticated ? ONVIZA.bgCard : ONVIZA.purple,
                borderWidth: isAuthenticated ? 1 : 0,
                borderColor: ONVIZA.border,
                opacity: !isConfigured ? 0.5 : 1,
              }}
            >
              <Text className="font-bold text-white">
                {isLoading ? "Connecting…" : isAuthenticated ? "Disconnect Spotify" : "Connect Spotify"}
              </Text>
            </Pressable>
          </View>
        </SettingSection>

        <SettingSection title="Your data">
          <SettingRow icon="download-outline" title="Export preferences" subtitle="Save your settings locally" showChevron={false} />
          <View className="h-px bg-onviza-border" />
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
