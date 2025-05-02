import React from "react";
import { View, Image } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledImage = styled(Image);

interface AvatarProps {
  source: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ source, size = 50 }) => {
  return (
    <StyledView
      className="overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <StyledImage
        className="object-cover"
        style={{ width: size, height: size }}
      />
    </StyledView>
  );
};
