import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import ActionBar from "@/components/action-bar";
import AssistantTrigger from "@/components/assistant-trigger";

export default function BottomActions() {
  const [actionsVisible, setActionsVisible] = useState(false);
  const [showAssistanceTrigger, setShowAssistanceTrigger] = useState(true);
  const opacity = useSharedValue(1);

  const handleActionsVisibleChange = (isVisible: boolean) => {
    setActionsVisible(isVisible);
    setShowAssistanceTrigger(!isVisible);
  };

  const closeActions = () => {
    if (actionsVisible) {
      handleActionsVisibleChange(false);
    }
  };

  useEffect(() => {
    if (showAssistanceTrigger) {
      opacity.value = withTiming(1, { duration: 120 });
    } else {
      opacity.value = withTiming(0, { duration: 120 });
    }
  }, [showAssistanceTrigger]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <>
      {actionsVisible && (
        <Pressable
          style={[styles.backdrop, StyleSheet.absoluteFillObject]}
          onPress={closeActions}
          pointerEvents="auto"
        />
      )}

      <View style={{ zIndex: 2 }} pointerEvents="box-none">
        <ActionBar
          actionsVisible={actionsVisible}
          onActionsVisibleChange={handleActionsVisibleChange}
        />
      </View>

      <Animated.View
        style={[animatedStyle, { zIndex: 2 }]}
        pointerEvents={showAssistanceTrigger ? "auto" : "none"}
      >
        <AssistantTrigger />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    zIndex: 1,
  },
});
