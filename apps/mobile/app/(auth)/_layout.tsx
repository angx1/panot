import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/components/providers/AuthProvider";
import { CountryProvider } from "@/components/providers/CountryProvider";

export default function AuthLayout() {
  const { session, isLoading } = useAuth();
  if (isLoading) return null;
  if (session) return <Redirect href="/(tabs)/home" />;
  return (
    <CountryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen
          name="(sign-up)/withPhone"
          options={{
            presentation: "card",
          }}
        />

        <Stack.Screen
          name="(log-in)/withPhone"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </CountryProvider>
  );
}
