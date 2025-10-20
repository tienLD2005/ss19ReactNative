import { getArticles } from "@/apis/articles.api";
import { getArticlesCategory } from "@/apis/articlesCategory.api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import React from "react";
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

// Types cho dữ liệu từ API
type Article = {
  id: string | number;
  title: string;
  content?: string;
  thumbnail?: string;
  user?: {
    id: number;
    fullName: string;
    avatar?: string;
  };
  createdAt?: string;
  likesCount?: number;
};

type Category = {
  id: string | number;
  name: string;
  icon?: string;
};

const { width: screenWidth } = Dimensions.get("window");

// Các icon mặc định cho danh mục
const DEFAULT_CATEGORY_ICONS: any = {
  "React Native": "logo-react",
  "UI/UX": "color-palette-outline",
  "JavaScript": "logo-javascript",
  "Performance": "flash-outline",
  "TypeScript": "logo-javascript",
  "Backend": "server-outline",
  "Frontend": "desktop-outline",
};

// Carousel cho các bài viết nổi bật
const FeaturedCarousel = ({ posts }: { posts: Article[] }) => {
  const router = useRouter();

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nổi bật</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carouselContainer}
      >
        {posts.slice(0, 5).map((post) => (
          <TouchableOpacity
            key={post.id}
            onPress={() => router.push(`/posts/${post.id}`)}
          >
            <ImageBackground
              source={{
                uri: post.thumbnail || "https://via.placeholder.com/400x200?text=No+Image"
              }}
              style={styles.featuredCard}
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {post.title}
                </Text>
                <Text style={styles.featuredAuthor}>
                  bởi {post.user?.fullName || "Ẩn danh"}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Danh sách ngang cho các danh mục
const CategoryList = ({ categories }: { categories: Category[] }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Danh mục</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => {
          const iconName = category.icon || DEFAULT_CATEGORY_ICONS[category.name] || "bookmark-outline";
          return (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Ionicons name={iconName as any} size={24} color="#007AFF" />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Danh sách dọc cho các bài viết mới nhất
const LatestPosts = ({ posts }: { posts: Article[] }) => {
  const router = useRouter();

  if (!posts || posts.length === 0) {
    return null;
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mới nhất</Text>
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.latestPostItem}
          onPress={() => router.push(`/posts/${post.id}`)}
        >
          <Image
            source={{
              uri: post.thumbnail || "https://via.placeholder.com/100?text=No+Image"
            }}
            style={styles.latestPostImage}
          />
          <View style={styles.latestPostContent}>
            <Text style={styles.latestPostTitle} numberOfLines={2}>
              {post.title}
            </Text>
            <View style={styles.latestPostMeta}>
              <Image
                source={{
                  uri: post.user?.avatar || "https://via.placeholder.com/40?text=User"
                }}
                style={styles.latestPostAvatar}
              />
              <Text style={styles.latestPostAuthor}>
                {post.user?.fullName || "Ẩn danh"}
              </Text>
              <Text style={styles.latestPostDate}>
                • {formatDate(post.createdAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// --- MÀN HÌNH CHÍNH ---

export default function HomeScreen() {
  // Gọi API để lấy danh sách bài viết
  const {
    data: rawArticles,
    isLoading: articlesLoading,
    isError: articlesError,
    error: articlesErrorObj,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  // Gọi API để lấy danh sách danh mục
  const {
    data: rawCategories,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["articlesCategory"],
    queryFn: getArticlesCategory,
  });

  // Chuẩn hoá dữ liệu articles thành mảng
  const articles = React.useMemo(() => {
    if (!rawArticles) return [];
    if (Array.isArray(rawArticles)) return rawArticles;
    if (Array.isArray(rawArticles.data)) return rawArticles.data;
    if (Array.isArray(rawArticles.items)) return rawArticles.items;
    return [];
  }, [rawArticles]);

  // Chuẩn hoá dữ liệu categories thành mảng
  const categories = React.useMemo(() => {
    if (!rawCategories) return [];
    if (Array.isArray(rawCategories)) return rawCategories;
    if (Array.isArray(rawCategories.data)) return rawCategories.data;
    if (Array.isArray(rawCategories.items)) return rawCategories.items;
    return [];
  }, [rawCategories]);

  // Loading state
  if (articlesLoading || categoriesLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (articlesError) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Ionicons name="alert-circle-outline" size={64} color="#e53e3e" />
        <Text style={styles.errorTitle}>Không thể tải dữ liệu</Text>
        <Text style={styles.errorMessage}>
          {String((articlesErrorObj as any)?.message || articlesErrorObj)}
        </Text>
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
        <FeaturedCarousel posts={articles} />
        <CategoryList categories={categories} />
        <LatestPosts posts={articles.slice(5, 10)} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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

  // Loading & Error States
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666"
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },

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