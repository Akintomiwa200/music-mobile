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
  large?: boolean;
};

export function ScreenHeader({ title, subtitle, left = "menu", onBack, right, large }: Props) {
  return (
    <View className="px-4 pb-2 pt-3">
      <View className="flex-row items-center justify-between">
        <View className="min-w-0 flex-1 flex-row items-center gap-1">
          {left === "menu" && <DrawerToggleButton />}
          {left === "back" && (
            <Pressable onPress={onBack ?? (() => router.back())} className="mr-2 h-10 w-10 items-center justify-center rounded-full active:bg-white/10">
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </Pressable>
          )}
          <View className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className={large ? "text-[26px] font-extrabold tracking-tight text-spotify-text-primary" : "text-xl font-bold text-spotify-text-primary"}
            >
              {title}
            </Text>
            {subtitle && (
              <Text numberOfLines={1} className="mt-0.5 text-sm text-spotify-text-secondary">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {right && <View className="flex-row items-center gap-1">{right}</View>}
      </View>
    </View>
  );
}
