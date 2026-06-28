import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../../context/SettingsContext";
import { ACCENT_COLORS, GENRE_OPTIONS } from "../../types/settings";
import { MOOD_SEEDS } from "../../lib/config";
import { cn } from "../../lib/utils";

type Props = {
  visible: boolean;
  onComplete: () => void;
};

export function PersonalizationOnboarding({ visible, onComplete }: Props) {
  const { settings, updateSettings, toggleGenre, completeOnboarding } = useSettings();

  const finish = async () => {
    await completeOnboarding();
    onComplete();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView className="flex-1 bg-onviza-bg">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-2xl font-bold text-spotify-text-primary">Make it yours</Text>
          <Pressable onPress={finish} className="px-3 py-1">
            <Text className="font-semibold text-spotify-text-secondary">Skip</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text className="mb-6 text-base text-spotify-text-secondary">
            Pick a few favorites so we can personalize your home feed, mixes, and mood banner.
          </Text>

          <Text className="mb-3 text-sm font-bold uppercase tracking-wider text-spotify-text-secondary">
            What do you listen to?
          </Text>
          <View className="mb-8 flex-row flex-wrap gap-2">
            {GENRE_OPTIONS.slice(0, 10).map((genre) => {
              const active = settings.favoriteGenres.includes(genre);
              return (
                <Pressable
                  key={genre}
                  onPress={() => toggleGenre(genre)}
                  className={cn("rounded-full px-4 py-2", active ? "" : "bg-onviza-elevated")}
                  style={active ? { backgroundColor: settings.accentColor } : undefined}
                >
                  <Text className={cn("text-sm font-semibold", active ? "text-black" : "text-white")}>{genre}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="mb-3 text-sm font-bold uppercase tracking-wider text-spotify-text-secondary">
            Pick your vibe
          </Text>
          <View className="mb-8 flex-row flex-wrap gap-2">
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
                  <Text className="mr-1.5">{mood.emoji}</Text>
                  <Text className="text-sm font-semibold text-white">{mood.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="mb-3 text-sm font-bold uppercase tracking-wider text-spotify-text-secondary">
            Accent color
          </Text>
          <View className="mb-8 flex-row flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <Pressable
                key={color.id}
                onPress={() => updateSettings({ accentColor: color.hex })}
                className={cn(
                  "h-12 w-12 rounded-full",
                  settings.accentColor === color.hex && "border-2 border-white"
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </View>
        </ScrollView>

        <View className="border-t border-spotify-highlight px-4 py-4">
          <Pressable
            onPress={finish}
            className="items-center rounded-full py-4 active:opacity-90"
            style={{ backgroundColor: settings.accentColor }}
          >
            <Text className="text-base font-bold text-black">Save & continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
