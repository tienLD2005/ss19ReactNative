import { getArticles } from "@/apis/articles.api";
import { getArticlesCategory } from "@/apis/articlesCategory.api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
  author: string;
  authorAvatar: string;
  image: string;
  likes: number;
};

type PostCardProps = {
  item: Post;
};

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/posts/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: item.authorAvatar }}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>{item.author}</Text>
        </View>
        <View style={styles.likesInfo}>
          <Ionicons name="heart-outline" size={20} color="#e53e3e" />
          <Text style={styles.likesCount}>{item.likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function PostsScreen() {
  const {
    data: rawArticles,
    isLoading: articlesLoading,
    isError: articlesError,
    error: articlesErrorObj,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  // chuẩn hoá articles thành mảng
  const articles = React.useMemo(() => {
    if (!rawArticles) return [];
    if (Array.isArray(rawArticles)) return rawArticles;
    if (Array.isArray(rawArticles.data)) return rawArticles.data;
    if (Array.isArray(rawArticles.items)) return rawArticles.items;
    return [];
  }, [rawArticles]);

  const categoryArticles = useQuery({
    queryKey: ["articlesCategory"],
    queryFn: getArticlesCategory,
  });

  const categories = React.useMemo(() => {
    const d = categoryArticles.data;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.items)) return d.items;
    return [];
  }, [categoryArticles.data]);

  if (articlesLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (articlesError) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text>Error fetching articles</Text>
        <Text>{String((articlesErrorObj as any)?.message ?? articlesErrorObj)}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={articles}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text>Không có bài viết</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", padding: 15 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  authorInfo: { flexDirection: "row", alignItems: "center" },
  authorAvatar: { width: 30, height: 30, borderRadius: 15 },
  authorName: { marginLeft: 8, fontWeight: "500" },
  likesInfo: { flexDirection: "row", alignItems: "center" },
  likesCount: { marginLeft: 5, fontWeight: "600" },
});