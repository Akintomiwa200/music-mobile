import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MiniPlayer } from "../../components/MiniPlayer";
import { DrawerLayout } from "../../components/drawer/DrawerLayout";
import { PersonalizationOnboarding } from "../../components/settings/PersonalizationOnboarding";
import { useSettings } from "../../context/SettingsContext";
import { useLayoutMode } from "../../lib/layout";

export default function TabLayout() {
  const { isWide } = useLayoutMode();
  const { settings, loaded } = useSettings();
  const showOnboarding = loaded && !settings.onboardingComplete;

  return (
    <DrawerLayout>
      <View className="flex-1 bg-spotify-base">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: isWide
              ? { display: "none" }
              : {
                  backgroundColor: "#121212",
                  borderTopColor: "#282828",
                  borderTopWidth: 0.5,
                  height: 56,
                  paddingBottom: 4,
                  paddingTop: 4,
                },
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "#B3B3B3",
            tabBarShowLabel: settings.appearance.showTabLabels,
            tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: "Search",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: "Your Library",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "library" : "library-outline"} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="create"
            options={{
              title: "Create",
              tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={24} color={color} />,
            }}
          />
        </Tabs>
        <MiniPlayer />
        <PersonalizationOnboarding visible={showOnboarding} onComplete={() => {}} />
      </View>
    </DrawerLayout>
  );
}
