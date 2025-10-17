import { Stack } from "expo-router";

export default function PostsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Khám phá Bài viết" }} />
      <Stack.Screen name="[id]" options={{ title: "Chi tiết Bài viết" }} />
    </Stack>
  );
}
