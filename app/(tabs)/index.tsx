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
import { artists as mockArtists, songs as mockSongs } from "../../constants/data";
import { useSpotify } from "../../context/SpotifyContext";
import { useTabScreenPadding } from "../../hooks/useTabScreenPadding";
import { GENRE_FILTERS } from "../../lib/theme";
import type { Artist, Song } from "../../types";

export default function HomeScreen() {
  const bottomPad = useTabScreenPadding();
  const { isAuthenticated, getHomeFeed } = useSpotify();
  const [filter, setFilter] = useState<string>("All");
  const [madeForYou, setMadeForYou] = useState<Song[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [trending, setTrending] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setMadeForYou(mockSongs.slice(0, 10));
      setFavoriteArtists(mockArtists);
      setTrending(mockSongs.slice(0, 8));
      return;
    }

    let cancelled = false;
    setLoading(true);
    getHomeFeed()
      .then((feed) => {
        if (!cancelled) {
          setMadeForYou(feed.madeForYou);
          setFavoriteArtists(feed.favoriteArtists);
          setTrending(feed.trending);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMadeForYou(mockSongs.slice(0, 10));
          setFavoriteArtists(mockArtists);
          setTrending(mockSongs.slice(0, 8));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getHomeFeed]);

  return (
    <SafeAreaView className="flex-1 bg-onviza-bg" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        <OnvizaHeader />
        <SpotifyConnectBanner compact={!isAuthenticated} />

        <FilterChips filters={[...GENRE_FILTERS]} active={filter} onChange={setFilter} accentColor="#9333EA" />

        {loading ? (
          <SpotifyLoading />
        ) : (
          <>
            <View className="mt-4">
              <SectionHeader
                title="Made for You"
                onSeeAll={() => router.push("/(tabs)/search")}
              />
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

            <View className="mt-8">
              <SectionHeader
                title="Favourite Artists"
                onSeeAll={() => router.push("/(tabs)/library")}
              />
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

            <View className="mt-8">
              <SectionHeader title="Trending Now" />
              <View className="px-5">
                {trending.map((song, index) => (
                  <TrendingRow key={song.id} song={song} queue={trending} isLast={index === trending.length - 1} />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
