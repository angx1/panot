import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type ButtonVariant = "primary" | "secondary" | "cancel" | "warning";

interface ButtonProps {
  text: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  variant?: ButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gap?: number;
  useHaptics?: boolean;
  hapticFeedbackType?: "light" | "medium" | "heavy" | "rigid" | "soft";
}

const Button: React.FC<ButtonProps> = ({
  text,
  rightIcon,
  variant = "primary",
  onPress,
  disabled = false,
  style,
  textStyle,
  gap = 12,
  useHaptics = true,
  hapticFeedbackType = "medium",
}) => {
  const getHapticImpactStyle = (
    feedbackType: "light" | "medium" | "heavy" | "rigid" | "soft"
  ): Haptics.ImpactFeedbackStyle => {
    switch (feedbackType) {
      case "light":
        return Haptics.ImpactFeedbackStyle.Light;
      case "medium":
        return Haptics.ImpactFeedbackStyle.Medium;
      case "heavy":
        return Haptics.ImpactFeedbackStyle.Heavy;
      case "rigid":
        return Haptics.ImpactFeedbackStyle.Rigid;
      case "soft":
        return Haptics.ImpactFeedbackStyle.Soft;
      default:
        return Haptics.ImpactFeedbackStyle.Medium;
    }
  };

  const handlePress = async () => {
    if (disabled) return;
    if (useHaptics) {
      try {
        const impactIntensity = getHapticImpactStyle(hapticFeedbackType);
        await Haptics.impactAsync(impactIntensity);
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
    }

    onPress();
  };

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          backgroundColor: disabled ? "#D1D5DB" : "#000000",
          shadowColor: disabled ? "transparent" : "#000",
          shadowOffset: disabled
            ? { width: 0, height: 0 }
            : { width: 0, height: 4 },
          shadowOpacity: disabled ? 0 : 0.25,
          shadowRadius: disabled ? 0 : 6,
          elevation: disabled ? 0 : 6,
        };

      case "secondary":
        return {
          ...baseStyles,
          backgroundColor: disabled ? "#F3F4F6" : "#F9FAFB",
          borderWidth: 1.5,
          borderColor: disabled ? "#E5E7EB" : "#D1D5DB",
        };

      case "cancel":
        return {
          ...baseStyles,
          backgroundColor: disabled ? "#FEF2F2" : "#FEE2E2",
          borderWidth: 1.5,
          borderColor: disabled ? "#FECACA" : "#F87171",
        };

      case "warning":
        return {
          ...baseStyles,
          backgroundColor: disabled ? "#FEF3C7" : "#FDE047",
          borderWidth: 1.5,
          borderColor: disabled ? "#FDE68A" : "#FACC15",
        };

      default:
        return baseStyles;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyles: TextStyle = {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseTextStyles,
          color: "#FFFFFF",
        };

      case "secondary":
        return {
          ...baseTextStyles,
          color: disabled ? "#9CA3AF" : "#374151",
        };

      case "cancel":
        return {
          ...baseTextStyles,
          color: disabled ? "#F87171" : "#DC2626",
        };

      case "warning":
        return {
          ...baseTextStyles,
          color: disabled ? "#D97706" : "#92400E",
        };

      default:
        return baseTextStyles;
    }
  };

  const getIconColor = (): string => {
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
        return disabled ? "#9CA3AF" : "#374151";
      case "cancel":
        return disabled ? "#F87171" : "#DC2626";
      case "warning":
        return disabled ? "#D97706" : "#92400E";
      default:
        return "#000000";
    }
  };

  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();
  const iconColor = getIconColor();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[buttonStyles, style]}
      activeOpacity={0.8}
      className="active:scale-95 transition-transform duration-150"
    >
      <View
        className="flex-row items-center justify-center"
        style={{ gap: gap }}
      >
        <Text style={[textStyles, textStyle]}>{text}</Text>
        {rightIcon && (
          <View>
            <Ionicons name={rightIcon} size={20} color={iconColor} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
