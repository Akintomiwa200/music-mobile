import type { Album, Artist, LibraryItem, Playlist, SearchCategory, Song } from "../types";

const img = (seed: string, w = 300, h = 300) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const artists: Artist[] = [
  { id: "a1", name: "The Weeknd", image: img("weeknd"), monthlyListeners: "98.2M", verified: true },
  { id: "a2", name: "Drake", image: img("drake"), monthlyListeners: "85.4M", verified: true },
  { id: "a3", name: "Taylor Swift", image: img("taylor"), monthlyListeners: "102.1M", verified: true },
  { id: "a4", name: "Bad Bunny", image: img("bunny"), monthlyListeners: "78.9M", verified: true },
  { id: "a5", name: "Billie Eilish", image: img("billie"), monthlyListeners: "72.3M", verified: true },
  { id: "a6", name: "Post Malone", image: img("post"), monthlyListeners: "68.7M", verified: true },
];

const songs: Song[] = [
  { id: "s1", title: "Blinding Lights", artist: "The Weeknd", artistId: "a1", album: "After Hours", albumId: "al1", duration: 200, image: img("bl1"), explicit: false },
  { id: "s2", title: "Save Your Tears", artist: "The Weeknd", artistId: "a1", album: "After Hours", albumId: "al1", duration: 215, image: img("bl1") },
  { id: "s3", title: "Starboy", artist: "The Weeknd", artistId: "a1", album: "Starboy", albumId: "al2", duration: 230, image: img("starboy"), explicit: true },
  { id: "s4", title: "Die For You", artist: "The Weeknd", artistId: "a1", album: "Starboy", albumId: "al2", duration: 260, image: img("starboy") },
  { id: "s5", title: "God's Plan", artist: "Drake", artistId: "a2", album: "Scorpion", albumId: "al3", duration: 198, image: img("scorp"), explicit: true },
  { id: "s6", title: "One Dance", artist: "Drake", artistId: "a2", album: "Views", albumId: "al4", duration: 173, image: img("views") },
  { id: "s7", title: "Passionfruit", artist: "Drake", artistId: "a2", album: "More Life", albumId: "al5", duration: 298, image: img("mlife") },
  { id: "s8", title: "Anti-Hero", artist: "Taylor Swift", artistId: "a3", album: "Midnights", albumId: "al6", duration: 201, image: img("midnight") },
  { id: "s9", title: "Cruel Summer", artist: "Taylor Swift", artistId: "a3", album: "Lover", albumId: "al7", duration: 178, image: img("lover") },
  { id: "s10", title: "Blank Space", artist: "Taylor Swift", artistId: "a3", album: "1989", albumId: "al8", duration: 231, image: img("1989") },
  { id: "s11", title: "Dakiti", artist: "Bad Bunny", artistId: "a4", album: "El Último Tour", albumId: "al9", duration: 205, image: img("dakiti"), explicit: true },
  { id: "s12", title: "Tití Me Preguntó", artist: "Bad Bunny", artistId: "a4", album: "Un Verano Sin Ti", albumId: "al10", duration: 243, image: img("titi"), explicit: true },
  { id: "s13", title: "bad guy", artist: "Billie Eilish", artistId: "a5", album: "WHEN WE ALL FALL ASLEEP", albumId: "al11", duration: 194, image: img("badguy") },
  { id: "s14", title: "Happier Than Ever", artist: "Billie Eilish", artistId: "a5", album: "Happier Than Ever", albumId: "al12", duration: 298, image: img("hte"), explicit: true },
  { id: "s15", title: "Circles", artist: "Post Malone", artistId: "a6", album: "Hollywood's Bleeding", albumId: "al13", duration: 215, image: img("circles") },
  { id: "s16", title: "Sunflower", artist: "Post Malone", artistId: "a6", album: "Hollywood's Bleeding", albumId: "al13", duration: 158, image: img("sunflower") },
];

export const albums: Album[] = [
  { id: "al1", title: "After Hours", artist: "The Weeknd", artistId: "a1", year: 2020, image: img("bl1"), songs: songs.filter((s) => s.albumId === "al1") },
  { id: "al2", title: "Starboy", artist: "The Weeknd", artistId: "a1", year: 2016, image: img("starboy"), songs: songs.filter((s) => s.albumId === "al2") },
  { id: "al3", title: "Scorpion", artist: "Drake", artistId: "a2", year: 2018, image: img("scorp"), songs: songs.filter((s) => s.albumId === "al3") },
  { id: "al4", title: "Views", artist: "Drake", artistId: "a2", year: 2016, image: img("views"), songs: songs.filter((s) => s.albumId === "al4") },
  { id: "al5", title: "More Life", artist: "Drake", artistId: "a2", year: 2017, image: img("mlife"), songs: songs.filter((s) => s.albumId === "al5") },
  { id: "al6", title: "Midnights", artist: "Taylor Swift", artistId: "a3", year: 2022, image: img("midnight"), songs: songs.filter((s) => s.albumId === "al6") },
  { id: "al7", title: "Lover", artist: "Taylor Swift", artistId: "a3", year: 2019, image: img("lover"), songs: songs.filter((s) => s.albumId === "al7") },
  { id: "al8", title: "1989", artist: "Taylor Swift", artistId: "a3", year: 2014, image: img("1989"), songs: songs.filter((s) => s.albumId === "al8") },
  { id: "al9", title: "El Último Tour Del Mundo", artist: "Bad Bunny", artistId: "a4", year: 2020, image: img("dakiti"), songs: songs.filter((s) => s.albumId === "al9") },
  { id: "al10", title: "Un Verano Sin Ti", artist: "Bad Bunny", artistId: "a4", year: 2022, image: img("titi"), songs: songs.filter((s) => s.albumId === "al10") },
  { id: "al11", title: "WHEN WE ALL FALL ASLEEP", artist: "Billie Eilish", artistId: "a5", year: 2019, image: img("badguy"), songs: songs.filter((s) => s.albumId === "al11") },
  { id: "al12", title: "Happier Than Ever", artist: "Billie Eilish", artistId: "a5", year: 2021, image: img("hte"), songs: songs.filter((s) => s.albumId === "al12") },
  { id: "al13", title: "Hollywood's Bleeding", artist: "Post Malone", artistId: "a6", year: 2019, image: img("circles"), songs: songs.filter((s) => s.albumId === "al13") },
];

export const playlists: Playlist[] = [
  {
    id: "p1",
    title: "Today's Top Hits",
    description: "The Weeknd is on top of the Hottest 50!",
    image: img("tth", 400, 400),
    owner: "Spotify",
    songCount: 50,
    songs: songs.slice(0, 8),
    gradient: ["#5038a0", "#121212"],
  },
  {
    id: "p2",
    title: "RapCaviar",
    description: "New music from Drake, Travis Scott, and more.",
    image: img("rap", 400, 400),
    owner: "Spotify",
    songCount: 75,
    songs: [songs[4], songs[5], songs[6], songs[10], songs[14]],
    gradient: ["#af2896", "#121212"],
  },
  {
    id: "p3",
    title: "Discover Weekly",
    description: "Your weekly mixtape of fresh music.",
    image: img("discover", 400, 400),
    owner: "Spotify",
    songCount: 30,
    songs: songs.slice(2, 10),
    gradient: ["#27856a", "#121212"],
  },
  {
    id: "p4",
    title: "Release Radar",
    description: "Catch all the latest music from artists you follow.",
    image: img("radar", 400, 400),
    owner: "Spotify",
    songCount: 30,
    songs: songs.slice(5, 13),
    gradient: ["#509bf5", "#121212"],
  },
  {
    id: "p5",
    title: "Chill Hits",
    description: "Kick back to the best new and recent chill hits.",
    image: img("chill", 400, 400),
    owner: "Spotify",
    songCount: 100,
    songs: [songs[0], songs[7], songs[12], songs[14], songs[15]],
    gradient: ["#477d95", "#121212"],
  },
  {
    id: "p6",
    title: "Hot Country",
    description: "Today's top country hits.",
    image: img("country", 400, 400),
    owner: "Spotify",
    songCount: 50,
    songs: songs.slice(0, 5),
    gradient: ["#ba5d07", "#121212"],
  },
  {
    id: "p7",
    title: "Liked Songs",
    description: "127 liked songs",
    image: img("liked", 400, 400),
    owner: "You",
    songCount: 127,
    songs,
    gradient: ["#450a0a", "#121212"],
  },
  {
    id: "p8",
    title: "Deep Focus",
    description: "Keep calm and focus with ambient and post-rock music.",
    image: img("focus", 400, 400),
    owner: "Spotify",
    songCount: 200,
    songs: songs.slice(8, 16),
    gradient: ["#777777", "#121212"],
  },
];

export const searchCategories: SearchCategory[] = [
  { id: "c1", title: "Podcasts", color: "#27856a" },
  { id: "c2", title: "Made For You", color: "#5038a0" },
  { id: "c3", title: "New Releases", color: "#509bf5" },
  { id: "c4", title: "Hip-Hop", color: "#af2896" },
  { id: "c5", title: "Pop", color: "#8d67ab" },
  { id: "c6", title: "Rock", color: "#e8115b" },
  { id: "c7", title: "Latin", color: "#148a08" },
  { id: "c8", title: "Charts", color: "#e13300" },
  { id: "c9", title: "Live Events", color: "#8400e7" },
  { id: "c10", title: "Indie", color: "#477d95" },
  { id: "c11", title: "Workout", color: "#777777" },
  { id: "c12", title: "Sleep", color: "#1e3264" },
];

export const libraryItems: LibraryItem[] = [
  { id: "p7", title: "Liked Songs", subtitle: "Playlist • 127 songs", image: img("liked"), type: "playlist", pinned: true },
  { id: "p1", title: "Today's Top Hits", subtitle: "Playlist • Spotify", image: img("tth"), type: "playlist" },
  { id: "p3", title: "Discover Weekly", subtitle: "Playlist • Spotify", image: img("discover"), type: "playlist" },
  { id: "al1", title: "After Hours", subtitle: "Album • The Weeknd", image: img("bl1"), type: "album" },
  { id: "al6", title: "Midnights", subtitle: "Album • Taylor Swift", image: img("midnight"), type: "album" },
  { id: "a1", title: "The Weeknd", subtitle: "Artist", image: img("weeknd"), type: "artist" },
  { id: "a2", title: "Drake", subtitle: "Artist", image: img("drake"), type: "artist" },
  { id: "p2", title: "RapCaviar", subtitle: "Playlist • Spotify", image: img("rap"), type: "playlist" },
  { id: "al10", title: "Un Verano Sin Ti", subtitle: "Album • Bad Bunny", image: img("titi"), type: "album" },
  { id: "a3", title: "Taylor Swift", subtitle: "Artist", image: img("taylor"), type: "artist" },
];

export const recentlyPlayed = [
  { id: "p1", title: "Today's Top Hits", image: img("tth", 200, 200), type: "playlist" as const },
  { id: "p3", title: "Discover Weekly", image: img("discover", 200, 200), type: "playlist" as const },
  { id: "al1", title: "After Hours", image: img("bl1", 200, 200), type: "album" as const },
  { id: "p7", title: "Liked Songs", image: img("liked", 200, 200), type: "playlist" as const },
  { id: "p5", title: "Chill Hits", image: img("chill", 200, 200), type: "playlist" as const },
  { id: "al6", title: "Midnights", image: img("midnight", 200, 200), type: "album" as const },
];

export const homeShortcuts = [
  { id: "p7", title: "Liked Songs", image: img("liked", 100, 100), type: "playlist" as const },
  { id: "p1", title: "Today's Top Hits", image: img("tth", 100, 100), type: "playlist" as const },
  { id: "al1", title: "After Hours", image: img("bl1", 100, 100), type: "album" as const },
  { id: "p3", title: "Discover Weekly", image: img("discover", 100, 100), type: "playlist" as const },
  { id: "a1", title: "The Weeknd", image: img("weeknd", 100, 100), type: "artist" as const },
  { id: "p2", title: "RapCaviar", image: img("rap", 100, 100), type: "playlist" as const },
];

export function getPlaylist(id: string) {
  return playlists.find((p) => p.id === id);
}

export function getAlbum(id: string) {
  return albums.find((a) => a.id === id);
}

export function getArtist(id: string) {
  return artists.find((a) => a.id === id);
}

export function searchAll(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { songs: [], albums: [], playlists: [], artists: [] };
  return {
    songs: songs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)),
    albums: albums.filter((a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)),
    playlists: playlists.filter((p) => p.title.toLowerCase().includes(q)),
    artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
  };
}

export { songs };
