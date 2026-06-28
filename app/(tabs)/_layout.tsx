import { Tabs } from "expo-router";
import { View } from "react-native";
import { MiniPlayer } from "../../components/MiniPlayer";
import { OnvizaTabBar } from "../../components/onviza/OnvizaTabBar";
import { PersonalizationOnboarding } from "../../components/settings/PersonalizationOnboarding";
import { useSettings } from "../../context/SettingsContext";

export default function TabLayout() {
  const { settings, loaded } = useSettings();
  const showOnboarding = loaded && !settings.onboardingComplete;

  return (
    <View className="flex-1 bg-onviza-bg">
      <Tabs
        tabBar={(props) => <OnvizaTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          lazy: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="search" options={{ title: "Search" }} />
        <Tabs.Screen name="library" options={{ title: "Library" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="create" options={{ href: null }} />
      </Tabs>
      <MiniPlayer />
      <PersonalizationOnboarding visible={showOnboarding} onComplete={() => {}} />
    </View>
  );
}
