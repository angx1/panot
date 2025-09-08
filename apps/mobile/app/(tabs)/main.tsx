import { useAuth } from "@/components/providers/AuthProvider";
import { View, Text, Pressable, ScrollView, Button } from "react-native";
import { signOutAction } from "@/lib/helpers";

export default function MainScreen() {
  const { session } = useAuth();

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Hello, {session?.user.email ?? "there"}!</Text>
      <Pressable
        className="border rounded-3xl items-center p-3 w-[30%] self-center m-10"
        onPress={signOutAction}
      >
        <Text className="text-base">Sign Out</Text>
      </Pressable>
    </View>
  );
}
