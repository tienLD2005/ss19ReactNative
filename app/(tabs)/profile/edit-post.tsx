import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
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

// Dữ liệu giả cho bài viết đang chỉnh sửa
const EXISTING_POST = {
  title: "10 Mẹo hay để tối ưu hiệu năng React Native",
  content:
    "Nội dung chi tiết của bài viết... Lập trình React Native đòi hỏi sự chú ý đến từng chi tiết nhỏ để đảm bảo ứng dụng không chỉ hoạt động đúng mà còn mượt mà.",
  image:
    "https://images.unsplash.com/photo-1607703703520-bb2a8e3523f4?q=80&w=2070&auto=format&fit=crop",
};

export default function EditPostScreen() {
  const router = useRouter();
  // State được khởi tạo với dữ liệu có sẵn
  const [title, setTitle] = useState(EXISTING_POST.title);
  const [content, setContent] = useState(EXISTING_POST.content);

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
              onPress={() =>
                Alert.alert("Cập nhật", "Bài viết của bạn đã được cập nhật.")
              }
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
