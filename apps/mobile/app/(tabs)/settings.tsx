import { View, Text, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Redirect, useLocalSearchParams } from "expo-router";
import { signOutAction } from "@/actions";
// Quita la importación de SafeAreaView si ya no se usa en otro lugar del archivo
// import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen({ session }: { session: Session }) {
  useEffect(() => {
    if (!session) {
      return () => {
        <Redirect href="/sign-in" />;
      };
    }
  }, [session]);

  async function handleSignOut() {
    const { error } = await signOutAction();
    if (error) Alert.alert(error);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View className="flex-1 justify-center items-center">
        <View>
          <Text className="text-center">{session?.user.id}</Text>
        </View>

        <Pressable
          className="border rounded-3xl items-center p-3 w-[30%] self-center"
          onPress={handleSignOut}
        >
          <Text className="text-base">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
