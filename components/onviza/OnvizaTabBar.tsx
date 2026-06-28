import { View, Pressable, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONVIZA } from "../../lib/theme";
import { TAB_BAR } from "../../lib/layout";

const TABS: {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: "index", icon: "home-outline", iconActive: "home" },
  { name: "search", icon: "search-outline", iconActive: "search" },
  { name: "library", icon: "library-outline", iconActive: "library" },
  { name: "profile", icon: "person-outline", iconActive: "person" },
];

export function OnvizaTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        elevation: 100,
        paddingBottom: insets.bottom + TAB_BAR.bottomGap,
        paddingHorizontal: TAB_BAR.horizontalInset,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          height: TAB_BAR.height,
          backgroundColor: "rgba(20, 20, 28, 0.97)",
          borderRadius: TAB_BAR.borderRadius,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: ONVIZA.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 16,
          ...Platform.select({
            android: { overflow: "hidden" },
          }),
        }}
      >
        {TABS.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          if (routeIndex === -1) return null;

          const route = state.routes[routeIndex];
          const focused = state.index === routeIndex;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? tab.name}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <View
                style={
                  focused
                    ? {
                        backgroundColor: ONVIZA.purple,
                        borderRadius: 22,
                        width: 44,
                        height: 44,
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: ONVIZA.purple,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.55,
                        shadowRadius: 10,
                        elevation: 8,
                      }
                    : {
                        width: 44,
                        height: 44,
                        alignItems: "center",
                        justifyContent: "center",
                      }
                }
              >
                <Ionicons
                  name={focused ? tab.iconActive : tab.icon}
                  size={22}
                  color={focused ? "#fff" : ONVIZA.textMuted}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
