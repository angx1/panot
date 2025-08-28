import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@/components/providers/AuthProvider";

export default function TabsLayout() {
  const { session, isLoading } = useAuth();
  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/auth" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    />
  );
}
