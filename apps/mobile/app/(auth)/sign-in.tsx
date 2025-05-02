import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { signInAction } from "@/actions";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    const { error, success } = await signInAction({ email, password });
    if (error) Alert.alert(error);
    if (success) {
      router.replace("/");
    }
  }

  function handleSignUp() {
    router.replace("/sign-up");
  }

  return (
    <View className="flex items-center w-full mt-[200px]">
      <View className="w-[80%]">
        <Text className="mb-2">email</Text>
        <TextInput
          className="p-4 border border-gray-300 rounded-md text-base w-full h-fit bg-transparent"
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>

      <View className="mt-5 w-[80%]">
        <Text className="mb-2">password</Text>
        <TextInput
          className="p-4 border border-gray-300 rounded-md text-base w-full h-fit"
          onChangeText={setPassword}
          value={password}
          placeholder="password"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      <View className="flex gap-3 items-center w-[80%] mt-8">
        <Pressable
          className="border bg-black rounded-3xl items-center p-3 w-full"
          onPress={handleSignIn}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="text-base text-white">Sign In</Text>
        </Pressable>
        <Pressable
          className="border rounded-3xl items-center p-3 w-full"
          onPress={handleSignUp}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="text-base">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
