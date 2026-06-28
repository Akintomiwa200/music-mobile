import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FilterChips } from "../../components/FilterChips";
import { libraryItems } from "../../constants/data";
import { useSettings } from "../../context/SettingsContext";
import { ScreenHeader } from "../../components/drawer/ScreenHeader";
import type { LibraryItem } from "../../types";

const filters = ["Playlists", "Podcasts", "Albums", "Artists"] as const;

export default function LibraryScreen() {
  const { settings } = useSettings();
  const [filter, setFilter] = useState<(typeof filters)[number]>(settings.library.defaultFilter);

  useEffect(() => {
    setFilter(settings.library.defaultFilter);
  }, [settings.library.defaultFilter]);

  const filtered = useMemo(() => {
    let items = libraryItems.filter((item) => {
      if (filter === "Playlists") return item.type === "playlist";
      if (filter === "Albums") return item.type === "album";
      if (filter === "Artists") return item.type === "artist";
      return true;
    });

    if (settings.library.sortOrder === "alphabetical") {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (settings.library.sortOrder === "creator") {
      items = [...items].sort((a, b) => a.subtitle.localeCompare(b.subtitle));
    }

    return items;
  }, [filter, settings.library.sortOrder]);

  const compact = settings.appearance.compactLibrary;

  const navigate = (item: LibraryItem) => {
    if (item.type === "playlist") router.push(`/playlist/${item.id}`);
    else if (item.type === "album") router.push(`/album/${item.id}`);
    else if (item.type === "artist") router.push(`/artist/${item.id}`);
  };

  const renderItem = ({ item }: { item: LibraryItem }) => (
    <Pressable
      onPress={() => navigate(item)}
      className={`flex-row items-center px-4 active:bg-spotify-highlight/40 ${compact ? "py-1.5" : "py-2"}`}
    >
      <Image
        source={{ uri: item.image }}
        className={`${compact ? "h-12 w-12" : "h-14 w-14"} ${item.type === "artist" ? "rounded-full" : "rounded"}`}
        contentFit="cover"
      />
      <View className="ml-3 min-w-0 flex-1">
        <Text numberOfLines={1} className="text-base font-medium text-spotify-text-primary">
          {item.title}
        </Text>
        <Text numberOfLines={1} className="text-sm text-spotify-text-secondary">
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-spotify-base" edges={["top"]}>
      <ScreenHeader
        title="Your Library"
        left="menu"
        right={
          <>
            <Pressable onPress={() => router.push("/search")}>
              <Ionicons name="search" size={24} color="#fff" />
            </Pressable>
            <Pressable onPress={() => router.push("/settings/personalization")}>
              <Ionicons name="add" size={28} color="#fff" />
            </Pressable>
            <Pressable onPress={() => router.push("/settings/library")}>
              <Ionicons name="options-outline" size={24} color="#fff" />
            </Pressable>
          </>
        }
      />

      <FilterChips filters={filters} active={filter} onChange={setFilter} />

      <View className="flex-row items-center justify-between px-4 py-2">
        <Pressable className="flex-row items-center gap-2">
          <Ionicons name="swap-vertical" size={18} color="#B3B3B3" />
          <Text className="text-sm text-spotify-text-secondary">Recents</Text>
        </Pressable>
        <Ionicons name="grid-outline" size={20} color="#B3B3B3" />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </SafeAreaView>
  );
}
