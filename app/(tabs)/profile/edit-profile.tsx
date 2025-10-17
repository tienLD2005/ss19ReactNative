import { Stack } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type InputFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
};

const InputField = ({
  label,
  value,
  placeholder,
  onChangeText,
}: InputFieldProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  </View>
);

export default function EditProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Chỉnh sửa hồ sơ" }} />
      <ScrollView>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=a1" }}
            style={styles.avatar}
          />
          <TouchableOpacity>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <InputField
            label="Tên hiển thị"
            value="Ngọ Văn Quý"
            placeholder="Nhập tên của bạn"
          />
          <InputField
            label="Tên người dùng"
            value="ngovanquy"
            placeholder="@username"
          />
          <InputField
            label="Tiểu sử"
            value="React Native Developer & Blogger"
            placeholder="Giới thiệu về bạn"
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  avatarContainer: { alignItems: "center", marginVertical: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  changeAvatarText: { color: "#3b82f6", fontWeight: "600", marginTop: 10 },
  form: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", color: "gray", marginBottom: 5 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    margin: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
