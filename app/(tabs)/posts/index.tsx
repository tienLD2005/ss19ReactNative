import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const POSTS = [
  {
    id: "1",
    title: "10 Mẹo hay để tối ưu hiệu năng ứng dụng React Native",
    author: "Nguyễn Văn A",
    authorAvatar: "https://i.pravatar.cc/150?u=a1",
    image:
      "https://beitech.net/wp-content/uploads/2021/06/react-native-dung-de-lap-trinh-app1_opt.png",
    likes: 1250,
  },
  {
    id: "2",
    title: "Hướng dẫn xây dựng UI/UX đẹp mắt với Expo Router",
    author: "Lê Văn B",
    authorAvatar: "https://i.pravatar.cc/150?u=a2",
    image:
      "https://cdn.prod.website-files.com/687e8dc61ba884e5a78c6f60/689da954b61200eca29e687e_UI-va-UX.jpeg",
    likes: 890,
  },
];

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
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={POSTS}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
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
