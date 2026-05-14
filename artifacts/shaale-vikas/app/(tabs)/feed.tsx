import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/hooks/useAppStore";
import { FEED_POSTS, FeedPost } from "@/data/mockData";
import AlumniFeedCard from "@/components/AlumniFeedCard";

export default function FeedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { likedPosts, toggleLike } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlumniFeedCard
            post={item}
            liked={likedPosts.includes(item.id)}
            onToggleLike={() => toggleLike(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.feedHeader}>
            <Text style={[styles.feedTitle, { color: colors.foreground }]}>
              Community Feed
            </Text>
            <Text style={[styles.feedSub, { color: colors.mutedForeground }]}>
              Stories from alumni, donors & headmasters
            </Text>
            <View style={[styles.liveBar, { backgroundColor: colors.secondary }]}>
              <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.liveText, { color: colors.primary }]}>
                Live updates from the community
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="feed" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No posts yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 16 },
  feedHeader: { marginBottom: 20 },
  feedTitle: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  feedSub: { fontSize: 14, marginBottom: 14 },
  liveBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: { fontSize: 13, fontWeight: "600" },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16 },
});
