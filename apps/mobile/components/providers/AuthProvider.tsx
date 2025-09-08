import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Ctx = { session: Session | null; isLoading: boolean };
const AuthCtx = createContext<Ctx>({ session: null, isLoading: true });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Timeout para evitar carga infinita
    const timeout = setTimeout(() => {
      if (mounted) {
        console.log("AuthProvider: Timeout reached, setting loading to false");
        setLoading(false);
      }
    }, 10000); // 10 segundos timeout

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;

        if (error) {
          console.error("AuthProvider: Error getting session:", error);
        } else {
          console.log(
            "AuthProvider: Session retrieved:",
            data.session ? "Found" : "None"
          );
        }

        setSession(data.session ?? null);
        setLoading(false);
        clearTimeout(timeout);
      })
      .catch((error) => {
        if (!mounted) return;
        console.error("AuthProvider: Error in getSession:", error);
        setLoading(false);
        clearTimeout(timeout);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => {
      console.log(
        "AuthProvider: Auth state changed:",
        s ? "Logged in" : "Logged out"
      );
      setSession(s);
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthCtx.Provider value={{ session, isLoading }}>
      {children}
    </AuthCtx.Provider>
  );
}
