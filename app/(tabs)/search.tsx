import { useEffect, useState } from "react";
import { ScrollView, TextInput, View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SearchCategoryCard } from "../../components/FilterChips";
import { SpotifyConnectBanner } from "../../components/spotify/SpotifyConnectBanner";
import { SpotifyAuthRequired } from "../../components/spotify/SpotifyAuthRequired";
import { useSpotify } from "../../context/SpotifyContext";
import { APP_NAME, ONVIZA } from "../../lib/theme";
import { useTabScreenPadding } from "../../hooks/useTabScreenPadding";
import type { SearchCategory } from "../../types";

export default function SearchScreen() {
  const bottomPad = useTabScreenPadding();
  const { isAuthenticated, isLoading, getBrowseCategories } = useSpotify();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setCategories([]);
      return;
    }

    let cancelled = false;
    setLoadingCategories(true);
    getBrowseCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getBrowseCategories]);

  const handleSubmit = () => {
    if (query.trim()) {
      router.push({ pathname: "/search-results", params: { q: query.trim() } });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <View className="px-5 pb-4 pt-4">
        <Text className="text-[28px] font-extrabold text-white">{APP_NAME}</Text>
        <Text className="mt-1 text-sm text-spotify-text-secondary">Discover music</Text>
      </View>

      <View className="px-5 pb-4">
        <View
          className="flex-row items-center rounded-2xl px-4 py-3.5"
          style={{ backgroundColor: ONVIZA.card, borderWidth: 1, borderColor: ONVIZA.border }}
        >
          <Ionicons name="search" size={20} color={ONVIZA.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="Artists, songs, or podcasts"
            placeholderTextColor={ONVIZA.textDim}
            returnKeyType="search"
            className="ml-3 flex-1 text-base text-white"
            editable={isAuthenticated}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color={ONVIZA.textDim} />
            </Pressable>
          )}
        </View>
      </View>

      {!isAuthenticated && !isLoading && <SpotifyConnectBanner compact />}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={ONVIZA.purpleLight} />
        </View>
      ) : !isAuthenticated ? (
        <SpotifyAuthRequired
          title="Search Spotify"
          message="Connect your account to search millions of songs, albums, artists, and podcasts."
          compact
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: bottomPad }}>
          <Text className="mb-4 text-sm font-bold uppercase tracking-wider text-spotify-text-secondary">Browse all</Text>
          {loadingCategories ? (
            <ActivityIndicator color={ONVIZA.purpleLight} />
          ) : (
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {categories.map((cat) => (
                <SearchCategoryCard
                  key={cat.id}
                  title={cat.title}
                  color={cat.color}
                  onPress={() => router.push({ pathname: "/search-results", params: { q: cat.title } })}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
