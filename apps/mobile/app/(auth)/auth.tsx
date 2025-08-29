import { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, Pressable, Keyboard } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";

import AuthBottomSheet from "@/components/auth/AuthBottomSheet";
import SignUpBottomSheet from "@/components/auth/SignUpWithPhoneBottomSheet";

import BottomSheet from "@gorhom/bottom-sheet";
import Orb from "@/components/reusable/Orb";
import Entypo from "@expo/vector-icons/Entypo";

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) router.replace("/(tabs)/home");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        router.replace("/(tabs)/home");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const loginSheetRef = useRef<BottomSheet>(null);
  const signupSheetRef = useRef<BottomSheet>(null);
  const signUpPhoneSheetRef = useRef<BottomSheet>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSignUpPhoneOpen, setIsSignUpPhoneOpen] = useState(false);

  const snapPoints = useRef(["30%"]).current;

  const handleOpenLoginPress = useCallback(() => {
    loginSheetRef.current?.expand();
    setIsLoginOpen(true);
  }, []);

  const handleOpenSignUpPhone = useCallback(() => {
    signupSheetRef.current?.close();
    signUpPhoneSheetRef.current?.expand();
    setIsSignupOpen(false);
    setIsSignUpPhoneOpen(true);
  }, []);

  const handleOpenLogInPhone = useCallback(() => {
    loginSheetRef.current?.close();
    setIsLoginOpen(false);
  }, []);

  const handleOpenSignupPress = useCallback(() => {
    signupSheetRef.current?.expand();
    setIsSignupOpen(true);
  }, []);

  const handleCloseSheets = useCallback(() => {
    loginSheetRef.current?.close();
    signupSheetRef.current?.close();
    signUpPhoneSheetRef.current?.close();
    Keyboard.dismiss();
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setIsSignUpPhoneOpen(false);
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <Pressable
        onPressOut={handleCloseSheets}
        className="flex-1 items-center justify-center bg-white"
      >
        <View className="mb-20">
          <Orb size={260} />
        </View>
        <View className="absolute bottom-16 flex-row gap-10">
          <Pressable
            className="rounded-xl py-5 px-6 flex-row items-center gap-8 active:scale-90 transition-transform duration-200"
            onPressOut={handleOpenLoginPress}
          >
            <Text className="text-lg font-bold">Log in</Text>
            <Entypo name="chevron-right" size={20} color="black" />
          </Pressable>
          <Pressable
            className="bg-black rounded-2xl py-5 px-6 flex-row items-center gap-12 shadow-lg active:scale-90 transition-transform duration-200"
            onPressOut={handleOpenSignupPress}
          >
            <Text className="text-lg font-bold text-white">Sign up</Text>
            <Entypo name="chevron-right" size={20} color="white" />
          </Pressable>
        </View>
      </Pressable>

      <AuthBottomSheet
        bottomSheetStyle="login"
        sheetRef={loginSheetRef as React.RefObject<BottomSheet>}
        isOpen={isLoginOpen}
        onStateChange={(index: number) => setIsLoginOpen(index !== -1)}
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonText="Log in"
        snapPoints={snapPoints}
        alternativeAction={handleOpenLogInPhone}
      />

      <AuthBottomSheet
        bottomSheetStyle="signup"
        sheetRef={signupSheetRef as React.RefObject<BottomSheet>}
        isOpen={isSignupOpen}
        onStateChange={(index: number) => setIsSignupOpen(index !== -1)}
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
        buttonText="Sign up"
        snapPoints={snapPoints}
        alternativeAction={handleOpenSignUpPhone}
      />

      <SignUpBottomSheet
        sheetRef={signUpPhoneSheetRef as React.RefObject<BottomSheet>}
        isOpen={isSignUpPhoneOpen}
        onStateChange={(index: number) => setIsSignUpPhoneOpen(index !== -1)}
        snapPoints={["40%"]}
      />
    </GestureHandlerRootView>
  );
}
