import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import type { Playlist } from "../types";
import { getItemRoute, type ContentType } from "../lib/utils";

type Props = {
  playlist: Playlist;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: 140, md: 160, lg: 180 };

export function PlaylistCard({ playlist, size = "md" }: Props) {
  const dim = sizes[size];
  return (
    <Pressable
      onPress={() => router.push(`/playlist/${playlist.id}`)}
      className="mr-4 active:opacity-80"
      style={{ width: dim }}
    >
      <Image
        source={{ uri: playlist.image }}
        style={{ width: dim, height: dim }}
        className="rounded-md"
        contentFit="cover"
      />
      <Text numberOfLines={2} className="mt-2 text-sm font-semibold text-spotify-text-primary">
        {playlist.title}
      </Text>
      <Text numberOfLines={2} className="mt-0.5 text-xs text-spotify-text-secondary">
        {playlist.description}
      </Text>
    </Pressable>
  );
}

export function AlbumCard({ id, title, artist, image }: { id: string; title: string; artist: string; image: string }) {
  return (
    <Pressable
      onPress={() => router.push(`/album/${id}`)}
      className="mr-4 w-36 active:opacity-80"
    >
      <Image source={{ uri: image }} className="h-36 w-36 rounded-md" contentFit="cover" />
      <Text numberOfLines={1} className="mt-2 text-sm font-semibold text-spotify-text-primary">
        {title}
      </Text>
      <Text numberOfLines={1} className="text-xs text-spotify-text-secondary">
        {new Date().getFullYear()} • {artist}
      </Text>
    </Pressable>
  );
}

export function ShortcutCard({
  id,
  title,
  image,
  type = "playlist",
}: {
  id: string;
  title: string;
  image: string;
  type?: ContentType;
}) {
  return (
    <Pressable
      onPress={() => router.push(getItemRoute(type, id) as never)}
      className="mb-2 flex-1 flex-row items-center overflow-hidden rounded-md bg-spotify-highlight/80 active:opacity-80"
      style={{ minWidth: "47%", maxWidth: "48%" }}
    >
      <Image source={{ uri: image }} className="h-16 w-16" contentFit="cover" />
      <Text numberOfLines={2} className="flex-1 px-2 text-sm font-bold text-spotify-text-primary">
        {title}
      </Text>
    </Pressable>
  );
}

export function RecentCard({
  id,
  title,
  image,
  type = "playlist",
}: {
  id: string;
  title: string;
  image: string;
  type?: ContentType;
}) {
  return (
    <Pressable
      onPress={() => router.push(getItemRoute(type, id) as never)}
      className="mr-3 w-28 active:opacity-80"
    >
      <Image source={{ uri: image }} className="h-28 w-28 rounded-md" contentFit="cover" />
      <Text numberOfLines={2} className="mt-2 text-xs font-semibold text-spotify-text-primary">
        {title}
      </Text>
    </Pressable>
  );
}
