import React from "react";
import { View } from "react-native";

type Props = { size?: number };

export default function Orb({ size = 24 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgb(235,78,39)",
      }}
    />
  );
}
