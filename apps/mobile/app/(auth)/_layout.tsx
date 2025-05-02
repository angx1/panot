import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          animation: "ios_from_left",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          animation: "ios_from_right",
        }}
      />
    </Stack>
  );
}
