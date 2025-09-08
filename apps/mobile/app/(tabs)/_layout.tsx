import { Tabs } from "expo-router";

export default function TabsLayout() {
  // La lógica de autenticación se maneja en index.tsx
  // Este layout solo se muestra cuando el usuario está autenticado
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    />
  );
}
