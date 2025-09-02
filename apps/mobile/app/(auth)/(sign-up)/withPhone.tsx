import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCountry } from "@/components/providers/CountryProvider";
import { phone } from "phone";

const DEFAULT_COUNTRY = {
  cca2: "ES",
  name: { common: "Spain" },
  callingCode: "+34",
  flag: "🇪🇸",
};

interface PhoneValidationResult {
  isValid: boolean;
  phoneNumber: string | null;
  countryIso2: string | null;
  countryIso3: string | null;
  countryCode: string | null;
  formattedNumber?: string;
  errorMessage?: string;
}

export default function SignUpScreen() {
  const { selectedCountry, setSelectedCountry } = useCountry();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationResult, setValidationResult] =
    useState<PhoneValidationResult>({
      isValid: false,
      phoneNumber: null,
      countryIso2: null,
      countryIso3: null,
      countryCode: null,
    });
  const [isValidating, setIsValidating] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Set Spain as default country on mount if not already set
  useEffect(() => {
    if (
      !selectedCountry ||
      !selectedCountry.callingCode ||
      selectedCountry.callingCode !== DEFAULT_COUNTRY.callingCode
    ) {
      setSelectedCountry?.(DEFAULT_COUNTRY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleCountrySelect = () => {
    router.push("/(auth)/(sign-up)/pickCountryCode");
  };

  const validatePhoneNumber = (input: string, countryCode?: string) => {
    if (!input || input.trim().length === 0) {
      return {
        isValid: false,
        phoneNumber: null,
        countryIso2: null,
        countryIso3: null,
        countryCode: null,
        errorMessage: "Please enter a phone number",
      };
    }

    try {
      // If country is selected, use it for validation
      if (countryCode) {
        const result = phone(input, { country: countryCode });
        return {
          ...result,
          formattedNumber: result.isValid ? result.phoneNumber : undefined,
          errorMessage: result.isValid
            ? undefined
            : "Invalid phone number for selected country",
        };
      } else {
        // Try to detect country from phone number
        const result = phone(input);
        return {
          ...result,
          formattedNumber: result.isValid ? result.phoneNumber : undefined,
          errorMessage: result.isValid
            ? undefined
            : "Invalid phone number format",
        };
      }
    } catch (error) {
      return {
        isValid: false,
        phoneNumber: null,
        countryIso2: null,
        countryIso3: null,
        countryCode: null,
        errorMessage: "Error validating phone number",
      };
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    // Clean the input to only allow digits
    const cleaned = text.replace(/\D/g, "");
    setPhoneNumber(cleaned);

    // Validate in real-time with debouncing
    setIsValidating(true);
    setTimeout(() => {
      const validation = validatePhoneNumber(cleaned, selectedCountry?.cca2);
      setValidationResult(validation);
      setIsValidating(false);
    }, 300);
  };

  const handleContinue = () => {
    if (!validationResult.isValid || !validationResult.phoneNumber) {
      return;
    }

    // Use the validated and formatted phone number
    const finalPhoneNumber = validationResult.phoneNumber;

    // TODO: Navigate to OTP verification page with the validated phone number
    console.log("Validated phone number:", finalPhoneNumber);
    // router.push('/(auth)/(sign-up)/verifyOTP');
  };

  const getValidationMessage = () => {
    if (isValidating) {
      return "Validating...";
    }

    if (validationResult.errorMessage) {
      return validationResult.errorMessage;
    }

    if (validationResult.isValid && validationResult.formattedNumber) {
      return `✓ Valid: ${validationResult.formattedNumber}`;
    }

    return "";
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <Ionicons name="time" size={16} color="#6B7280" />;
    }

    if (validationResult.isValid) {
      return <Ionicons name="checkmark-circle" size={16} color="#10B981" />;
    }

    if (validationResult.errorMessage) {
      return <Ionicons name="alert-circle" size={16} color="#EF4444" />;
    }

    return null;
  };

  const isPhoneValid = validationResult.isValid && validationResult.phoneNumber;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            Enter your phone number
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            We&apos;ll send you a verification code to verify your phone number
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Phone Number
          </Text>

          <View className="flex-row items-center border border-gray-200 rounded-xl overflow-hidden">
            <TouchableOpacity
              onPress={handleCountrySelect}
              className="flex-row items-center px-4 py-4 border-r border-gray-200 bg-white active:bg-gray-50"
            >
              <View>
                <Text className="text-base font-medium text-gray-900">
                  {selectedCountry?.callingCode || DEFAULT_COUNTRY.callingCode}
                </Text>
                <Text className="text-xs text-gray-500">
                  {selectedCountry?.name?.common || DEFAULT_COUNTRY.name.common}
                </Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#6B7280"
                style={{ marginLeft: 12 }}
              />
            </TouchableOpacity>
            <View className="flex-1 pr-4">
              <TextInput
                className="flex-1 px-4 py-4 text-xl text-gray-900 bg-white"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={15}
                textContentType="telephoneNumber"
                autoComplete="tel"
                placeholder="Enter phone number"
              />
            </View>

            {phoneNumber.length > 0 && (
              <View className="px-4 py-4 ">{getValidationIcon()}</View>
            )}
            {validationResult.isValid &&
              validationResult.countryIso2 &&
              validationResult.countryIso2 !== selectedCountry?.cca2}
          </View>
        </View>

        {/* Floating Continue Button */}
        <View
          className={`absolute left-6 right-6 z-50 ${
            isKeyboardVisible
              ? "bottom-[40%]" // Above keyboard
              : "bottom-10" // At bottom when keyboard closed
          }`}
        >
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isPhoneValid}
            className={`w-full py-4 rounded-xl shadow-lg ${
              isPhoneValid ? "bg-black" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-center font-bold text-lg ${
                isPhoneValid ? "text-white" : "text-gray-500"
              }`}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
