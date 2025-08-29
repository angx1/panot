import { View, Text, Pressable } from "react-native";

import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import React, { useState } from "react";

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
  const [callingCode, setCallingCode] = useState<string>("34");
  const [localNumber, setLocalNumber] = useState("");
  const [isCallingCodePickerVisible, setIsCallingCodePickerVisible] =
    useState(false);

  const handleSelectCallingCode = (code: string) => {
    setCallingCode(code);
    setIsCallingCodePickerVisible(false);
  };

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        index={isOpen ? 0 : -1}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableOverDrag
        style={bottomSheetStyle}
      >
        <BottomSheetView className="flex-1">
          <Text className="text-xl font-bold text-center mb-5">Sign Up</Text>
          <View className="flex-row gap-5 mx-5">
            <Pressable
              onPress={() => setIsCallingCodePickerVisible(false)}
              className="bg-[rgba(151,151,151,0.25)] rounded-[10px] p-3"
            >
              <Text>{callingCode}</Text>
            </Pressable>
            <BottomSheetTextInput
              className="flex-1 rounded-[10px] p-3 bg-[rgba(151,151,151,0.25)]"
              keyboardAppearance="default"
              keyboardType="phone-pad"
              placeholder="645 969 987"
              value={localNumber}
              onChangeText={setLocalNumber}
              autoComplete="tel"
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
