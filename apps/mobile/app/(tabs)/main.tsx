import { useAuth } from "@/components/providers/AuthProvider";
import { View, Text, Pressable, ScrollView } from "react-native";
import { signOutAction } from "@/lib/helpers";

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useState } from "react";

export default function MainScreen() {
  const { session } = useAuth();
  console.log(session);

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
