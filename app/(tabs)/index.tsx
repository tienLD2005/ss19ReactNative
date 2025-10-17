import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FeaturedPost = {
  id: string;
  title: string;
  author: string;
  image: string;
};

type Category = {
  name: string;
  icon: string;
};

type LatestPost = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  image: string;
  date: string;
};

// --- DỮ LIỆU FIX CỨNG ---
const FEATURED_POSTS: FeaturedPost[] = [
  {
    id: "1",
    title: "10 Mẹo hay để tối ưu hiệu năng React Native",
    author: "Ngọ Văn Quý",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1z3WO2y5h7YkHljxIsvwuOxP21OE_8tnedA&s",
  },
  {
    id: "2",
    title: "Xây dựng UI/UX đẹp mắt với Expo Router",
    author: "Ngọ Văn Quý",
    image:
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/10/tai-anh-phong-canh-dep-thump.jpg",
  },
  {
    id: "3",
    title: "Quản lý State hiệu quả trong ứng dụng lớn",
    author: "Ngọ Văn Quý",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop",
  },
];

const CATEGORIES: Category[] = [
  { name: "React Native", icon: "logo-react" },
  { name: "UI/UX", icon: "color-palette-outline" },
  { name: "JavaScript", icon: "logo-javascript" },
  { name: "Performance", icon: "flash-outline" },
];

const LATEST_POSTS: LatestPost[] = [
  {
    id: "4",
    title: "So sánh Redux Toolkit và TanStack Query",
    author: "Ngọ Văn Quý",
    authorAvatar: "https://i.pravatar.cc/150?u=a1",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    date: "15 Th10, 2025",
  },
  {
    id: "5",
    title: "Kỹ thuật lazy loading trong React Native",
    author: "Ngọ Văn Quý",
    authorAvatar: "https://i.pravatar.cc/150?u=a2",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    date: "14 Th10, 2025",
  },
];

const { width: screenWidth } = Dimensions.get("window");

// Carousel cho các bài viết nổi bật
const FeaturedCarousel = ({ posts }: { posts: FeaturedPost[] }) => {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nổi bật</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carouselContainer}
      >
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            onPress={() => router.push(`/posts/${post.id}`)}
          >
            <ImageBackground
              source={{ uri: post.image }}
              style={styles.featuredCard}
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{post.title}</Text>
                <Text style={styles.featuredAuthor}>bởi {post.author}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Danh sách ngang cho các danh mục
const CategoryList = ({ categories }: { categories: Category[] }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Danh mục</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((category) => (
        <TouchableOpacity key={category.name} style={styles.categoryCard}>
          <Ionicons name={category.icon as any} size={24} color="#007AFF" />
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

// Danh sách dọc cho các bài viết mới nhất
const LatestPosts = ({ posts }: { posts: LatestPost[] }) => {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mới nhất</Text>
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.latestPostItem}
          onPress={() => router.push(`/posts/${post.id}`)}
        >
          <Image source={{ uri: post.image }} style={styles.latestPostImage} />
          <View style={styles.latestPostContent}>
            <Text style={styles.latestPostTitle} numberOfLines={2}>
              {post.title}
            </Text>
            <View style={styles.latestPostMeta}>
              <Image
                source={{ uri: post.authorAvatar }}
                style={styles.latestPostAvatar}
              />
              <Text style={styles.latestPostAuthor}>{post.author}</Text>
              <Text style={styles.latestPostDate}>• {post.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// --- MÀN HÌNH CHÍNH ---z

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Khám phá</Text>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
        <FeaturedCarousel posts={FEATURED_POSTS} />
        <CategoryList categories={CATEGORIES} />
        <LatestPosts posts={LATEST_POSTS} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold" },
  section: { marginTop: 20, paddingLeft: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },

  // Featured Carousel
  carouselContainer: { paddingRight: 20 },
  featuredCard: {
    width: screenWidth * 0.75,
    height: 200,
    marginRight: 15,
    justifyContent: "flex-end",
  },
  featuredOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  featuredTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  featuredAuthor: { fontSize: 14, color: "#eee", marginTop: 4 },

  // Category List
  categoryCard: {
    backgroundColor: "#f0f2f5",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginRight: 10,
    width: 120,
  },
  categoryText: { fontWeight: "600", marginTop: 8 },

  // Latest Posts
  latestPostItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 20,
  },
  latestPostImage: { width: 100, height: 100, borderRadius: 10 },
  latestPostContent: { flex: 1, marginLeft: 15 },
  latestPostTitle: { fontSize: 16, fontWeight: "bold" },
  latestPostMeta: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  latestPostAvatar: { width: 20, height: 20, borderRadius: 10 },
  latestPostAuthor: { marginLeft: 8, fontSize: 12, color: "gray" },
  latestPostDate: { marginLeft: 8, fontSize: 12, color: "gray" },
});
