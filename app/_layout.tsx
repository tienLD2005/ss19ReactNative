import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  // Layout gốc để quản lý các màn hình modal trong tương lai
  return <Stack screenOptions={{ headerShown: false }} />;
}
