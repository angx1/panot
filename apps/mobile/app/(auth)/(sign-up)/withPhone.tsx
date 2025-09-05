import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Platform,
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
  const inputRef = useRef<TextInput>(null);
  const [validationResult, setValidationResult] =
    useState<PhoneValidationResult>({
      isValid: false,
      phoneNumber: null,
      countryIso2: null,
      countryIso3: null,
      countryCode: null,
    });

  useEffect(() => {
    if (!selectedCountry || !selectedCountry.callingCode) {
      setSelectedCountry?.(DEFAULT_COUNTRY);
    }
  }, [selectedCountry, setSelectedCountry]);

  useEffect(() => {
    if (phoneNumber && phoneNumber.length >= 9) {
      const validation = validatePhoneNumber(
        phoneNumber,
        selectedCountry?.cca2
      );
      setValidationResult(validation);
    } else {
      setValidationResult({
        isValid: false,
        phoneNumber: null,
        countryIso2: null,
        countryIso3: null,
        countryCode: null,
      });
    }
  }, [phoneNumber, selectedCountry?.cca2]);

  const handleCountrySelect = () => {
    try {
      //router.push("/(auth)/(sign-up)/pickCountryCode");
      router.navigate("/(auth)/(sign-up)/pickCountryCode");
    } catch (error) {
      // no-op
      console.error("Navigation error:", error);
    }
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
      if (countryCode) {
        const result = phone(input, { country: countryCode });
        console.log("result", result);
        return {
          ...result,
          formattedNumber: result.isValid ? result.phoneNumber : undefined,
          errorMessage: result.isValid
            ? undefined
            : "Invalid phone number for selected country",
        };
      } else {
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
        errorMessage:
          error instanceof Error ? error.message : "Validation error",
      };
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    //const cleaned = text.replace(/\D/g, "");
    //setPhoneNumber(cleaned);
    setPhoneNumber(text);
  };

  const handleContinue = () => {
    if (!validationResult.isValid || !validationResult.phoneNumber) {
      return;
    }
    // TODO: Navigate to next step or send verification code
  };

  const isPhoneValid = useMemo(() => {
    return validationResult.isValid && validationResult.phoneNumber !== null;
  }, [validationResult.isValid, validationResult.phoneNumber]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            What&apos;s your phone number?
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            We&apos;ll send you a verification code to verify your phone number
          </Text>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center overflow-hidden">
            <TouchableOpacity
              onPress={handleCountrySelect}
              className="flex-row items-center px-4 py-4 border-r border-gray-200 bg-white active:bg-gray-50 border border-gray-200 rounded-xl"
            >
              <View>
                <Text
                  className="text-xl font-medium text-gray-900 pl-2"
                  style={{ fontSize: 20 }}
                >
                  {selectedCountry?.callingCode || DEFAULT_COUNTRY.callingCode}
                </Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#000"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            <View className="flex-1 pr-4 justify-center">
              <TextInput
                ref={inputRef}
                className="px-4 text-xl font-medium text-gray-900 bg-white"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={15}
                textContentType="telephoneNumber"
                autoFocus={true}
                autoComplete="tel"
                importantForAutofill="yes"
                autoCorrect={false}
                spellCheck={false}
                placeholder="Phone number"
                placeholderTextColor="#A0A0A0"
                textAlign="left"
                style={{
                  fontSize: 20,
                  height: 56,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            zIndex: 50,
            bottom: phoneNumber.length === 0 ? "45%" : "39%",
          }}
        >
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isPhoneValid}
            style={{
              width: "100%",
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: isPhoneValid ? "#000000" : "#D1D5DB",
              shadowColor: isPhoneValid ? "#000" : "transparent",
              shadowOffset: isPhoneValid
                ? { width: 0, height: 4 }
                : { width: 0, height: 0 },
              shadowOpacity: isPhoneValid ? 0.25 : 0,
              shadowRadius: isPhoneValid ? 6 : 0,
              elevation: isPhoneValid ? 6 : 0,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18,
                color: "#FFFFFF",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
