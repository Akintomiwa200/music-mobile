import { useRef } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { cn } from "../lib/utils";

type Props = {
  progress: number;
  duration: number;
  onSeek?: (value: number) => void;
  className?: string;
  height?: number;
  seekable?: boolean;
  accentColor?: string;
};

export function ProgressBar({
  progress,
  duration,
  onSeek,
  className,
  height = 3,
  seekable = false,
  accentColor = "#FFFFFF",
}: Props) {
  const pct = duration > 0 ? Math.min((progress / duration) * 100, 100) : 0;
  const barWidthRef = useRef(0);

  const handleSeek = (locationX: number) => {
    if (!onSeek || !seekable || duration <= 0 || barWidthRef.current <= 0) return;
    const ratio = Math.max(0, Math.min(locationX / barWidthRef.current, 1));
    onSeek(Math.floor(ratio * duration));
  };

  const onLayout = (e: LayoutChangeEvent) => {
    barWidthRef.current = e.nativeEvent.layout.width;
  };

  const bar = (
    <View className="flex-1 overflow-hidden rounded-full bg-white/20" style={{ height }} onLayout={onLayout}>
      <View className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: accentColor }} />
    </View>
  );

  if (seekable && onSeek) {
    return (
      <Pressable onPress={(e) => handleSeek(e.nativeEvent.locationX)} className={cn("w-full flex-row items-center", className)}>
        {bar}
      </Pressable>
    );
  }

  return <View className={cn("w-full flex-row items-center", className)}>{bar}</View>;
}
