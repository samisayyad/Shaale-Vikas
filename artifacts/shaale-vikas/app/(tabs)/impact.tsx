import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { IMPACT_STORIES, ImpactStory } from "@/data/mockData";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";

const BEFORE = require("@/assets/images/school_before.png");
const AFTER = require("@/assets/images/school_after.png");

function formatAmount(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function ImpactCard({ story, index }: { story: ImpactStory; index: number }) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: 20,
        },
      ]}
    >
      {/* Before/After Slider */}
      <ImageComparisonSlider
        beforeImage={BEFORE}
        afterImage={AFTER}
        height={180}
        beforeLabel="Before"
        afterLabel="After"
      />

      {/* Completed badge */}
      <View style={[styles.completedBadge, { backgroundColor: colors.secondary }]}>
        <MaterialIcons name="check-circle" size={14} color={colors.primary} />
        <Text style={[styles.completedText, { color: colors.primary }]}>
          Completed · {story.completedDate}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.schoolName, { color: colors.mutedForeground }]}>
          {story.schoolName}
        </Text>
        <Text style={[styles.location, { color: colors.mutedForeground }]}>
          {story.location}
        </Text>
        <Text style={[styles.projectTitle, { color: colors.foreground }]}>
          {story.projectTitle}
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          {story.description}
        </Text>

        {/* Stats */}
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {formatAmount(story.fundsRaised)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Raised
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {story.supporters}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Supporters
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {story.students}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Students
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ImpactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 16,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Impact Gallery</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Real transformations. Real stories.
          </Text>
        </View>

        {/* Summary banner */}
        <View style={[styles.summaryBanner, { backgroundColor: colors.primary }]}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>28</Text>
            <Text style={styles.summaryLabel}>Projects Done</Text>
          </View>
          <View style={[styles.summaryDivider]} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>5,840</Text>
            <Text style={styles.summaryLabel}>Lives Changed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>14</Text>
            <Text style={styles.summaryLabel}>Schools</Text>
          </View>
        </View>

        {/* Drag hint */}
        <View style={[styles.hintRow, { backgroundColor: colors.muted }]}>
          <MaterialIcons name="swap-horiz" size={16} color={colors.mutedForeground} />
          <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
            Drag the slider to see before &amp; after
          </Text>
        </View>

        {/* Stories */}
        {IMPACT_STORIES.map((story, i) => (
          <ImpactCard key={story.id} story={story} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 14 },
  summaryBanner: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  summaryItem: { alignItems: "center" },
  summaryValue: { fontSize: 24, fontWeight: "900", color: "#FFFFFF" },
  summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  summaryDivider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.3)" },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  hintText: { fontSize: 12 },
  card: {
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  completedText: { fontSize: 12, fontWeight: "700" },
  cardContent: { padding: 16 },
  schoolName: { fontSize: 13, fontWeight: "600" },
  location: { fontSize: 12, marginBottom: 6 },
  projectTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8, lineHeight: 24 },
  description: { fontSize: 13, lineHeight: 19, marginBottom: 16 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 11, marginTop: 2 },
  statDivider: { width: 1 },
});
