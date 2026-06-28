import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { PlayerState, Song } from "../types";
import { shuffleArray } from "../lib/utils";

type PlayerContextType = PlayerState & {
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (!currentSong) return 0;
        if (p >= currentSong.duration) return currentSong.duration;
        return p + 1;
      });
    }, 1000);
  }, [clearTimer, currentSong]);

  useEffect(() => {
    if (isPlaying && currentSong) {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isPlaying, currentSong, startTimer, clearTimer]);

  useEffect(() => {
    if (currentSong && progress >= currentSong.duration && isPlaying) {
      if (repeat === "one") {
        setProgress(0);
      } else if (queue.length > 0 && queueIndex < queue.length - 1) {
        const nextIdx = queueIndex + 1;
        setQueueIndex(nextIdx);
        setCurrentSong(queue[nextIdx]);
        setProgress(0);
      } else if (repeat === "all" && queue.length > 0) {
        setQueueIndex(0);
        setCurrentSong(queue[0]);
        setProgress(0);
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    }
  }, [progress, currentSong, isPlaying, repeat, queue, queueIndex]);

  const playQueue = useCallback((newQueue: Song[], startIndex = 0) => {
    if (newQueue.length === 0) return;
    const idx = Math.min(startIndex, newQueue.length - 1);
    setQueue(newQueue);
    setQueueIndex(idx);
    setCurrentSong(newQueue[idx]);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const playSong = useCallback(
    (song: Song, customQueue?: Song[]) => {
      const q = customQueue ?? [song];
      const idx = q.findIndex((s) => s.id === song.id);
      playQueue(q, idx >= 0 ? idx : 0);
    },
    [playQueue]
  );

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying((p) => !p);
  }, [currentSong]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => {
    if (currentSong) setIsPlaying(true);
  }, [currentSong]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) {
      if (repeat === "all") nextIdx = 0;
      else {
        setIsPlaying(false);
        return;
      }
    }
    setQueueIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setProgress(0);
    setIsPlaying(true);
  }, [queue, queueIndex, repeat]);

  const previous = useCallback(() => {
    if (progress > 3) {
      setProgress(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) prevIdx = repeat === "all" ? queue.length - 1 : 0;
    setQueueIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setProgress(0);
    setIsPlaying(true);
  }, [queue, queueIndex, progress, repeat]);

  const seek = useCallback((p: number) => setProgress(p), []);

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      if (!s && queue.length > 1) {
        const current = queue[queueIndex];
        const rest = queue.filter((_, i) => i !== queueIndex);
        const shuffled = shuffleArray(rest);
        const newQueue = [current, ...shuffled];
        setQueue(newQueue);
        setQueueIndex(0);
      }
      return !s;
    });
  }, [queue, queueIndex]);

  const toggleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const clearQueue = useCallback(() => {
    clearTimer();
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
    setQueue([]);
    setQueueIndex(0);
  }, [clearTimer]);

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
