import "../lib/nativewind-setup";
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlayerProvider } from "../context/PlayerContext";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import { SpotifyProvider } from "../context/SpotifyContext";
import { DrawerProvider } from "../context/DrawerContext";
import { SplashGate } from "../components/ui/SplashGate";

function RootNavigator() {
  const { loaded } = useSettings();

  return (
    <SplashGate ready={loaded}>
      <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0A0A0F" } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="queue" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="playlist/[id]" />
        <Stack.Screen name="album/[id]" />
        <Stack.Screen name="artist/[id]" />
        <Stack.Screen
          name="player"
          options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="search-results" options={{ animation: "slide_from_right" }} />
      </Stack>
    </SplashGate>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <SettingsProvider>
        <SpotifyProvider>
          <DrawerProvider>
            <PlayerProvider>
              <RootNavigator />
            </PlayerProvider>
          </DrawerProvider>
        </SpotifyProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
