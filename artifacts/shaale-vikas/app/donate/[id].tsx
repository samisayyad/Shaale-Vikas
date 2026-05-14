import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/hooks/useAppStore";
import { SCHOOL_NEEDS } from "@/data/mockData";
import AnimatedProgressBar from "@/components/AnimatedProgressBar";
import CelebrationOverlay from "@/components/CelebrationOverlay";

const AMOUNTS = [500, 1000, 2500, 5000];

function formatAmount(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function DonateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addDonation } = useAppStore();

  const need = SCHOOL_NEEDS.find((n) => n.id === id) ?? SCHOOL_NEEDS[0];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount ?? 0;
  const progress = need.raisedAmount / need.goalAmount;
  const afterProgress = Math.min((need.raisedAmount + finalAmount) / need.goalAmount, 1);

  const handleDonate = async () => {
    if (finalAmount < 1) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    await addDonation({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      schoolName: need.schoolName,
      needTitle: need.needTitle,
      amount: finalAmount,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      schoolId: need.id,
    });

    setLoading(false);
    setCelebrated(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 16,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Support This School</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 120,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Need summary */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.summaryMeta}>
            <Text style={[styles.summarySchool, { color: colors.mutedForeground }]}>
              {need.schoolName}
            </Text>
            <Text style={[styles.summaryLocation, { color: colors.mutedForeground }]}>
              {need.location}
            </Text>
          </View>
          <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
            {need.needTitle}
          </Text>
          <Text style={[styles.summaryDesc, { color: colors.mutedForeground }]} numberOfLines={3}>
            {need.description}
          </Text>

          <AnimatedProgressBar
            progress={afterProgress}
            height={10}
            color={colors.primary}
            delay={200}
          />
          <View style={styles.summaryAmounts}>
            <Text style={[styles.summaryRaised, { color: colors.foreground }]}>
              {formatAmount(need.raisedAmount + (finalAmount > 0 ? finalAmount : 0))}{" "}
              <Text style={{ color: colors.mutedForeground, fontWeight: "400" }}>raised</Text>
            </Text>
            <Text style={[styles.summaryGoal, { color: colors.mutedForeground }]}>
              of {formatAmount(need.goalAmount)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="people" size={16} color={colors.mutedForeground} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                {need.sponsors} donors
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="school" size={16} color={colors.mutedForeground} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                {need.students} students
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="schedule" size={16} color={need.daysLeft <= 7 ? "#DC2626" : colors.mutedForeground} />
              <Text style={[styles.infoText, { color: need.daysLeft <= 7 ? "#DC2626" : colors.mutedForeground }]}>
                {need.daysLeft}d left
              </Text>
            </View>
          </View>
        </View>

        {/* Amount selection */}
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
          Choose Amount
        </Text>
        <View style={styles.amountGrid}>
          {AMOUNTS.map((amt) => (
            <Pressable
              key={amt}
              style={[
                styles.amountBtn,
                {
                  backgroundColor: selectedAmount === amt && !customAmount
                    ? colors.primary
                    : colors.card,
                  borderColor: selectedAmount === amt && !customAmount
                    ? colors.primary
                    : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedAmount(amt);
                setCustomAmount("");
              }}
            >
              <Text
                style={[
                  styles.amountBtnText,
                  {
                    color: selectedAmount === amt && !customAmount
                      ? colors.primaryForeground
                      : colors.foreground,
                  },
                ]}
              >
                ₹{amt.toLocaleString("en-IN")}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.customAmountWrap,
            { borderColor: customAmount ? colors.primary : colors.border, backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.rupeeSign, { color: customAmount ? colors.foreground : colors.mutedForeground }]}>
            ₹
          </Text>
          <TextInput
            style={[styles.customInput, { color: colors.foreground }]}
            placeholder="Custom amount"
            placeholderTextColor={colors.mutedForeground}
            value={customAmount}
            onChangeText={(v) => {
              setCustomAmount(v);
              setSelectedAmount(null);
            }}
            keyboardType="numeric"
          />
        </View>

        {/* Items sponsorship */}
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
          Sponsor a Specific Item
        </Text>
        <View style={[styles.itemsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {need.items.map((item, i) => (
            <Pressable
              key={item.id}
              style={[
                styles.itemRow,
                i < need.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                item.sponsored && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (!item.sponsored) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCustomAmount(item.cost.toString());
                  setSelectedAmount(null);
                }
              }}
              disabled={item.sponsored}
            >
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.foreground }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemCost, { color: colors.primary }]}>
                  {formatAmount(item.cost)}
                </Text>
              </View>
              {item.sponsored ? (
                <View style={[styles.sponsoredBadge, { backgroundColor: colors.secondary }]}>
                  <MaterialIcons name="check" size={14} color={colors.primary} />
                  <Text style={[styles.sponsoredText, { color: colors.primary }]}>Sponsored</Text>
                </View>
              ) : (
                <MaterialIcons name="add-circle-outline" size={22} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Headmaster message */}
        <View style={[styles.quoteCard, { backgroundColor: colors.secondary, borderLeftColor: colors.primary }]}>
          <MaterialIcons name="format-quote" size={24} color={colors.primary} />
          <Text style={[styles.quoteText, { color: colors.foreground }]}>
            Our students are waiting. Your support today builds their tomorrow.
          </Text>
          <Text style={[styles.quoteName, { color: colors.primary }]}>
            — {need.headmaster}, Headmaster
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Donate Button */}
      <View
        style={[
          styles.stickyBtn,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 16,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          style={[
            styles.donateBtn,
            {
              backgroundColor:
                finalAmount > 0 && !loading ? colors.primary : colors.muted,
            },
          ]}
          onPress={handleDonate}
          disabled={finalAmount < 1 || loading}
        >
          {loading ? (
            <Text style={[styles.donateBtnText, { color: colors.mutedForeground }]}>
              Processing...
            </Text>
          ) : (
            <>
              <MaterialIcons name="favorite" size={20} color={finalAmount > 0 ? colors.primaryForeground : colors.mutedForeground} />
              <Text
                style={[
                  styles.donateBtnText,
                  {
                    color: finalAmount > 0 ? colors.primaryForeground : colors.mutedForeground,
                  },
                ]}
              >
                {finalAmount > 0
                  ? `Pledge ₹${finalAmount.toLocaleString("en-IN")}`
                  : "Select an amount"}
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <CelebrationOverlay
        visible={celebrated}
        amount={finalAmount}
        schoolName={need.schoolName}
        onClose={() => {
          setCelebrated(false);
          router.replace("/(tabs)/impact");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  scroll: { padding: 16 },
  summaryCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    gap: 8,
  },
  summaryMeta: {},
  summarySchool: { fontSize: 13, fontWeight: "600" },
  summaryLocation: { fontSize: 12 },
  summaryTitle: { fontSize: 18, fontWeight: "800", lineHeight: 24 },
  summaryDesc: { fontSize: 13, lineHeight: 18 },
  summaryAmounts: { flexDirection: "row", justifyContent: "space-between" },
  summaryRaised: { fontSize: 15, fontWeight: "700" },
  summaryGoal: { fontSize: 14 },
  infoRow: { flexDirection: "row", gap: 16 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoText: { fontSize: 12 },
  sectionLabel: { fontSize: 16, fontWeight: "800", marginBottom: 12 },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  amountBtn: {
    width: "47%",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
  },
  amountBtnText: { fontSize: 18, fontWeight: "700" },
  customAmountWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
    gap: 8,
  },
  rupeeSign: { fontSize: 20, fontWeight: "700" },
  customInput: { flex: 1, fontSize: 18, fontWeight: "600" },
  itemsCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: "600" },
  itemCost: { fontSize: 15, fontWeight: "700", marginTop: 2 },
  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sponsoredText: { fontSize: 12, fontWeight: "700" },
  quoteCard: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 24,
    gap: 8,
  },
  quoteText: { fontSize: 14, lineHeight: 21, fontStyle: "italic" },
  quoteName: { fontSize: 13, fontWeight: "700" },
  stickyBtn: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  donateBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  donateBtnText: { fontSize: 17, fontWeight: "700" },
});
