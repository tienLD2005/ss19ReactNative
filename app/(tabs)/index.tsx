import { getAllArticles } from "@/apis/articles.api";
import { getAllCategories } from "@/apis/categories.api";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  id: string;
  name: string;
  icon?: string;
};

type LatestPost = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  image: string;
  date: string;
};
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
        <TouchableOpacity key={category.id} style={styles.categoryCard}>
          <Ionicons name={(category.icon || "folder-outline") as any} size={24} color="#007AFF" />
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

// --- MÀN HÌNH CHÍNH ---

export default function HomeScreen() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesResponse, categoriesResponse] = await Promise.all([
          getAllArticles(),
          getAllCategories()
        ]);

        setArticles(articlesResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform articles data for different sections
  const featuredPosts: FeaturedPost[] = articles.slice(0, 3).map(article => ({
    id: String(article.id), // Convert number to string for navigation
    title: article.title,
    author: article.author?.name || 'Unknown Author',
    image: article.image || 'https://via.placeholder.com/300x200'
  }));

  const latestPosts: LatestPost[] = articles.slice(3, 8).map(article => ({
    id: String(article.id), // Convert number to string for navigation
    title: article.title,
    author: article.author?.name || 'Unknown Author',
    authorAvatar: article.author?.avatar || 'https://i.pravatar.cc/150?u=default',
    image: article.image || 'https://via.placeholder.com/300x200',
    date: new Date(article.createdAt).toLocaleDateString('vi-VN')
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <FeaturedCarousel posts={featuredPosts} />
        <CategoryList categories={categories} />
        <LatestPosts posts={latestPosts} />
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

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
