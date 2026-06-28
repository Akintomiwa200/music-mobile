import { useMemo, useRef } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { ONVIZA } from "../../lib/theme";

const BAR_COUNT = 56;

function seededHeights(seed: string): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % 997;
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    h = (h * 16807 + i * 37) % 100;
    return 10 + (h % 32);
  });
}

type Props = {
  progress: number;
  duration: number;
  onSeek?: (v: number) => void;
  seed?: string;
};

export function WaveformProgress({ progress, duration, onSeek, seed = "wave" }: Props) {
  const heights = useMemo(() => seededHeights(seed), [seed]);
  const widthRef = useRef(280);
  const pct = duration > 0 ? Math.min(progress / duration, 1) : 0;
  const activeBars = Math.floor(pct * BAR_COUNT);

  const onLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
  };

  return (
    <Pressable
      onPress={(e) => {
        if (!onSeek || duration <= 0) return;
        const ratio = Math.max(0, Math.min(e.nativeEvent.locationX / widthRef.current, 1));
        onSeek(Math.floor(ratio * duration));
      }}
      onLayout={onLayout}
      className="h-16 flex-row items-end justify-between gap-[2px]"
    >
      {heights.map((h, i) => {
        const played = i < activeBars;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: h,
              borderRadius: 3,
              backgroundColor: played ? ONVIZA.purpleLight : "rgba(120, 100, 150, 0.35)",
              opacity: played ? 1 : 0.7,
            }}
          />
        );
      })}
    </Pressable>
  );
}
