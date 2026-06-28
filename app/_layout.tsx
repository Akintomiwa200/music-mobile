import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlayerProvider } from "../context/PlayerContext";
import { SettingsProvider } from "../context/SettingsContext";
import { DrawerProvider } from "../context/DrawerContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <DrawerProvider>
          <PlayerProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#121212" } }}>
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
          </PlayerProvider>
        </DrawerProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
