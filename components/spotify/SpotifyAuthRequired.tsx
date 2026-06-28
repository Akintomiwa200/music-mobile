import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SpotifyConnectBanner } from "./SpotifyConnectBanner";
import { ONVIZA } from "../../lib/theme";

type Props = {
  title?: string;
  message?: string;
  compact?: boolean;
};

/** Shown when a screen needs Spotify data but the user is not connected */
export function SpotifyAuthRequired({
  title = "Connect Spotify",
  message = "Sign in to browse your library, search millions of tracks, and get personalized recommendations.",
  compact,
}: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-onviza-card">
        <Ionicons name="musical-notes" size={36} color={ONVIZA.purpleLight} />
      </View>
      <Text className="text-center text-xl font-bold text-white">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-spotify-text-secondary">{message}</Text>
      <View className="mt-6 w-full">
        <SpotifyConnectBanner compact={compact} />
      </View>
    </View>
  );
}
