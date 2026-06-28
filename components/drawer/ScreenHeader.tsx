import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DrawerToggleButton } from "./DrawerToggleButton";

type Props = {
  title: string;
  subtitle?: string;
  left?: "menu" | "back" | "none";
  onBack?: () => void;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, subtitle, left = "menu", onBack, right }: Props) {
  return (
    <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        {left === "menu" && <DrawerToggleButton />}
        {left === "back" && (
          <Pressable onPress={onBack ?? (() => router.back())} className="p-1">
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
        )}
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-2xl font-bold text-spotify-text-primary">
            {title}
          </Text>
          {subtitle && (
            <Text numberOfLines={1} className="text-sm text-spotify-text-secondary">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {right && <View className="flex-row items-center gap-4">{right}</View>}
    </View>
  );
}
