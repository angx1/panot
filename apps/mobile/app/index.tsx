import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import { View, Text, Pressable } from "react-native";
import { Session } from "@supabase/supabase-js";
import { signOutAction } from "@/lib/helpers";
import { Redirect } from "expo-router";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <>
      {session ? (
        <View className="flex-1 justify-center items-center">
          <Text>Hello, {session.user.email}!</Text>
          <Pressable
            className="border rounded-3xl items-center p-3 w-[30%] self-center m-10"
            onPress={signOutAction}
          >
            <Text className="text-base">Sign Out</Text>
          </Pressable>
        </View>
      ) : (
        // <Auth /> // redirect to (auth) log-in
        <Redirect href="/(auth)/auth" />
      )}
    </>
  );
}
