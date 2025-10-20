import { deleteArticle, getArticlesMe } from "@/apis/articles.api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Post = {
  id: string;
  title: string;
  status: "published" | "draft";
  image: string;
};

const PostRow = ({ item, onDelete }: { item: Post; onDelete: (id: string) => void }) => {
  const router = useRouter();
  return (
    <View style={styles.postRow}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postInfo}>
        <Text style={styles.postTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "published" ? "#4ade80" : "#facc15",
            },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === "published" ? "Đã xuất bản" : "Bản nháp"}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push(`/profile/edit-post?postId=${item.id}`)}
        >
          <Ionicons name="pencil-outline" size={22} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Xóa", `Bạn có chắc muốn xóa: ${item.title}`, [
              { text: "Hủy", style: "cancel" },
              { text: "Xóa", style: "destructive", onPress: () => onDelete(item.id) },
            ])
          }
        >
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MyPostsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-posts"],
    queryFn: getArticlesMe,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      // refetch list
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: (err: any) => {
      Alert.alert("Lỗi", String(err?.message ?? err));
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // chuẩn hoá sang mảng để FlatList dùng
  const posts = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    return [];
  }, [data]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text>Error fetching articles</Text>
        <Text>{String((error as any)?.message ?? error)}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/profile/create-post")}>
              <Ionicons name="add-circle" size={32} color="#22c55e" />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList<Post>
        data={posts}
        renderItem={({ item }: { item: Post }) => (
          <PostRow item={item} onDelete={handleDelete} />
        )}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bạn chưa có bài viết nào.</Text>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  postRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  postImage: { width: 80, height: 80, borderRadius: 10 },
  postInfo: { flex: 1, marginLeft: 15 },
  postTitle: { fontSize: 16, fontWeight: "600" },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 8,
  },
  statusText: { fontSize: 12, fontWeight: "bold", color: "white" },
  actions: { flexDirection: "row", gap: 15 },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
});