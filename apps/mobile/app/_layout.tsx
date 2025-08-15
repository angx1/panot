import { Stack } from "expo-router";
import "@/global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    />
  );
}
