import { getArticleById, updateArticle } from "@/apis/articles.api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// fallback data while loading
const EXISTING_POST = {
  title: "",
  content: "",
  image: "",
};

export default function EditPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = (params as any)?.postId ?? (params as any)?.id ?? "";

  const { data: articleData, isLoading } = useQuery({
    queryKey: ["article", id],
    enabled: !!id,
    queryFn: () => getArticleById(id),
  });

  // State được khởi tạo với dữ liệu có sẵn
  const [title, setTitle] = useState(EXISTING_POST.title);
  const [content, setContent] = useState(EXISTING_POST.content);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateArticle(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      router.back();
    },
    onError: (err: any) => {
      Alert.alert("Lỗi", String(err?.message ?? err));
    },
  });

  // Khi articleData có giá trị load về thì populate state
  React.useEffect(() => {
    if (articleData) {
      // có thể API trả { data: {...} }
      const payload = articleData.data ?? articleData;
      setTitle(payload.title ?? "");
      setContent(payload.content ?? "");
      setImageUri(payload.coverUrl ?? payload.image ?? null);
    }
  }, [articleData]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Quyền bị từ chối", "Cần quyền truy cập ảnh để chọn ảnh bìa");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      // @ts-ignore
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImageUri(uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.publishButton}
              onPress={() => {
                if (!title.trim()) return Alert.alert("Lỗi", "Tiêu đề rỗng");
                if (!id) return Alert.alert("Lỗi", "Không có id bài viết");
                if (imageUri) {
                  const form = new FormData();
                  form.append("title", title);
                  form.append("content", content);
                  // @ts-ignore
                  form.append("cover", { uri: imageUri, name: `photo.jpg`, type: `image/jpeg` });
                  updateMutation.mutate({ id, data: form });
                } else {
                  updateMutation.mutate({ id, data: { title, content } });
                }
              }}
            >
              <Text style={styles.publishButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.imagePicker}>
          {/* Hiển thị ảnh bìa có sẵn */}
          <Image
            source={{ uri: EXISTING_POST.image }}
            style={styles.coverImage}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.titleInput}
          placeholder="Tiêu đề bài viết..."
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Nội dung của bạn..."
          placeholderTextColor="#aaa"
          value={content}
          onChangeText={setContent}
          multiline
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContainer: { padding: 20 },
  publishButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: "#f5f5f5",
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden", // Quan trọng để ảnh không tràn ra ngoài
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingBottom: 10,
  },
  contentInput: {
    fontSize: 18,
    lineHeight: 28,
    textAlignVertical: "top",
    minHeight: 300,
  },
});