import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase";
import BottomSheet from "@gorhom/bottom-sheet";

type Props = {
  buttonType?: AppleAuthentication.AppleAuthenticationButtonType;
  sheetRef: React.RefObject<BottomSheet>;
};

export function IOSAuth({
  buttonType = AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP,
  sheetRef,
}: Props) {
  if (Platform.OS !== "ios") return null;

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={buttonType}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={10}
      style={{ width: 300, height: 40 }}
      onPress={async () => {
        sheetRef.current?.close();
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });

          if (!credential.identityToken) throw new Error("No identityToken");

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "apple",
            token: credential.identityToken,
          });

          if (error) {
            console.log("Supabase signIn error:", error);
            return;
          }

          if (credential.fullName || credential.email) {
            const fullName = credential.fullName
              ? AppleAuthentication.formatFullName(credential.fullName)
              : undefined;

            await supabase.auth.updateUser({
              data: { full_name: fullName },
              email: credential.email ?? undefined,
            });
          }
          supabase.auth.setSession(data.session);
        } catch (e: any) {
          if (e?.code === "ERR_REQUEST_CANCELED") return;
          console.log("Apple sign-in error:", e);
        }
      }}
    />
  );
}
