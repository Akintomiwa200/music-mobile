import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES } from "../../lib/config";
import type { SpotifyTokenResponse } from "./types";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "@spotify_auth_tokens";

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export function getRedirectUri() {
  return AuthSession.makeRedirectUri({ scheme: "spotify", path: "redirect" });
}

export async function loadStoredTokens(): Promise<StoredTokens | null> {
  const raw = await AsyncStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredTokens;
  } catch {
    return null;
  }
}

async function saveTokens(tokens: StoredTokens) {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export async function clearStoredTokens() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

function toStoredTokens(response: SpotifyTokenResponse, existingRefresh?: string): StoredTokens {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token ?? existingRefresh ?? "",
    expiresAt: Date.now() + response.expires_in * 1000 - 60_000,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<StoredTokens> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: SPOTIFY_CLIENT_ID,
  });

  const res = await fetch(discovery.tokenEndpoint!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh Spotify token");
  }

  const data = (await res.json()) as SpotifyTokenResponse;
  const stored = toStoredTokens(data, refreshToken);
  await saveTokens(stored);
  return stored;
}

export async function getValidAccessToken(): Promise<string | null> {
  const stored = await loadStoredTokens();
  if (!stored?.accessToken) return null;

  if (Date.now() < stored.expiresAt) {
    return stored.accessToken;
  }

  if (!stored.refreshToken) {
    await clearStoredTokens();
    return null;
  }

  try {
    const refreshed = await refreshAccessToken(stored.refreshToken);
    return refreshed.accessToken;
  } catch {
    await clearStoredTokens();
    return null;
  }
}

export async function loginWithSpotify(): Promise<StoredTokens> {
  if (!SPOTIFY_CLIENT_ID) {
    throw new Error("Add EXPO_PUBLIC_SPOTIFY_CLIENT_ID to your .env file");
  }

  const redirectUri = getRedirectUri();
  const request = new AuthSession.AuthRequest({
    clientId: SPOTIFY_CLIENT_ID,
    scopes: SPOTIFY_SCOPES.split(" "),
    redirectUri,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
  });

  await request.makeAuthUrlAsync(discovery);
  const result = await request.promptAsync(discovery);

  if (result.type !== "success" || !result.params.code) {
    throw new Error("Spotify login was cancelled");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: result.params.code,
    redirect_uri: redirectUri,
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: request.codeVerifier ?? "",
  });

  const res = await fetch(discovery.tokenEndpoint!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Spotify token exchange failed");
  }

  const data = (await res.json()) as SpotifyTokenResponse;
  const stored = toStoredTokens(data);
  await saveTokens(stored);
  return stored;
}

export async function logoutSpotify() {
  await clearStoredTokens();
}
