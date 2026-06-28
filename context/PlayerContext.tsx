import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as Linking from "expo-linking";
import type { PlayerState, Song } from "../types";
import { shuffleArray } from "../lib/utils";
import { createTimerPlayer, type AudioPlayerHandle } from "../lib/audioPlayer";
import { getSpotifyDeepLink, getSpotifyOpenUrl } from "../services/spotify/api";

type PlayerContextType = PlayerState & {
  hasPreview: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
  playQueue: (queue: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (progress: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  clearQueue: () => void;
  openInSpotify: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [hasPreview, setHasPreview] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const playerRef = useRef<AudioPlayerHandle | null>(null);
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const repeatRef = useRef(repeat);
  const advancingRef = useRef(false);

  queueRef.current = queue;
  queueIndexRef.current = queueIndex;
  repeatRef.current = repeat;

  const handleTrackFinished = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    const q = queueRef.current;
    const idx = queueIndexRef.current;
    const r = repeatRef.current;

    if (r === "one" && q[idx]) {
      setProgress(0);
      setShouldAutoplay(true);
      setCurrentSong(q[idx]);
      advancingRef.current = false;
      return;
    }

    let nextIdx = idx + 1;
    if (nextIdx >= q.length) {
      if (r === "all") nextIdx = 0;
      else {
        setIsPlaying(false);
        advancingRef.current = false;
        return;
      }
    }

    setQueueIndex(nextIdx);
    setProgress(0);
    setShouldAutoplay(true);
    setCurrentSong(q[nextIdx]);
    advancingRef.current = false;
  }, []);

  const unloadPlayer = useCallback(async () => {
    if (playerRef.current) {
      try {
        await playerRef.current.unload();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    }
  }, []);

  const loadSong = useCallback(
    async (song: Song, autoplay: boolean) => {
      await unloadPlayer();
      setHasPreview(true);

      const onStatus = (status: { positionMillis: number; isPlaying: boolean; didJustFinish: boolean }) => {
        setProgress(Math.floor(status.positionMillis / 1000));
        setIsPlaying(status.isPlaying);
        if (status.didJustFinish) handleTrackFinished();
      };

      const player = createTimerPlayer(song.duration, onStatus);
      playerRef.current = player;

      if (autoplay) {
        await player.play();
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    },
    [handleTrackFinished, unloadPlayer]
  );

  useEffect(() => {
    if (!currentSong) return;
    loadSong(currentSong, shouldAutoplay);
    setShouldAutoplay(false);
  }, [currentSong?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      unloadPlayer();
    };
  }, [unloadPlayer]);

  const playQueue = useCallback((newQueue: Song[], startIndex = 0) => {
    if (newQueue.length === 0) return;
    const idx = Math.min(startIndex, newQueue.length - 1);
    setQueue(newQueue);
    setQueueIndex(idx);
    setProgress(0);
    setShouldAutoplay(true);
    setCurrentSong(newQueue[idx]);
  }, []);

  const playSong = useCallback(
    (song: Song, customQueue?: Song[]) => {
      const q = customQueue ?? [song];
      const idx = q.findIndex((s) => s.id === song.id);
      playQueue(q, idx >= 0 ? idx : 0);
    },
    [playQueue]
  );

  const togglePlay = useCallback(async () => {
    if (!currentSong) return;

    if (!playerRef.current) {
      setShouldAutoplay(true);
      await loadSong(currentSong, true);
      return;
    }

    if (isPlaying) {
      await playerRef.current.pause();
      setIsPlaying(false);
    } else {
      await playerRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong, isPlaying, loadSong]);

  const pause = useCallback(async () => {
    if (playerRef.current) await playerRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(async () => {
    if (!currentSong) return;
    if (!playerRef.current) {
      await loadSong(currentSong, true);
      return;
    }
    await playerRef.current.play();
    setIsPlaying(true);
  }, [currentSong, loadSong]);

  const next = useCallback(() => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    const r = repeatRef.current;
    if (q.length === 0) return;

    let nextIdx = idx + 1;
    if (nextIdx >= q.length) {
      if (r === "all") nextIdx = 0;
      else return;
    }

    setQueueIndex(nextIdx);
    setProgress(0);
    setShouldAutoplay(true);
    setCurrentSong(q[nextIdx]);
  }, []);

  const previous = useCallback(async () => {
    if (progress > 3) {
      setProgress(0);
      if (playerRef.current) await playerRef.current.seek(0);
      return;
    }

    const q = queueRef.current;
    if (q.length === 0) return;

    let prevIdx = queueIndexRef.current - 1;
    if (prevIdx < 0) prevIdx = repeatRef.current === "all" ? q.length - 1 : 0;

    setQueueIndex(prevIdx);
    setProgress(0);
    setShouldAutoplay(true);
    setCurrentSong(q[prevIdx]);
  }, [progress]);

  const seek = useCallback(async (seconds: number) => {
    setProgress(seconds);
    if (playerRef.current) await playerRef.current.seek(seconds);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      if (!s && queue.length > 1) {
        const current = queue[queueIndex];
        const rest = queue.filter((_, i) => i !== queueIndex);
        const shuffled = shuffleArray(rest);
        setQueue([current, ...shuffled]);
        setQueueIndex(0);
      }
      return !s;
    });
  }, [queue, queueIndex]);

  const toggleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const clearQueue = useCallback(async () => {
    await unloadPlayer();
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
    setQueue([]);
    setQueueIndex(0);
    setHasPreview(false);
  }, [unloadPlayer]);

  const openInSpotify = useCallback(() => {
    if (!currentSong) return;
    Linking.openURL(getSpotifyDeepLink(currentSong)).catch(() => {
      Linking.openURL(getSpotifyOpenUrl(currentSong));
    });
  }, [currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        shuffle,
        repeat,
        queue,
        queueIndex,
        hasPreview,
        playSong,
        playQueue,
        togglePlay,
        pause,
        resume,
        next,
        previous,
        seek,
        toggleShuffle,
        toggleRepeat,
        clearQueue,
        openInSpotify,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
