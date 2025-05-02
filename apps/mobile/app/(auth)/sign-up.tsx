import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import { signUpAction } from "@/actions";
import { useRouter } from "expo-router";

export default function SignUp() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSignUp() {
    try {
      const { message, success } = await signUpAction({
        nombre,
        apellido,
        email,
        password,
      });

      if (success) {
        setMessage(message);
        Alert.alert("Success", message);
        router.replace("/sign-in");
      } else {
        setMessage(message);
        Alert.alert("Error", message);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  function handleSignIn() {
    router.replace("/sign-in");
  }

  return (
    <View className="flex-1 items-center">
      <View className="w-[80%] mb-5 mt-[100px]">
        <Text className="mb-2">name</Text>
        <TextInput
          className="p-4 border border-gray-300 rounded-md text-base w-full h-fit bg-transparent"
          onChangeText={setNombre}
          value={nombre}
          placeholder="your name"
          autoCapitalize="none"
        />
      </View>
      <View className="w-[80%] mb-5">
        <Text className="mb-2">surname</Text>
        <TextInput
          className="p-4 border border-gray-300 rounded-md text-base w-full h-fit bg-transparent"
          onChangeText={setApellido}
          value={apellido}
          placeholder="your surname"
          autoCapitalize="none"
        />
      </View>
      <View className="w-[80%] mb-5">
        <Text className="mb-2">email</Text>
        <TextInput
          className="p-4 border border-gray-300 rounded-md text-base w-full h-fit bg-transparent"
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>

      <View className="w-[80%] mb-5">
        <Text className="mb-2">password</Text>
        <TextInput
          className="p-4 border border-gray-300 rounded-md text-base w-full h-fit bg-transparent"
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
