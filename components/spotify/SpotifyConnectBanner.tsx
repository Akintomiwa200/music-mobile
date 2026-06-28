import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { SpotifyIcon } from "./SpotifyIcon";
import { useSpotify } from "../../context/SpotifyContext";
import { ONVIZA } from "../../lib/theme";

type Props = {
  compact?: boolean;
};

export function SpotifyConnectBanner({ compact }: Props) {
  const { isConfigured, isAuthenticated, isLoading, login, error } = useSpotify();

  if (isLoading || isAuthenticated) return null;

  if (!isConfigured) {
    return (
      <View className="mx-5 mb-4 rounded-2xl border border-onviza-border bg-onviza-card p-4">
        <Text className="text-sm font-semibold text-white">Connect Spotify for live music</Text>
        <Text className="mt-1 text-xs text-spotify-text-secondary">
          Add EXPO_PUBLIC_SPOTIFY_CLIENT_ID to your .env, then restart the app.
        </Text>
      </View>
    );
  }

  if (compact) {
    return (
      <Pressable
        onPress={() => login().catch(() => {})}
        className="mx-5 mb-4 flex-row items-center rounded-2xl px-4 py-3 active:opacity-90"
        style={{ backgroundColor: ONVIZA.purple }}
      >
        <SpotifyIcon size={22} color="#fff" />
        <Text className="ml-3 flex-1 text-sm font-bold text-white">Connect Spotify for real tracks & previews</Text>
      </Pressable>
    );
  }

  return (
    <View className="mx-5 mb-4 overflow-hidden rounded-2xl bg-onviza-card p-4">
      <View className="flex-row items-center">
        <View className="h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: ONVIZA.purple }}>
          <SpotifyIcon size={24} color="#fff" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-white">Connect your Spotify</Text>
          <Text className="mt-0.5 text-xs text-spotify-text-secondary">
            Stream 30s previews, browse your library & get recommendations
          </Text>
        </View>
      </View>
      {error && <Text className="mt-2 text-xs text-red-400">{error}</Text>}
      <Pressable
        onPress={() => login().catch(() => {})}
        className="mt-4 items-center rounded-full py-3 active:opacity-90"
        style={{ backgroundColor: ONVIZA.purple }}
      >
        <Text className="font-bold text-white">Connect Spotify</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/settings/account")} className="mt-2 items-center py-2">
        <Text className="text-xs text-spotify-text-secondary">Learn more</Text>
      </Pressable>
    </View>
  );
}

export function SpotifyLoading({ label = "Loading from Spotify…" }: { label?: string }) {
  return (
    <View className="items-center py-8">
      <ActivityIndicator color={ONVIZA.purpleLight} />
      <Text className="mt-3 text-sm text-spotify-text-secondary">{label}</Text>
    </View>
  );
}
