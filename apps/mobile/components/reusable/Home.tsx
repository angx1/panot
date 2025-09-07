import React, { useEffect } from "react";
import { View, Text } from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const DEEP_ORANGE = "rgb(235,78,39)";
const SIZE = 60;

export default function Home() {
  const [loaded, error] = useFonts({
    Mersad: require("../../assets/fonts/Mersad-SemiBold.ttf"),
    Maria: require("../../assets/fonts/Maria.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <View className="flex-col gap-10 mx-10">
      <View className="flex-row items-center justify-center gap-5">
        <View
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            backgroundColor: DEEP_ORANGE,
          }}
        />
        <Text style={{ fontFamily: "Mersad", fontSize: 100, color: "#000" }}>
          panot
        </Text>
      </View>
      <Text style={{ fontFamily: "Maria", fontSize: 20, color: "#000" }}>
        Redefining your{" "}
        <Text style={{ color: "#aaa", fontFamily: "Maria" }}>
          personal interactions
        </Text>{" "}
      </Text>
    </View>
  );
}
