import { View, Keyboard, Text } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import React from "react";

interface BottomSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  isOpen: boolean;
  onStateChange: (index: number) => void;
  snapPoints: string[];
}

const bottomSheetStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 50,
  elevation: 5,
  borderRadius: 50,
};

export default function SignUpBottomSheet({
  sheetRef,
  isOpen,
  onStateChange,
  snapPoints,
}: BottomSheetProps) {
  return (
    <BottomSheet
      ref={sheetRef}
      index={isOpen ? 0 : -1}
      enableDynamicSizing={false}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={onStateChange}
      enableOverDrag
      style={bottomSheetStyle}
    >
      <BottomSheetView className="flex-1">
        <Text className="text-3xl font-bold text-center">Sign Up</Text>
        <BottomSheetTextInput
          className="mt-2 m-5 rounded-[10px] text-3xl leading-auto p-4 bg-[rgba(151,151,151,0.25)]"
          keyboardAppearance={"default"}
          keyboardType="number-pad"
        />
      </BottomSheetView>
    </BottomSheet>
  );
}
