import { Text, View } from "react-native";
import { SpotifyConnectBanner } from "./SpotifyConnectBanner";
import { ONVIZA } from "../../lib/theme";

type Props = {
  title?: string;
  message?: string;
  compact?: boolean;
};

/** Shown when Spotify data is required but the user is not connected */
export function SpotifyRequiredState({
  title = "Connect Spotify to continue",
  message = "Sign in with your Spotify account to browse live music, your library, and recommendations.",
  compact,
}: Props) {
  return (
    <View className="px-5 py-6">
      <View className="mb-4 items-center rounded-2xl border border-onviza-border bg-onviza-card px-6 py-10">
        <Text className="text-center text-lg font-bold text-white">{title}</Text>
        <Text className="mt-2 text-center text-sm leading-5 text-spotify-text-secondary">{message}</Text>
      </View>
      <SpotifyConnectBanner compact={compact} />
    </View>
  );
}

export function SpotifyEmptyState({ message = "Nothing here yet" }: { message?: string }) {
  return (
    <View className="items-center px-8 py-12">
      <Text className="text-center text-spotify-text-secondary">{message}</Text>
    </View>
  );
}

export function SpotifyErrorState({ message }: { message: string }) {
  return (
    <View className="mx-5 my-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4">
      <Text className="text-sm text-red-300">{message}</Text>
    </View>
  );
}
