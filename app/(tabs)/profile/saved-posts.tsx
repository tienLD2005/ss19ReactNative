import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SavedPost = {
  id: string;
  title: string;
  author: string;
  image: string;
};

const SAVED_POSTS: SavedPost[] = [
  {
    id: "2",
    title: "Hướng dẫn xây dựng UI/UX đẹp mắt với Expo Router",
    author: "Ngọ Văn Quý",
    image:
      "https://devopsify.co/wp-content/uploads/2023/07/1_RLn8J9mFSo6O9N6jf7Pomw1.png",
  },
  {
    id: "4",
    title: "So sánh Redux Toolkit và TanStack Query",
    author: "Ngọ Văn Quý",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
  },
];

const SavedPostCard = ({ item }: { item: SavedPost }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text
        onPress={() =>
          router.push({
            pathname: "/posts/[id]",
            params: { id: item.id },
          })
        }
        style={styles.cardTitle}
      >
        {item.title}
      </Text>
      <Text style={styles.cardAuthor}>bởi {item.author}</Text>
    </View>
    <TouchableOpacity style={styles.bookmarkButton}>
      <Ionicons name="bookmark" size={24} color="#3b82f6" />
    </TouchableOpacity>
  </View>
);

export default function SavedPostsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={SAVED_POSTS}
        renderItem={({ item }) => <SavedPostCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bạn chưa lưu bài viết nào.</Text>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
  cardImage: { width: 70, height: 70, borderRadius: 8 },
  cardContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardAuthor: { fontSize: 14, color: "gray", marginTop: 4 },
  bookmarkButton: { padding: 10 },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
});
