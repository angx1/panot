import { Stack } from "expo-router";
import "@/global.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { useAuth } from "@/components/providers/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
