import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FilterChips } from "../../components/FilterChips";
import { LibraryRow } from "../../components/onviza/LibraryRow";
import { libraryItems as mockLibrary } from "../../constants/data";
import { useSettings } from "../../context/SettingsContext";
import { useSpotify } from "../../context/SpotifyContext";
import { SpotifyConnectBanner, SpotifyLoading } from "../../components/spotify/SpotifyConnectBanner";
import { ONVIZA } from "../../lib/theme";
import { useTabScreenPadding } from "../../hooks/useTabScreenPadding";
import type { LibraryItem } from "../../types";

const FILTER_LABELS = ["Playlists", "Artists", "Albums", "Podcasts & Shows"] as const;
type FilterKey = (typeof FILTER_LABELS)[number];

const FILTER_MAP: Record<FilterKey, LibraryItem["type"] | "all"> = {
  Playlists: "playlist",
  Artists: "artist",
  Albums: "album",
  "Podcasts & Shows": "podcast",
};

const SORT_LABELS = {
  recent: "Recently played",
  alphabetical: "Alphabetical",
  creator: "Creator",
} as const;

export default function LibraryScreen() {
  const bottomPad = useTabScreenPadding();
  const { settings } = useSettings();
  const { isAuthenticated, getLibrary } = useSpotify();
  const [filter, setFilter] = useState<FilterKey>("Playlists");
  const [gridView, setGridView] = useState(false);
  const [items, setItems] = useState<LibraryItem[]>(mockLibrary);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const defaults: Record<string, FilterKey> = {
      Playlists: "Playlists",
      Albums: "Albums",
      Artists: "Artists",
      Podcasts: "Podcasts & Shows",
    };
    setFilter(defaults[settings.library.defaultFilter] ?? "Playlists");
  }, [settings.library.defaultFilter]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems(mockLibrary);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getLibrary()
      .then((data) => {
        if (!cancelled) {
          const pinned = mockLibrary.filter((i) => i.pinned || i.special);
          const merged = [...pinned, ...data.filter((d) => !pinned.some((p) => p.id === d.id))];
          setItems(merged);
        }
      })
      .catch(() => {
        if (!cancelled) setItems(mockLibrary);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getLibrary]);

  const filtered = useMemo(() => {
    const typeFilter = FILTER_MAP[filter];
    let list = items.filter((item) => {
      if (filter === "Playlists") {
        return item.type === "playlist" || item.special === "liked-songs";
      }
      if (filter === "Podcasts & Shows") {
        return item.type === "podcast" || item.special === "your-episodes";
      }
      if (typeFilter !== "all") return item.type === typeFilter;
      return true;
    });

    if (settings.library.sortOrder === "alphabetical") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (settings.library.sortOrder === "creator") {
      list = [...list].sort((a, b) => a.subtitle.localeCompare(b.subtitle));
    } else {
      list = [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
    }

    return list;
  }, [items, filter, settings.library.sortOrder]);

  const compact = settings.appearance.compactLibrary;

  const navigate = (item: LibraryItem) => {
    if (item.special === "liked-songs" || item.id === "p7") {
      router.push("/playlist/p7");
      return;
    }
    if (item.type === "playlist") router.push(`/playlist/${item.id}`);
    else if (item.type === "album") router.push(`/album/${item.id}`);
    else if (item.type === "artist") router.push(`/artist/${item.id}`);
    else if (item.type === "podcast") router.push("/search-results?q=podcast");
  };

  const renderItem = ({ item }: { item: LibraryItem }) => (
    <LibraryRow item={item} compact={compact} onPress={() => navigate(item)} />
  );

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      {/* Header: avatar + title + actions */}
      <View className="flex-row items-center px-4 pb-1 pt-3">
        <Pressable onPress={() => router.push("/(tabs)/profile")} className="mr-3">
          <Image source={{ uri: settings.avatarUri }} className="h-8 w-8 rounded-full" contentFit="cover" />
        </Pressable>
        <Text className="flex-1 text-[22px] font-extrabold text-white">Your Library</Text>
        <Pressable onPress={() => router.push("/search")} hitSlop={10} className="p-2">
          <Ionicons name="search" size={24} color="#fff" />
        </Pressable>
        <Pressable onPress={() => router.push("/(tabs)/create")} hitSlop={10} className="p-2">
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>

      {!isAuthenticated && <SpotifyConnectBanner compact />}

      <FilterChips
        filters={FILTER_LABELS}
        active={filter}
        onChange={(f) => setFilter(f as FilterKey)}
        accentColor={settings.accentColor}
        contentClassName="px-4 py-3"
      />

      <View className="flex-row items-center justify-between px-4 py-2">
        <Pressable
          onPress={() => router.push("/settings/library")}
          className="flex-row items-center gap-2"
        >
          <Ionicons name="swap-vertical" size={18} color={ONVIZA.textMuted} />
          <Text className="text-sm font-medium text-spotify-text-secondary">
            {SORT_LABELS[settings.library.sortOrder]}
          </Text>
        </Pressable>
        <Pressable onPress={() => setGridView((v) => !v)} hitSlop={8} className="p-1">
          <Ionicons name={gridView ? "list" : "grid-outline"} size={20} color={ONVIZA.textMuted} />
        </Pressable>
      </View>

      {loading ? (
        <SpotifyLoading label="Loading your library…" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
          ListEmptyComponent={
            <Text className="px-4 py-8 text-center text-spotify-text-secondary">Nothing here yet</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
