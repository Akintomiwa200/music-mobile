import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { ScreenHeader } from "../../components/drawer/ScreenHeader";

const options = [
  { icon: "musical-notes" as const, title: "Playlist", subtitle: "Create a playlist with songs or episodes" },
  { icon: "people" as const, title: "Blend", subtitle: "Combine tastes in a shared playlist with friends" },
  { icon: "radio" as const, title: "Radio", subtitle: "Create a radio based on any song, album, or artist" },
  { icon: "disc" as const, title: "Mix", subtitle: "Create a mix of songs based on your listening" },
];

export default function CreateScreen() {
  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <ScreenHeader title="Create" left="menu" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {options.map((opt) => (
          <Pressable
            key={opt.title}
            className="mb-4 flex-row items-center rounded-lg bg-spotify-highlight p-4 active:opacity-80"
          >
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-spotify-base">
              <Ionicons name={opt.icon} size={24} color="#1DB954" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-spotify-text-primary">{opt.title}</Text>
              <Text className="mt-0.5 text-sm text-spotify-text-secondary">{opt.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
