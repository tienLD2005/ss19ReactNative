import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
                Alert.alert("Đăng bài", "Bài viết của bạn đã được đăng.")
              }
            >
              <Text style={styles.publishButtonText}>Đăng bài</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.imagePicker}>
          <Ionicons name="camera-outline" size={40} color="#ccc" />
          <Text style={styles.imagePickerText}>Thêm ảnh bìa</Text>
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
