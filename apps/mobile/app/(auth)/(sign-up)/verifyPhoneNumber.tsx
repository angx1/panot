import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

export default function VerifyPhoneNumberScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, idx: number) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text.slice(-1);
      setCode(newCode);

      if (text && idx < 5) {
        inputs.current[idx + 1]?.focus();
      }
      if (!text && idx > 0) {
        inputs.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = (event: any) => {
    const pasted = event.nativeEvent.text;
    if (/^\d{6}$/.test(pasted)) {
      setCode(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    // TODO: Implement resend logic
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ backgroundColor: "white" }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 px-6 pt-10">
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            Enter verification code
          </Text>
          <Text className="text-base text-gray-600 leading-6 mb-10">
            We&apos;ve sent a 6-digit code to your phone number.
          </Text>

          <View className="flex-row justify-between mb-8">
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => {
                  inputs.current[idx] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, idx)}
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === "Backspace" &&
                    !code[idx] &&
                    idx > 0
                  ) {
                    inputs.current[idx - 1]?.focus();
                  }
                }}
                onSubmitEditing={() => {
                  if (idx < 5) inputs.current[idx + 1]?.focus();
                }}
                keyboardType="number-pad"
                maxLength={1}
                returnKeyType="default"
                style={{
                  width: 48,
                  height: 56,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: "#E5E7EB",
                  backgroundColor: "#F9FAFB",
                  textAlign: "center",
                  fontSize: 28,
                  fontWeight: "600",
                  color: "#111827",
                }}
                className="mx-1"
                autoFocus={idx === 0}
                textContentType="oneTimeCode"
                importantForAutofill="yes"
                selectTextOnFocus
                onChange={({ nativeEvent }) => {
                  if (nativeEvent.text && nativeEvent.text.length > 1) {
                    handlePaste(nativeEvent);
                  }
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            className="w-full bg-gray-900 rounded-xl py-4 mb-4 active:bg-gray-800"
            style={{
              opacity: code.every((d) => d.length === 1) ? 1 : 0.5,
            }}
            disabled={!code.every((d) => d.length === 1)}
            // TODO: Add onPress to verify code
          >
            <Text className="text-center text-white text-lg font-semibold">
              Verify
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-2">
            <Text className="text-gray-600">Didn&apos;t get the code? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-gray-900 font-medium underline">
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
