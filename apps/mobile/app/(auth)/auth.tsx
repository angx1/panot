import { useCallback, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import Orb from "@/components/reusable/Orb";
import Entypo from "@expo/vector-icons/Entypo";
import { IOSAuth } from "@/components/auth.native.ios";

export default function Auth() {
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = useRef(["35%"]).current;
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const handleOpenPress = useCallback(() => {
    sheetRef.current?.expand();
    setIsOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close();
    setIsOpen(false);
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <Pressable
        onPressOut={handleCloseSheet}
        className="flex-1 items-center justify-center bg-white"
      >
        <View className="mb-20">
          <Orb size={260} />
        </View>
        <View className="absolute bottom-16 flex-row gap-10">
          <Pressable
            className="rounded-xl py-5 px-6 flex-row items-center gap-8 active:scale-90 transition-transform duration-200"
            onPressOut={handleOpenPress}
          >
            <Text className="text-lg font-bold">Log in</Text>
            <Entypo name="chevron-right" size={20} color="black" />
          </Pressable>
          <Pressable
            className="bg-black rounded-2xl py-5 px-6 flex-row items-center gap-12 shadow-lg active:scale-90 transition-transform duration-200"
            onPressOut={handleOpenPress}
          >
            <Text className="text-lg font-bold text-white">Sign up</Text>
            <Entypo name="chevron-right" size={20} color="white" />
          </Pressable>
        </View>
      </Pressable>

      <BottomSheet
        ref={sheetRef}
        index={isOpen ? 0 : -1}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(i) => setIsOpen(i >= 0)}
        animationConfigs={animationConfigs}
        enableOverDrag
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 50,
          elevation: 5,
          borderRadius: 50,
        }}
      >
        <BottomSheetView className="flex-1 p-9 items-center">
          <View className="w-full items-center">
            <IOSAuth />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
