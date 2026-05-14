import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { ANALYTICS } from "@/data/mockData";

function formatAmount(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function BarChart() {
  const colors = useColors();
  const maxAmount = Math.max(...ANALYTICS.monthlyData.map((d) => d.amount));
  const anims = useRef(ANALYTICS.monthlyData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 700,
        delay: i * 80,
        useNativeDriver: false,
      })
    );
    Animated.stagger(60, animations).start();
  }, []);

  return (
    <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.chartTitle, { color: colors.foreground }]}>Monthly Donations</Text>
      <Text style={[styles.chartSub, { color: colors.mutedForeground }]}>
        Last 7 months
      </Text>

      <View style={styles.bars}>
        {ANALYTICS.monthlyData.map((item, i) => {
          const barHeightPct = item.amount / maxAmount;
          return (
            <View key={i} style={styles.barCol}>
              <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>
                {formatAmount(item.amount)}
              </Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: colors.primary,
                      height: anims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 100 * barHeightPct],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barMonth, { color: colors.mutedForeground }]}>
                {item.month}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function CategoryChart() {
  const colors = useColors();
  return (
    <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.chartTitle, { color: colors.foreground }]}>By Category</Text>
      <View style={styles.categoryList}>
        {ANALYTICS.categoryData.map((item, i) => (
          <View key={i} style={styles.categoryItem}>
            <View style={styles.categoryLabelRow}>
              <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
              <Text style={[styles.categoryLabel, { color: colors.foreground }]}>
                {item.label}
              </Text>
              <Text style={[styles.categoryPct, { color: colors.mutedForeground }]}>
                {item.value}%
              </Text>
            </View>
            <View style={[styles.categoryTrack, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.categoryBar,
                  { width: `${item.value}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const bigStats = [
    {
      label: "Total Funds Raised",
      value: formatAmount(ANALYTICS.totalFunds),
      icon: "account-balance-wallet",
      color: colors.primary,
      change: "+12.4%",
    },
    {
      label: "Students Impacted",
      value: ANALYTICS.studentsImpacted.toLocaleString("en-IN"),
      icon: "school",
      color: "#3B82F6",
      change: "+8.1%",
    },
    {
      label: "Projects Completed",
      value: ANALYTICS.projectsCompleted.toString(),
      icon: "check-circle",
      color: "#059669",
      change: "+4 this quarter",
    },
    {
      label: "Active Supporters",
      value: ANALYTICS.activeSupporters.toLocaleString("en-IN"),
      icon: "people",
      color: "#F59E0B",
      change: "+247 this month",
    },
  ];

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
          <Text style={[styles.title, { color: colors.foreground }]}>Analytics</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Community-wide impact overview
          </Text>
        </View>

        {/* Big Stats */}
        <View style={styles.bigStats}>
          {bigStats.map((stat, i) => (
            <View
              key={i}
              style={[
                styles.bigStatCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={[styles.bigStatIcon, { backgroundColor: stat.color + "18" }]}>
                <MaterialIcons name={stat.icon as any} size={22} color={stat.color} />
              </View>
              <Text style={[styles.bigStatValue, { color: colors.foreground }]}>
                {stat.value}
              </Text>
              <Text style={[styles.bigStatLabel, { color: colors.mutedForeground }]}>
                {stat.label}
              </Text>
              <View style={[styles.changeBadge, { backgroundColor: colors.secondary }]}>
                <MaterialIcons name="trending-up" size={12} color={colors.primary} />
                <Text style={[styles.changeText, { color: colors.primary }]}>
                  {stat.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <BarChart />
        <CategoryChart />

        {/* AI Insights */}
        <View style={[styles.aiCard, { backgroundColor: colors.primary }]}>
          <View style={styles.aiHeader}>
            <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
            <Text style={styles.aiTitle}>AI Insights</Text>
          </View>
          <Text style={styles.aiText}>
            Sanitation campaigns are 3x more likely to succeed in under 30 days. Schools in Rajasthan
            have the highest urgency score this month. Prioritize Rampur to maintain momentum.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 14 },
  bigStats: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  bigStatCard: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  bigStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  bigStatValue: { fontSize: 24, fontWeight: "900", marginBottom: 4 },
  bigStatLabel: { fontSize: 12, lineHeight: 16, marginBottom: 8 },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  changeText: { fontSize: 11, fontWeight: "700" },
  chartCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  chartTitle: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  chartSub: { fontSize: 12, marginBottom: 20 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 8, height: 130 },
  barCol: { flex: 1, alignItems: "center", gap: 4 },
  barLabel: { fontSize: 9, textAlign: "center" },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 4 },
  barMonth: { fontSize: 11, fontWeight: "600" },
  categoryList: { gap: 12 },
  categoryItem: { gap: 6 },
  categoryLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryDot: { width: 10, height: 10, borderRadius: 5 },
  categoryLabel: { flex: 1, fontSize: 13, fontWeight: "600" },
  categoryPct: { fontSize: 13, fontWeight: "700" },
  categoryTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  categoryBar: { height: 8, borderRadius: 4 },
  aiCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  aiTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  aiText: { color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 21 },
});
