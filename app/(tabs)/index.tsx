import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { FilterChips, SectionHeader } from "../../components/FilterChips";
import { OnvizaHeader } from "../../components/onviza/OnvizaHeader";
import { MadeForYouCard } from "../../components/onviza/MadeForYouCard";
import { FavoriteArtistCard } from "../../components/onviza/FavoriteArtistCard";
import { TrendingRow } from "../../components/onviza/TrendingRow";
import { SpotifyConnectBanner, SpotifyLoading } from "../../components/spotify/SpotifyConnectBanner";
import { SpotifyAuthRequired } from "../../components/spotify/SpotifyAuthRequired";
import { useSpotify } from "../../context/SpotifyContext";
import { useTabScreenPadding } from "../../hooks/useTabScreenPadding";
import { GENRE_FILTERS } from "../../lib/theme";
import type { Artist, Song } from "../../types";

export default function HomeScreen() {
  const bottomPad = useTabScreenPadding();
  const { isAuthenticated, isLoading, getHomeFeed } = useSpotify();
  const [filter, setFilter] = useState<string>("All");
  const [madeForYou, setMadeForYou] = useState<Song[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [trending, setTrending] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setMadeForYou([]);
      setFavoriteArtists([]);
      setTrending([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getHomeFeed(filter)
      .then((feed) => {
        if (!cancelled) {
          setMadeForYou(feed.madeForYou);
          setFavoriteArtists(feed.favoriteArtists);
          setTrending(feed.trending);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setMadeForYou([]);
          setFavoriteArtists([]);
          setTrending([]);
          setError(e instanceof Error ? e.message : "Failed to load feed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, filter, getHomeFeed]);

  const hasContent = madeForYou.length + favoriteArtists.length + trending.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        <OnvizaHeader />
        <SpotifyConnectBanner compact={!isAuthenticated} />

        {isAuthenticated && (
          <FilterChips filters={[...GENRE_FILTERS]} active={filter} onChange={setFilter} accentColor="#9333EA" />
        )}

        {isLoading ? (
          <SpotifyLoading />
        ) : !isAuthenticated ? (
          <SpotifyAuthRequired
            title="Your music, live from Spotify"
            message="Connect your account to see personalized recommendations, top artists, and trending tracks."
            compact
          />
        ) : loading ? (
          <SpotifyLoading />
        ) : error ? (
          <SpotifyAuthRequired title="Couldn't load your feed" message={error} compact />
        ) : !hasContent ? (
          <SpotifyAuthRequired
            title="No recommendations yet"
            message="Listen to more music on Spotify and your personalized feed will appear here."
            compact
          />
        ) : (
          <>
            {madeForYou.length > 0 && (
              <View className="mt-4">
                <SectionHeader title="Made for You" onSeeAll={() => router.push("/(tabs)/search")} />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingRight: 28 }}
                >
                  {madeForYou.map((song) => (
                    <MadeForYouCard key={song.id} song={song} queue={madeForYou} />
                  ))}
                </ScrollView>
              </View>
            )}

            {favoriteArtists.length > 0 && (
              <View className="mt-8">
                <SectionHeader title="Favourite Artists" onSeeAll={() => router.push("/(tabs)/library")} />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingRight: 28 }}
                >
                  {favoriteArtists.map((artist) => (
                    <FavoriteArtistCard key={artist.id} artist={artist} />
                  ))}
                </ScrollView>
              </View>
            )}

            {trending.length > 0 && (
              <View className="mt-8">
                <SectionHeader title="Trending Now" />
                <View className="px-5">
                  {trending.map((song, index) => (
                    <TrendingRow key={song.id} song={song} queue={trending} isLast={index === trending.length - 1} />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
