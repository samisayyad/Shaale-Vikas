import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { FeedPost } from "@/data/mockData";

interface Props {
  post: FeedPost;
  liked: boolean;
  onToggleLike: () => void;
}

const TYPE_CONFIG = {
  donation: { icon: "favorite", label: "Donated", color: "#EC4899" },
  milestone: { icon: "flag", label: "Milestone", color: "#F59E0B" },
  announcement: { icon: "campaign", label: "Announcement", color: "#3B82F6" },
  success: { icon: "emoji-events", label: "Success Story", color: "#0A7C5C" },
};

function formatAmount(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export default function AlumniFeedCard({ post, liked, onToggleLike }: Props) {
  const colors = useColors();
  const typeConfig = TYPE_CONFIG[post.type];
  const heartScale = useSharedValue(1);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    onToggleLike();
  };

  const likeCount = liked ? post.likes + 1 : post.likes;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius ?? 16,
        },
      ]}
    >
      {/* Type banner */}
      {post.type === "success" && (
        <View style={[styles.successBanner, { backgroundColor: colors.secondary }]}>
          <MaterialIcons name="emoji-events" size={14} color={colors.primary} />
          <Text style={[styles.successText, { color: colors.primary }]}>
            Success Story
          </Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Author row */}
        <View style={styles.authorRow}>
          <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
            <Text style={styles.avatarText}>{post.initials}</Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.foreground }]}>
              {post.userName}
            </Text>
            <Text style={[styles.authorRole, { color: colors.mutedForeground }]}>
              {post.userRole}
            </Text>
          </View>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: typeConfig.color + "18" },
            ]}
          >
            <MaterialIcons
              name={typeConfig.icon as any}
              size={12}
              color={typeConfig.color}
            />
          </View>
        </View>

        {/* School tag */}
        <View style={styles.schoolTag}>
          <MaterialIcons
            name="school"
            size={12}
            color={colors.mutedForeground}
          />
          <Text
            style={[styles.schoolTagText, { color: colors.mutedForeground }]}
          >
            {post.school}
          </Text>
        </View>

        {/* Amount highlight */}
        {post.amount && (
          <View style={[styles.amountBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.amountText, { color: colors.primary }]}>
              {formatAmount(post.amount)} contributed
            </Text>
          </View>
        )}

        {/* Content */}
        <Text style={[styles.postContent, { color: colors.foreground }]}>
          {post.content}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
            {post.timestamp}
          </Text>
          <Pressable style={styles.likeBtn} onPress={handleLike}>
            <Animated.View style={heartStyle}>
              <MaterialIcons
                name={liked ? "favorite" : "favorite-border"}
                size={18}
                color={liked ? "#EC4899" : colors.mutedForeground}
              />
            </Animated.View>
            <Text
              style={[
                styles.likeCount,
                { color: liked ? "#EC4899" : colors.mutedForeground },
              ]}
            >
              {likeCount}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  successText: {
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    padding: 16,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
  },
  authorRole: {
    fontSize: 12,
  },
  typeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  schoolTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  schoolTagText: {
    fontSize: 12,
  },
  amountBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  amountText: {
    fontSize: 13,
    fontWeight: "700",
  },
  postContent: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    fontSize: 13,
    fontWeight: "600",
  },
});
