type PlaybackStatus = {
  positionMillis: number;
  isPlaying: boolean;
  didJustFinish: boolean;
};

export type AudioPlayerHandle = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (seconds: number) => Promise<void>;
  unload: () => Promise<void>;
  getPlaying: () => boolean;
};

/** Timer-based playback — avoids expo-av native module (ExponentAV) in Expo Go */
export function createTimerPlayer(
  durationSec: number,
  onStatus: (status: PlaybackStatus) => void
): AudioPlayerHandle {
  let playing = false;
  let positionMs = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  const tick = () => {
    positionMs += 1000;
    if (positionMs >= durationSec * 1000) {
      onStatus({ positionMillis: durationSec * 1000, isPlaying: false, didJustFinish: true });
      stopTimer();
      playing = false;
      return;
    }
    onStatus({ positionMillis: positionMs, isPlaying: true, didJustFinish: false });
  };

  const startTimer = () => {
    stopTimer();
    timer = setInterval(tick, 1000);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  return {
    play: async () => {
      playing = true;
      startTimer();
      onStatus({ positionMillis: positionMs, isPlaying: true, didJustFinish: false });
    },
    pause: async () => {
      playing = false;
      stopTimer();
      onStatus({ positionMillis: positionMs, isPlaying: false, didJustFinish: false });
    },
    seek: async (seconds) => {
      positionMs = seconds * 1000;
      onStatus({ positionMillis: positionMs, isPlaying: playing, didJustFinish: false });
    },
    unload: async () => {
      playing = false;
      stopTimer();
      positionMs = 0;
    },
    getPlaying: () => playing,
  };
}

export async function createAudioPlayer(
  _uri: string,
  durationSec: number,
  onStatus: (status: PlaybackStatus) => void
): Promise<AudioPlayerHandle | null> {
  return createTimerPlayer(durationSec, onStatus);
}
