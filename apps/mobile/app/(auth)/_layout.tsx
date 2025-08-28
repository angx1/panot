import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AuthLayout() {
  const { session, isLoading } = useAuth();
  if (isLoading) return null;
  if (session) return <Redirect href="/(tabs)/home" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
