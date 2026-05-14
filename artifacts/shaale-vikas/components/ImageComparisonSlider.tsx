import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  beforeImage: any;
  afterImage: any;
  height?: number;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  height = 200,
  beforeLabel = "Before",
  afterLabel = "After",
}: Props) {
  const colors = useColors();
  const [position, setPosition] = useState(0.5);
  const containerWidth = useRef(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      if (containerWidth.current === 0) return;
      const raw = gs.moveX / containerWidth.current;
      setPosition(Math.max(0.05, Math.min(0.95, raw)));
    },
  });

  return (
    <View
      style={[styles.container, { height, borderRadius: colors.radius ?? 12, overflow: "hidden" }]}
      onLayout={(e) => {
        containerWidth.current = e.nativeEvent.layout.width;
      }}
    >
      {/* After (base layer) */}
      <Image
        source={afterImage}
        style={[styles.image, { height }]}
        resizeMode="cover"
      />

      {/* Before (clipped overlay) */}
      <View style={[styles.beforeOverlay, { width: `${position * 100}%`, height }]}>
        <Image
          source={beforeImage}
          style={[styles.image, { width: containerWidth.current || 300, height }]}
          resizeMode="cover"
        />
      </View>

      {/* Divider */}
      <View
        style={[styles.divider, { left: `${position * 100}%`, height }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.handle, { backgroundColor: "#FFFFFF" }]}>
          <MaterialIcons name="chevron-left" size={14} color="#1A1A2E" />
          <MaterialIcons name="chevron-right" size={14} color="#1A1A2E" />
        </View>
      </View>

      {/* Labels */}
      <View style={styles.labelContainer}>
        <View style={[styles.label, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
          <Text style={styles.labelText}>{beforeLabel}</Text>
        </View>
        <View style={[styles.label, { backgroundColor: "rgba(10,124,92,0.8)" }]}>
          <Text style={styles.labelText}>{afterLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
  },
  beforeOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  divider: {
    position: "absolute",
    top: 0,
    width: 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  handle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  labelContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  labelText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
