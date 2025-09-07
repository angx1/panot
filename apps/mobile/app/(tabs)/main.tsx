import { useAuth } from "@/components/providers/AuthProvider";
import { View, Text, Pressable, ScrollView } from "react-native";
import { signOutAction } from "@/lib/helpers";

import { useState } from "react";

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function MainScreen() {
  const { session } = useAuth();
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View>
        {!recognizing ? (
          <Pressable
            onPress={handleStart}
            className="bg-blue-500 px-4 py-2 rounded mb-2"
          >
            <Text className="text-white font-bold">Start</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => ExpoSpeechRecognitionModule.stop()}
            className="bg-red-500 px-4 py-2 rounded mb-2"
          >
            <Text className="text-white font-bold">Stop</Text>
          </Pressable>
        )}

        <ScrollView>
          <Text>{transcript}</Text>
        </ScrollView>
      </View>
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
