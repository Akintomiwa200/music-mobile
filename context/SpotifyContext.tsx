import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SPOTIFY_CLIENT_ID } from "../lib/config";
import {
  fetchHomeFeed,
  fetchUserLibrary,
  getCurrentUser,
  searchSpotify,
  fetchPlaylist,
  fetchAlbum,
  fetchArtist,
  fetchArtistTopTracks,
  fetchArtistAlbums,
  type SpotifyUser,
} from "../services/spotify/api";
import {
  getValidAccessToken,
  loadStoredTokens,
  loginWithSpotify,
  logoutSpotify,
} from "../services/spotify/auth";
import type { Album, Artist, LibraryItem, Playlist, Song } from "../types";

type SpotifyContextType = {
  isConfigured: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SpotifyUser | null;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  search: (query: string) => ReturnType<typeof searchSpotify>;
  getPlaylist: (id: string) => Promise<Playlist | null>;
  getAlbum: (id: string) => Promise<Album | null>;
  getArtist: (id: string) => Promise<{ artist: Artist; topTracks: Song[]; albums: Album[] } | null>;
  getHomeFeed: () => Promise<{ madeForYou: Song[]; favoriteArtists: Artist[]; trending: Song[] }>;
  getLibrary: () => Promise<LibraryItem[]>;
};

const SpotifyContext = createContext<SpotifyContextType | null>(null);

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = Boolean(SPOTIFY_CLIENT_ID);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tokens = await loadStoredTokens();
      if (!tokens?.accessToken) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const token = await getValidAccessToken();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const profile = await getCurrentUser();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
      setError(e instanceof Error ? e.message : "Failed to connect to Spotify");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async () => {
    setError(null);
    await loginWithSpotify();
    await bootstrap();
  }, [bootstrap]);

  const logout = useCallback(async () => {
    await logoutSpotify();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = useMemo<SpotifyContextType>(
    () => ({
      isConfigured,
      isAuthenticated,
      isLoading,
      user,
      error,
      login,
      logout,
      search: searchSpotify,
      getPlaylist: fetchPlaylist,
      getAlbum: fetchAlbum,
      getArtist: async (id) => {
        const [artist, topTracks, albums] = await Promise.all([
          fetchArtist(id),
          fetchArtistTopTracks(id),
          fetchArtistAlbums(id),
        ]);
        if (!artist) return null;
        return { artist, topTracks, albums };
      },
      getHomeFeed: fetchHomeFeed,
      getLibrary: fetchUserLibrary,
    }),
    [isConfigured, isAuthenticated, isLoading, user, error, login, logout]
  );

  return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>;
}

export function useSpotify() {
  const ctx = useContext(SpotifyContext);
  if (!ctx) throw new Error("useSpotify must be used within SpotifyProvider");
  return ctx;
}
