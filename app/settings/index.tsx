import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../../context/SettingsContext";
import { SettingRow, SettingSection, SettingsHeader } from "../../components/settings/SettingRow";
import { MOOD_SEEDS } from "../../lib/config";

export default function SettingsScreen() {
  const { settings } = useSettings();
  const moodLabel = settings.defaultMood ? MOOD_SEEDS[settings.defaultMood]?.label : "None";

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <SettingsHeader title="Settings" onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile card */}
        <Pressable
          onPress={() => router.push("/settings/profile")}
          className="mx-4 mb-6 flex-row items-center rounded-xl bg-spotify-elevated p-4 active:opacity-90"
        >
          <Image source={{ uri: settings.avatarUri }} className="h-16 w-16 rounded-full" contentFit="cover" />
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-spotify-text-primary">{settings.displayName}</Text>
            <Text className="mt-0.5 text-sm text-spotify-text-secondary">View profile & personalization</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#727272" />
        </Pressable>

        <SettingSection title="Personalization">
          <SettingRow
            icon="person-outline"
            title="Profile"
            subtitle={settings.displayName}
            onPress={() => router.push("/settings/profile")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="color-palette-outline"
            title="Taste profile"
            subtitle={`${settings.favoriteGenres.length} genres · Mood: ${moodLabel}`}
            onPress={() => router.push("/settings/personalization")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="home-outline"
            title="Home layout"
            subtitle="Choose what appears on your home feed"
            onPress={() => router.push("/settings/home-layout")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="eye-outline"
            title="Appearance"
            subtitle={`${settings.appearance.canvasStyle} · ${settings.appearance.language.toUpperCase()}`}
            onPress={() => router.push("/settings/appearance")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="library-outline"
            title="Library"
            subtitle={`Default: ${settings.library.defaultFilter}`}
            onPress={() => router.push("/settings/library")}
          />
        </SettingSection>

        <SettingSection title="Playback">
          <SettingRow
            icon="musical-notes-outline"
            title="Audio quality & playback"
            subtitle={`Quality: ${settings.playback.streamingQuality}`}
            onPress={() => router.push("/settings/playback")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="mic-outline"
            title="Lyrics"
            subtitle={settings.playback.showLyrics ? "Enabled" : "Disabled"}
            onPress={() => router.push("/settings/playback")}
          />
        </SettingSection>

        <SettingSection title="Privacy & social">
          <SettingRow
            icon="shield-outline"
            title="Privacy & data"
            subtitle={settings.privacy.privateSession ? "Private session on" : "Public listening"}
            onPress={() => router.push("/settings/privacy")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            subtitle={settings.notifications.pushEnabled ? "Enabled" : "Disabled"}
            onPress={() => router.push("/settings/notifications")}
          />
        </SettingSection>

        <SettingSection title="Content">
          <SettingRow
            icon="warning-outline"
            title="Explicit content"
            value={settings.explicitContent ? "Allowed" : "Blocked"}
            onPress={() => router.push("/settings/content")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="cellular-outline"
            title="Data saver"
            value={settings.dataSaver ? "On" : "Off"}
            onPress={() => router.push("/settings/content")}
          />
        </SettingSection>

        <SettingSection title="Account">
          <SettingRow
            icon="logo-spotify"
            iconColor="#1DB954"
            title="Connect Spotify"
            subtitle="Link your real Spotify account"
            onPress={() => router.push("/settings/account")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="refresh-outline"
            title="Reset all settings"
            danger
            showChevron={false}
            onPress={() => router.push("/settings/account")}
          />
        </SettingSection>

        <Text className="mt-2 text-center text-xs text-spotify-text-muted">Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
