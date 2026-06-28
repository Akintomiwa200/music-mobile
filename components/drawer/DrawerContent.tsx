import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { libraryItems, playlists } from "../../constants/data";
import { useDrawer } from "../../context/DrawerContext";
import { usePlayer } from "../../context/PlayerContext";
import { useSettings } from "../../context/SettingsContext";
import { cn } from "../../lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  match: (path: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "home-outline",
    iconActive: "home",
    match: (p) => p === "/" || p === "/index" || p.endsWith("/index"),
  },
  {
    label: "Search",
    href: "/search",
    icon: "search-outline",
    iconActive: "search",
    match: (p) => p.includes("/search"),
  },
  {
    label: "Your Library",
    href: "/library",
    icon: "library-outline",
    iconActive: "library",
    match: (p) => p.includes("/library"),
  },
];

const QUICK_LINKS = [
  { label: "Create", href: "/create", icon: "add-circle-outline" as const },
  { label: "Queue", href: "/queue", icon: "list" as const },
  { label: "Personalize", href: "/settings/personalization", icon: "color-palette-outline" as const },
  { label: "Settings", href: "/settings", icon: "settings-outline" as const },
];

export function DrawerContent() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { close, persistent } = useDrawer();
  const { settings } = useSettings();
  const { queue, currentSong } = usePlayer();

  const pinnedPlaylists = libraryItems.filter((i) => i.type === "playlist").slice(0, 6);
  const browsePlaylists = playlists.slice(0, 4);

  const navigate = (href: string) => {
    router.push(href as never);
    if (!persistent) close();
  };

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {/* Profile */}
      <Pressable
        onPress={() => navigate("/settings/profile")}
        className="mx-3 mb-2 flex-row items-center gap-3 rounded-lg px-3 py-3 active:bg-spotify-highlight"
      >
        <Image source={{ uri: settings.avatarUri }} className="h-8 w-8 rounded-full" contentFit="cover" />
        <Text numberOfLines={1} className="flex-1 text-sm font-bold text-spotify-text-primary">
          {settings.displayName}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#727272" />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-3">
        {/* Main nav */}
        <View className="mb-4">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Pressable
                key={item.href}
                onPress={() => navigate(item.href)}
                className={cn(
                  "mb-1 flex-row items-center gap-4 rounded-lg px-3 py-2.5 active:bg-spotify-highlight",
                  active && "bg-spotify-highlight"
                )}
              >
                <Ionicons name={active ? item.iconActive : item.icon} size={24} color={active ? "#fff" : "#B3B3B3"} />
                <Text className={cn("text-base font-bold", active ? "text-spotify-text-primary" : "text-spotify-text-secondary")}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Quick actions */}
        <View className="mb-4 border-t border-spotify-highlight pt-4">
          {QUICK_LINKS.map((item) => (
            <Pressable
              key={item.href}
              onPress={() => navigate(item.href)}
              className="mb-1 flex-row items-center gap-4 rounded-lg px-3 py-2.5 active:bg-spotify-highlight"
            >
              <Ionicons name={item.icon} size={22} color="#B3B3B3" />
              <Text className="text-sm font-semibold text-spotify-text-secondary">{item.label}</Text>
              {item.label === "Queue" && queue.length > 0 && (
                <View className="ml-auto rounded-full bg-spotify-green px-2 py-0.5">
                  <Text className="text-xs font-bold text-black">{queue.length}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Now playing chip */}
        {currentSong && (
          <Pressable
            onPress={() => navigate("/player")}
            className="mb-4 flex-row items-center gap-3 rounded-lg bg-spotify-highlight p-2 active:opacity-80"
          >
            <Image source={{ uri: currentSong.image }} className="h-10 w-10 rounded" contentFit="cover" />
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="text-xs font-bold text-spotify-text-primary">
                {currentSong.title}
              </Text>
              <Text numberOfLines={1} className="text-xs text-spotify-text-secondary">
                Now playing
              </Text>
            </View>
            <Ionicons name="chevron-up" size={16} color="#B3B3B3" />
          </Pressable>
        )}

        {/* Library shortcuts */}
        <Text className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-spotify-text-muted">
          Your playlists
        </Text>
        {pinnedPlaylists.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => navigate(`/playlist/${item.id}`)}
            className="mb-1 flex-row items-center gap-3 rounded-lg px-3 py-2 active:bg-spotify-highlight"
          >
            <Image source={{ uri: item.image }} className="h-8 w-8 rounded" contentFit="cover" />
            <Text numberOfLines={1} className="flex-1 text-sm font-medium text-spotify-text-secondary">
              {item.title}
            </Text>
          </Pressable>
        ))}

        <Text className="mb-2 mt-4 px-3 text-xs font-bold uppercase tracking-wider text-spotify-text-muted">
          Browse
        </Text>
        {browsePlaylists.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => navigate(`/playlist/${p.id}`)}
            className="mb-1 flex-row items-center gap-3 rounded-lg px-3 py-2 active:bg-spotify-highlight"
          >
            <Image source={{ uri: p.image }} className="h-8 w-8 rounded" contentFit="cover" />
            <Text numberOfLines={1} className="flex-1 text-sm font-medium text-spotify-text-secondary">
              {p.title}
            </Text>
          </Pressable>
        ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
