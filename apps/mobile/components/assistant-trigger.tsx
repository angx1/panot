import React, { useState } from "react";
import { View, Pressable, Modal, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GenerationsScreen from "../app/(tabs)/generations";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_TOP_MARGIN = 40;

export default function AssistantTrigger() {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setModalVisible] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  const handlePress = () => {
    setModalVisible(true);
    translateY.value = SCREEN_HEIGHT;
    translateY.value = withSpring(0, { mass: 1, damping: 83, stiffness: 140 });
  };

  const closeModalJS = () => {
    setModalVisible(false);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, context.value.y + event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 200) {
        translateY.value = withSpring(
          SCREEN_HEIGHT,
          { mass: 1, damping: 83, stiffness: 300 },
          (isFinished) => {
            if (isFinished) {
              runOnJS(closeModalJS)();
            }
          }
        );
      } else {
        translateY.value = withSpring(0, {
          mass: 1,
          damping: 83,
          stiffness: 200,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleRequestClose = () => {
    translateY.value = withSpring(
      SCREEN_HEIGHT,
      { mass: 1, damping: 83, stiffness: 300 },
      (isFinished) => {
        if (isFinished) {
          runOnJS(closeModalJS)();
        }
      }
    );
  };

  return (
    <>
      <View
        className="absolute rounded-2xl h-[55px] w-[15%] justify-center overflow-hidden"
        style={{
          bottom: insets.bottom + 10,
          left: 30,
        }}
      >
        <View className="flex-1 items-center justify-center bg-black">
          <Pressable
            onPress={handlePress}
            className="flex-1 w-full items-center justify-center"
          >
            <Ionicons name="ellipse-outline" size={24} color="#FFF" />
          </Pressable>
        </View>
      </View>

      {isModalVisible && (
        <Modal
          animationType="none"
          transparent={true}
          visible={true}
          onRequestClose={handleRequestClose}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Animated.View
              pointerEvents="auto"
              style={[{ marginTop: MODAL_TOP_MARGIN, flex: 1 }, animatedStyle]}
              className="bg-white rounded-t-2xl"
            >
              <GestureDetector gesture={panGesture}>
                <View className="absolute top-0 left-0 right-0 items-center py-10 z-40">
                  <View className="w-8 h-[5px] bg-gray-400 rounded-full" />
                </View>
              </GestureDetector>

              <View className="flex-1">
                <GenerationsScreen />
              </View>
            </Animated.View>
          </GestureHandlerRootView>
        </Modal>
      )}
    </>
  );
}
