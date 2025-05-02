import React, { useState, useEffect } from "react"; // Import useEffect
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ActionBarProps {
  actionsVisible: boolean;
  onActionsVisibleChange?: (isVisible: boolean) => void;
}

export default function ActionBar({
  actionsVisible: parentActionsVisible,
  onActionsVisibleChange,
}: ActionBarProps) {
  const insets = useSafeAreaInsets();

  const [internalActionsVisible, setInternalActionsVisible] = useState(false);
  const buttonWidth = useSharedValue("46%");
  const buttonBgColor = useSharedValue("rgb(0, 0, 0)");
  const rotateIcon = useSharedValue(0);
  const tripTranslateY = useSharedValue(50);
  const noteTranslateY = useSharedValue(50);
  const actionsOpacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle<any>(() => {
    return {
      width: buttonWidth.value,
      backgroundColor: buttonBgColor.value,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateIcon.value}deg` }],
    };
  });

  const tripAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tripTranslateY.value }],
      opacity: actionsOpacity.value,
    };
  });

  const noteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: noteTranslateY.value }],
      opacity: actionsOpacity.value,
    };
  });

  const springConfig = {
    damping: 12,
    stiffness: 170,
    mass: 0.5,
  };

  const openActionsAnimation = () => {
    buttonWidth.value = withSpring("16%", springConfig);
    buttonBgColor.value = withTiming("rgb(221, 221, 221)", { duration: 200 });
    rotateIcon.value = withSpring(45, springConfig);
    actionsOpacity.value = withTiming(1, { duration: 200 });
    tripTranslateY.value = withSpring(0, springConfig);
    noteTranslateY.value = withSpring(0, { ...springConfig });
  };

  const closeActionsAnimation = () => {
    buttonWidth.value = withSpring("46%", springConfig);
    buttonBgColor.value = withTiming("rgb(0, 0, 0)", { duration: 200 });
    rotateIcon.value = withSpring(0, springConfig);
    actionsOpacity.value = withTiming(0, { duration: 200 });
    tripTranslateY.value = withSpring(100, springConfig);
    noteTranslateY.value = withSpring(50, springConfig);
  };

  useEffect(() => {
    if (parentActionsVisible !== internalActionsVisible) {
      setInternalActionsVisible(parentActionsVisible);
      if (parentActionsVisible) {
        openActionsAnimation();
      } else {
        closeActionsAnimation();
      }
    }
  }, [parentActionsVisible]);

  const toggleActions = () => {
    const newVisibility = !internalActionsVisible;

    setInternalActionsVisible(newVisibility);

    if (onActionsVisibleChange) {
      onActionsVisibleChange(newVisibility);
    }

    if (newVisibility) {
      openActionsAnimation();
    } else {
      closeActionsAnimation();
    }
  };

  const handleAddTrip = () => {
    console.log("Add Trip Pressed");
    toggleActions();
  };

  const handleAddNote = () => {
    console.log("Add Note Pressed");
    toggleActions();
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-end"
      style={[{ paddingBottom: insets.bottom + 10, paddingRight: 20 }]}
      pointerEvents={internalActionsVisible ? "auto" : "box-none"}
    >
      <View
        className="absolute bottom-[140px] right-[20px] items-end gap-3 w-[46%]"
        pointerEvents={internalActionsVisible ? "auto" : "none"}
      >
        <Animated.View style={[tripAnimatedStyle, { width: "100%" }]}>
          <Pressable
            onPress={handleAddTrip}
            className="bg-black rounded-2xl px-4 w-full h-[55px] justify-center"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-base">Trip</Text>
              <MaterialIcons
                name="add-circle-outline"
                size={24}
                color="#FFFFFF"
              />
            </View>
          </Pressable>
        </Animated.View>
        <Animated.View style={[noteAnimatedStyle, { width: "100%" }]}>
          <Pressable
            onPress={handleAddNote}
            className="bg-black rounded-2xl px-4 w-full h-[55px] justify-center"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-base">Note</Text>
              <MaterialIcons name="note-add" size={24} color="#FFFFFF" />
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <Animated.View
        className="rounded-2xl h-[55px] justify-center overflow-hidden"
        style={animatedStyles}
        pointerEvents="auto"
      >
        <Pressable
          onPress={toggleActions}
          className="px-4 h-full justify-center"
        >
          <View className="flex-row items-center justify-between">
            {!internalActionsVisible && (
              <Text className="text-white font-bold text-base">Add</Text>
            )}
            <Animated.View
              style={iconAnimatedStyle}
              className="absolute right-0"
            >
              <Ionicons name="add-outline" size={27} color="#FFFFFF" />
            </Animated.View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
