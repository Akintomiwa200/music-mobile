import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { DrawerToggleButton } from "../drawer/DrawerToggleButton";
import { HeaderIconButton, HeaderIconRow } from "./HeaderIconButton";
import { getGreeting } from "../../lib/utils";

type Props = {
  displayName: string;
  avatarUri: string;
};

export function HomeHeader({ displayName, avatarUri }: Props) {
  return (
    <View className="px-4 pb-1 pt-3">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <DrawerToggleButton />
          <Pressable
            onPress={() => router.push("/settings/profile")}
            className="flex-row items-center gap-2 rounded-full pr-2 active:opacity-80"
          >
            <Image source={{ uri: avatarUri }} className="h-8 w-8 rounded-full" contentFit="cover" />
          </Pressable>
        </View>
        <HeaderIconRow>
          <HeaderIconButton name="notifications-outline" />
          <HeaderIconButton name="time-outline" onPress={() => router.push("/settings/notifications")} />
          <HeaderIconButton name="settings-outline" onPress={() => router.push("/settings")} />
        </HeaderIconRow>
      </View>
      <Pressable onPress={() => router.push("/settings/profile")}>
        <Text className="text-[26px] font-extrabold leading-8 tracking-tight text-spotify-text-primary">
          {getGreeting(displayName)}
        </Text>
      </Pressable>
    </View>
  );
}
