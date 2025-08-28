import * as AppleAuthentication from "expo-apple-authentication";
import { View, Text, Pressable } from "react-native";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { IOSAuth } from "@/components/auth/AuthNativeIOSButton";

interface AuthBottomSheetProps {
  bottomSheetStyle: "login" | "signup";
  sheetRef: React.RefObject<BottomSheet>;
  isOpen: boolean;
  onStateChange: (index: number) => void;
  buttonType: AppleAuthentication.AppleAuthenticationButtonType;
  buttonText: string;
  snapPoints: string[];
  alternativeAction: () => void;
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

export default function AuthBottomSheet({
  sheetRef,
  isOpen,
  onStateChange,
  buttonType,
  buttonText,
  snapPoints,
  alternativeAction,
}: AuthBottomSheetProps) {
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
      <BottomSheetView className="flex-1 p-9 items-center">
        <View className="w-full items-center">
          <IOSAuth buttonType={buttonType} sheetRef={sheetRef} />
          <View className="w-full mt-6 items-center">
            <Text
              className="text-center text-gray-500 mb-6 "
              style={{ textAlign: "center" }}
            >
              or <Text>continue with phone number</Text>
            </Text>
            <Pressable
              style={{ width: 300, height: 40 }}
              className="bg-gray-100 rounded-xl active:bg-gray-200 justify-center"
              onPress={alternativeAction}
            >
              <Text className="text-center font-medium text-xl">
                {buttonText}
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
