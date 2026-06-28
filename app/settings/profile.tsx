import { ScrollView, Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSettings } from "../../context/SettingsContext";
import { SettingSection, SettingsHeader } from "../../components/settings/SettingRow";
import { cn } from "../../lib/utils";

export default function ProfileSettingsScreen() {
  const { settings, updateSettings } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <SettingsHeader title="Profile" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center py-8">
          <Image source={{ uri: settings.avatarUri }} className="h-32 w-32 rounded-full" contentFit="cover" />
          <Text className="mt-4 text-2xl font-bold text-spotify-text-primary">{settings.displayName}</Text>
          <Text className="mt-1 text-sm text-spotify-text-secondary">Free plan · Personalization active</Text>
        </View>

        <SettingSection title="About you">
          <View className="px-4 py-4">
            <Text className="mb-2 text-sm text-spotify-text-secondary">Display name</Text>
            <TextInput
              defaultValue={settings.displayName}
              onEndEditing={(e) => updateSettings({ displayName: e.nativeEvent.text.trim() || "Listener" })}
              placeholderTextColor="#727272"
              className="rounded-lg bg-spotify-highlight px-4 py-3 text-base text-spotify-text-primary"
            />
          </View>
        </SettingSection>

        <SettingSection title="Your taste">
          <View className="p-4">
            <Text className="text-sm text-spotify-text-secondary">Top genres</Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {settings.favoriteGenres.map((g) => (
                <View key={g} className="rounded-full px-3 py-1.5" style={{ backgroundColor: settings.accentColor + "33" }}>
                  <Text style={{ color: settings.accentColor }} className="text-sm font-semibold">{g}</Text>
                </View>
              ))}
              {settings.favoriteGenres.length === 0 && (
                <Text className="text-sm text-spotify-text-muted">No genres selected yet</Text>
              )}
            </View>
            <Text
              onPress={() => router.push("/settings/personalization")}
              className="mt-4 text-sm font-semibold"
              style={{ color: settings.accentColor }}
            >
              Edit taste profile →
            </Text>
          </View>
        </SettingSection>

        <SettingSection title="Stats preview">
          <View className="flex-row justify-around p-6">
            {[
              { label: "Genres", value: settings.favoriteGenres.length },
              { label: "Sections", value: Object.values(settings.homeSections).filter(Boolean).length },
              { label: "Mood", value: settings.defaultMood ? "Set" : "—" },
            ].map((stat) => (
              <View key={stat.label} className="items-center">
                <Text className="text-2xl font-bold text-spotify-text-primary">{stat.value}</Text>
                <Text className="text-xs text-spotify-text-secondary">{stat.label}</Text>
              </View>
            ))}
          </View>
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
