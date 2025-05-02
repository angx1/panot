import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return <View className="w-full" />;
  }

  if (!session || !session.user) {
    return <Redirect href="/sign-in" />;
  }
  // contentContainerStyle={{ flexGrow: 1 }}
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View>
        <View className="w-full flex-1 justify-center items-center">
          <Text>Hello, {session.user.email}</Text>
        </View>
      </View>
    </View>
  );
}
