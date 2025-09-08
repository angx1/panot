import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/components/providers/AuthProvider";
import { CountryProvider } from "@/components/providers/CountryProvider";

export default function AuthLayout() {
  const { session, isLoading } = useAuth();
  if (isLoading) return null;
  if (session) return <Redirect href="/(tabs)/main" />;
  return (
    <CountryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(sign-up)"
          options={{
            presentation: "transparentModal",
            gestureEnabled: true,
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
