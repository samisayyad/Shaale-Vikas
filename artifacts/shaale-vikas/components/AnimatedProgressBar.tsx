import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface Props {
  progress: number;
  height?: number;
  showLabel?: boolean;
  delay?: number;
  color?: string;
  trackColor?: string;
}

export default function AnimatedProgressBar({
  progress,
  height = 8,
  showLabel = false,
  delay = 300,
  color,
  trackColor,
}: Props) {
  const colors = useColors();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(delay, withTiming(Math.min(progress, 1), { duration: 1200 }));
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const barColor = color ?? colors.primary;
  const track = trackColor ?? colors.muted;

  return (
    <View>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Progress
          </Text>
          <Text style={[styles.label, { color: barColor, fontWeight: "700" }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          { height, backgroundColor: track, borderRadius: height / 2 },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            barStyle,
            { height, backgroundColor: barColor, borderRadius: height / 2 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
  },
});
