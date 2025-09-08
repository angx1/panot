import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Pressable,
  Keyboard,
  ActivityIndicator,
  Text,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import { useAuth } from "@/components/providers/AuthProvider";

import AuthBottomSheet from "@/components/auth/AuthBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import Home from "@/components/reusable/Home";
import Button from "@/components/reusable/Button";

const LOGIN_SNAP_POINTS = ["30%"];
const SIGNUP_SNAP_POINTS = ["30%"];

export default function IndexScreen() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  const loginSheetRef = useRef<BottomSheet>(null);
  const signupSheetRef = useRef<BottomSheet>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // Si ya tenemos sesión desde el AuthProvider, redirigir
      if (!isLoading && session) {
        console.log("Index: User has session, redirecting to main");
        router.replace("/(tabs)/main");
        return;
      }

      // Double-check con supabase directamente
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session) {
        router.replace("/(tabs)/main");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)/main");
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [session, isLoading, router]);

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

  // Mostrar loading mientras se determina el estado de autenticación
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-lg">Inicializando...</Text>
      </View>
    );
  }

  // Si hay sesión, el useEffect se encargará de la redirección
  // Mientras tanto, mostramos la pantalla de auth
  return (
    <GestureHandlerRootView className="flex-1">
      <Pressable
        onPressOut={handleCloseSheets}
        className="flex-1 items-center justify-center bg-white"
      >
        <View className="mb-20">
          <Home />
        </View>
        <View className="absolute bottom-16 flex-row gap-10">
          <Button
            text="Log in"
            variant="secondary"
            rightIcon="chevron-forward"
            onPress={openLoginSheet}
            gap={22}
            style={{
              backgroundColor: "transparent",
              borderWidth: 0,
              borderRadius: 12,
              paddingVertical: 20,
              paddingHorizontal: 24,
              shadowOpacity: 0,
              elevation: 0,
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#000000",
            }}
          />
          <Button
            text="Sign up"
            variant="primary"
            rightIcon="chevron-forward"
            onPress={openSignupSheet}
            gap={48}
            style={{
              backgroundColor: "#000000",
              borderRadius: 16,
              paddingVertical: 20,
              paddingHorizontal: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 6,
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          />
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
