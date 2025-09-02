import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { View, Text, Pressable, Keyboard } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";

import AuthBottomSheet from "@/components/auth/AuthBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import Orb from "@/components/reusable/Orb";
import Entypo from "@expo/vector-icons/Entypo";

const LOGIN_SNAP_POINTS = ["30%"];
const SIGNUP_SNAP_POINTS = ["30%"];

export default function Auth() {
  const router = useRouter();

  const loginSheetRef = useRef<BottomSheet>(null);
  const signupSheetRef = useRef<BottomSheet>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session) {
        router.replace("/(tabs)/home");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)/home");
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  const loginSnapPoints = useMemo(() => LOGIN_SNAP_POINTS, []);
  const signUpSnapPoints = useMemo(() => SIGNUP_SNAP_POINTS, []);

  const openLoginSheet = useCallback(() => {
    loginSheetRef.current?.expand();
    setIsLoginOpen(true);
  }, []);

  const logInWithPhoneRouting = useCallback(() => {
    router.push("/(auth)/(log-in)/withPhone");
  }, [router]);

  const openSignupSheet = useCallback(() => {
    signupSheetRef.current?.expand();
    setIsSignupOpen(true);
  }, []);

  const signUpWithPhoneRouting = useCallback(() => {
    router.push("/(auth)/(sign-up)/withPhone");
  }, [router]);

  const handleCloseSheets = useCallback(() => {
    loginSheetRef.current?.close();
    signupSheetRef.current?.close();
    Keyboard.dismiss();
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  }, []);

  const handleLoginSheetStateChange = useCallback(
    (index: number) => setIsLoginOpen(index !== -1),
    []
  );

  const handleSignupSheetStateChange = useCallback(
    (index: number) => setIsSignupOpen(index !== -1),
    []
  );

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
            onPressOut={openLoginSheet}
          >
            <Text className="text-lg font-bold">Log in</Text>
            <Entypo name="chevron-right" size={20} color="black" />
          </Pressable>
          <Pressable
            className="bg-black rounded-2xl py-5 px-6 flex-row items-center gap-12 shadow-lg active:scale-90 transition-transform duration-200"
            onPressOut={openSignupSheet}
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
        onStateChange={handleLoginSheetStateChange}
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonText="Log in"
        snapPoints={loginSnapPoints}
        alternativeAction={logInWithPhoneRouting}
      />

      <AuthBottomSheet
        bottomSheetStyle="signup"
        sheetRef={signupSheetRef as React.RefObject<BottomSheet>}
        isOpen={isSignupOpen}
        onStateChange={handleSignupSheetStateChange}
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
        buttonText="Sign up"
        snapPoints={signUpSnapPoints}
        alternativeAction={signUpWithPhoneRouting}
      />
    </GestureHandlerRootView>
  );
}
