import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/drawer/ScreenHeader";
import { useSettings } from "../../context/SettingsContext";

const options = [
  { icon: "musical-notes" as const, title: "Playlist", subtitle: "Build a playlist with songs or episodes", color: "#5038a0" },
  { icon: "people" as const, title: "Blend", subtitle: "Shared playlist with friends", color: "#af2896" },
  { icon: "radio" as const, title: "Radio", subtitle: "Radio based on any song or artist", color: "#509bf5" },
  { icon: "disc" as const, title: "Mix", subtitle: "Mix based on your listening", color: "#27856a" },
];

export default function CreateScreen() {
  const { settings } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <ScreenHeader title="Create" left="menu" large />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 130 }}>
        <Text className="mb-4 text-sm text-spotify-text-secondary">Start something new</Text>
        {options.map((opt) => (
          <Pressable
            key={opt.title}
            className="mb-3 flex-row items-center overflow-hidden rounded-2xl bg-spotify-elevated active:opacity-90"
          >
            <View className="h-[72px] w-[72px] items-center justify-center" style={{ backgroundColor: opt.color + "33" }}>
              <Ionicons name={opt.icon} size={28} color={opt.color} />
            </View>
            <View className="flex-1 px-4 py-4">
              <Text className="text-base font-bold text-spotify-text-primary">{opt.title}</Text>
              <Text className="mt-1 text-sm leading-5 text-spotify-text-secondary">{opt.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#727272" style={{ marginRight: 16 }} />
          </Pressable>
        ))}

        <View className="mt-6 rounded-2xl border border-white/10 p-4">
          <Text className="text-sm font-bold text-spotify-text-primary">Pro tip</Text>
          <Text className="mt-1 text-sm text-spotify-text-secondary">
            Personalize recommendations in Settings → Taste profile using your accent{" "}
            <Text style={{ color: settings.accentColor }}>{settings.accentColor}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
