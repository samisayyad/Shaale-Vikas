import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/hooks/useAppStore";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Schools That Need You",
    subtitle:
      "Rural schools across India are waiting for support. Infrastructure needs — from roofs to toilets — are keeping children away from education.",
    icon: "school",
    color: "#0A7C5C",
    bg: "#E8F5F0",
  },
  {
    id: "2",
    title: "Alumni, Rise Up",
    subtitle:
      "Your old school shaped who you are. Now it's your turn to shape its future. Connect with other alumni and donate transparently.",
    icon: "people",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    id: "3",
    title: "Track Real Impact",
    subtitle:
      "See before & after photos. Track funds. Watch milestones. Know that every rupee you give builds a better tomorrow.",
    icon: "auto-graph",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
];

function Slide({ item }: { item: typeof SLIDES[0] }) {
  const colors = useColors();
  return (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.illustrationContainer, { backgroundColor: item.bg }]}>
        <View style={[styles.iconCircle, { backgroundColor: item.color + "22" }]}>
          <View style={[styles.iconInner, { backgroundColor: item.color + "33" }]}>
            <MaterialIcons name={item.icon as any} size={72} color={item.color} />
          </View>
        </View>
      </View>
      <View style={styles.textSection}>
        <Text style={[styles.slideTitle, { color: colors.foreground }]}>
          {item.title}
        </Text>
        <Text style={[styles.slideSubtitle, { color: colors.mutedForeground }]}>
          {item.subtitle}
        </Text>
      </View>
    </View>
  );
}

function Dot({ index, activeIndex }: { index: number; activeIndex: number }) {
  const colors = useColors();
  const isActive = index === activeIndex;
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: isActive ? colors.primary : colors.border,
          width: isActive ? 24 : 8,
        },
      ]}
    />
  );
}

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const onViewChange = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      handleStart();
    }
  };

  const handleStart = async () => {
    await completeOnboarding();
    router.replace("/auth");
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip */}
      {!isLast && (
        <Pressable
          style={[
            styles.skipBtn,
            { top: insets.top + (Platform.OS === "web" ? 67 : 16) },
          ]}
          onPress={handleStart}
        >
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
            Skip
          </Text>
        </Pressable>
      )}

      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} />}
        onViewableItemsChanged={onViewChange}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Bottom controls */}
      <View
        style={[
          styles.controls,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 16 },
        ]}
      >
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} activeIndex={activeIndex} />
          ))}
        </View>

        {/* CTA */}
        <Pressable
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          onPress={goNext}
        >
          <Text style={[styles.nextText, { color: colors.primaryForeground }]}>
            {isLast ? "Get Started" : "Next"}
          </Text>
          <MaterialIcons
            name={isLast ? "rocket-launch" : "arrow-forward"}
            size={20}
            color={colors.primaryForeground}
          />
        </Pressable>

        {/* Brand mark */}
        <Text style={[styles.brand, { color: colors.mutedForeground }]}>
          Shaale-Vikas · Building Futures Together
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "600",
  },
  slide: {
    flex: 1,
  },
  illustrationContainer: {
    height: height * 0.48,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  textSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 14,
    lineHeight: 36,
  },
  slideSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  controls: {
    paddingHorizontal: 24,
    gap: 20,
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextText: {
    fontSize: 17,
    fontWeight: "700",
  },
  brand: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
