import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../../context/SettingsContext";
import { SettingRow, SettingSection, SettingsHeader } from "../../components/settings/SettingRow";
import { PersonalizationSummary } from "../../components/settings/PersonalizationSummary";
import { ACCENT_COLORS, GENRE_OPTIONS } from "../../types/settings";
import { MOOD_SEEDS } from "../../lib/config";
import { cn } from "../../lib/utils";

export default function PersonalizationScreen() {
  const { settings, updateSettings, toggleGenre } = useSettings();
  const [name, setName] = useState(settings.displayName);

  const saveName = () => {
    if (name.trim()) updateSettings({ displayName: name.trim() });
  };

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <SettingsHeader title="Personalization" onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <PersonalizationSummary settings={settings} />

        <Text className="mb-4 px-4 text-sm text-spotify-text-secondary">
          Tailor your experience. These preferences shape recommendations, home shortcuts, and your vibe.
        </Text>

        <SettingSection title="Display name">
          <View className="px-4 py-4">
            <TextInput
              value={name}
              onChangeText={setName}
              onBlur={saveName}
              placeholder="Your name"
              placeholderTextColor="#727272"
              className="rounded-lg bg-spotify-highlight px-4 py-3 text-base text-spotify-text-primary"
            />
          </View>
        </SettingSection>

        <SettingSection title="Quick links">
          <SettingRow
            icon="home-outline"
            title="Home layout"
            subtitle="Toggle sections on your home feed"
            onPress={() => router.push("/settings/home-layout")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="color-wand-outline"
            title="Appearance"
            subtitle="Tab labels, library density, language"
            onPress={() => router.push("/settings/appearance")}
          />
          <View className="h-px bg-spotify-base" />
          <SettingRow
            icon="library-outline"
            title="Library defaults"
            subtitle={`${settings.library.defaultFilter} · ${settings.library.sortOrder}`}
            onPress={() => router.push("/settings/library")}
          />
        </SettingSection>

        <SettingSection title="Favorite genres">
          <Text className="px-4 pt-3 text-xs text-spotify-text-secondary">
            Select at least 3 for better recommendations
          </Text>
          <View className="flex-row flex-wrap gap-2 p-4">
            {GENRE_OPTIONS.map((genre) => {
              const active = settings.favoriteGenres.includes(genre);
              return (
                <Pressable
                  key={genre}
                  onPress={() => toggleGenre(genre)}
                  className={cn("rounded-full px-4 py-2", active ? "bg-spotify-green" : "bg-spotify-highlight")}
                  style={active ? { backgroundColor: settings.accentColor } : undefined}
                >
                  <Text className={cn("text-sm font-semibold", active ? "text-black" : "text-spotify-text-primary")}>
                    {genre}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </SettingSection>

        <SettingSection title="Default mood">
          <View className="flex-row flex-wrap gap-2 p-4">
            {Object.entries(MOOD_SEEDS).map(([key, mood]) => {
              const active = settings.defaultMood === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => updateSettings({ defaultMood: key })}
                  className={cn(
                    "flex-row items-center rounded-full px-4 py-2.5",
                    active ? "border-2 border-white" : "bg-spotify-highlight"
                  )}
                  style={active ? { backgroundColor: mood.color } : undefined}
                >
                  <Text className="mr-1.5 text-base">{mood.emoji}</Text>
                  <Text className="text-sm font-semibold text-white">{mood.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </SettingSection>

        <SettingSection title="Accent color">
          <View className="flex-row flex-wrap gap-3 p-4">
            {ACCENT_COLORS.map((color) => {
              const active = settings.accentColor === color.value;
              return (
                <Pressable
                  key={color.id}
                  onPress={() => updateSettings({ accentColor: color.value })}
                  className={cn("h-12 w-12 rounded-full", active && "border-2 border-white")}
                  style={{ backgroundColor: color.value }}
                  accessibilityLabel={color.label}
                />
              );
            })}
          </View>
          <Text className="px-4 pb-4 text-xs text-spotify-text-secondary">
            Used for toggles, chips, and highlights across the app.
          </Text>
        </SettingSection>

        <SettingSection title="Avatar">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
            {["profile", "avatar1", "avatar2", "avatar3", "avatar4", "avatar5"].map((seed) => {
              const uri = `https://picsum.photos/seed/${seed}/200/200`;
              const active = settings.avatarUri.includes(seed);
              return (
                <Pressable key={seed} onPress={() => updateSettings({ avatarUri: uri })}>
                  <Image
                    source={{ uri }}
                    className={cn("h-16 w-16 rounded-full", active && "border-2")}
                    style={active ? { borderColor: settings.accentColor } : undefined}
                    contentFit="cover"
                  />
                  {active && (
                    <View className="absolute bottom-0 right-0 rounded-full bg-black/60 p-0.5">
                      <Ionicons name="checkmark-circle" size={18} color={settings.accentColor} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}
