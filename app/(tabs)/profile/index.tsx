import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuItemProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  name: string;
  onPress: () => void;
};

const MenuItem = ({ icon, name, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#555" />
    <Text style={styles.menuText}>{name}</Text>
    <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=a1" }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Nguyễn Văn A</Text>
          <Text style={styles.userBio}>React Native Developer</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/profile/edit-profile")}
          >
            <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem
            icon="create-outline"
            name="Bài viết của tôi"
            onPress={() => router.push("/profile/my-posts")}
          />
          <MenuItem
            icon="bookmark-outline"
            name="Bài viết đã lưu"
            onPress={() => router.push("/profile/saved-posts")}
          />
        </View>

        <View style={styles.menuContainer}>
          <MenuItem icon="settings-outline" name="Cài đặt" onPress={() => {}} />
          <MenuItem
            icon="help-circle-outline"
            name="Hỗ trợ"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  userBio: { fontSize: 16, color: "gray", marginTop: 5 },
  editButton: {
    marginTop: 15,
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: { fontWeight: "600" },
  menuContainer: { marginTop: 10, backgroundColor: "white" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16 },
  logoutButton: {
    backgroundColor: "white",
    marginTop: 20,
    padding: 15,
    alignItems: "center",
  },
  logoutText: { color: "red", fontSize: 16, fontWeight: "600" },
});
