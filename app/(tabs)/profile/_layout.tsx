import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="my-posts" options={{ title: "Bài viết của tôi" }} />
      <Stack.Screen name="saved-posts" options={{ title: "Bài viết đã lưu" }} />
      <Stack.Screen
        name="edit-profile"
        options={{ title: "Chỉnh sửa hồ sơ", presentation: "modal" }}
      />
      <Stack.Screen
        name="create-post"
        options={{ title: "Tạo bài viết mới", presentation: "modal" }}
      />
      <Stack.Screen
        name="edit-post"
        options={{ title: "Chỉnh sửa bài viết", presentation: "modal" }}
      />
    </Stack>
  );
}
