import { createArticle } from "@/apis/articles.api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
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

export default function CreatePostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: any) => createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      router.back();
    },
    onError: (err: any) => {
      Alert.alert("Lỗi", String(err?.message ?? err));
    },
  });

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
      // SDK >= 49 returns result.assets
      // @ts-ignore
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImageUri(uri);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return Alert.alert("Lỗi", "Tiêu đề rỗng");
    if (imageUri) {
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      // @ts-ignore React Native FormData file
      form.append("cover", { uri: imageUri, name: `photo.jpg`, type: `image/jpeg` });
      createMutation.mutate(form);
    } else {
      createMutation.mutate({ title, content });
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
            <TouchableOpacity style={styles.publishButton} onPress={handleSubmit}>
              <Text style={styles.publishButtonText}>Đăng bài</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={40} color="#ccc" />
              <Text style={styles.imagePickerText}>Thêm ảnh bìa</Text>
            </>
          )}
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
    borderWidth: 2,
    borderColor: "#eee",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePickerText: {
    marginTop: 10,
    color: "#aaa",
    fontSize: 16,
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
    textAlignVertical: "top", // For Android
    minHeight: 300,
  },
});