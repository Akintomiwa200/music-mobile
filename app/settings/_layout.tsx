import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#121212" } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="personalization" />
      <Stack.Screen name="home-layout" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="library" />
      <Stack.Screen name="playback" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="content" />
      <Stack.Screen name="account" />
    </Stack>
  );
}
