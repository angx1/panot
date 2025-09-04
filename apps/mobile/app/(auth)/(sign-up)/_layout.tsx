import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="withPhone" />
      <Stack.Screen
        name="pickCountryCode"
        options={{
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="verifyPhoneNumber"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="completeProfile"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}
