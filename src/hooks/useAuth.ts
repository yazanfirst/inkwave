import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const ADMIN_CHECK_TIMEOUT_MS = 8000;
const ADMIN_CHECK_RETRY_DELAY_MS = 1500;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (userId: string): Promise<boolean | null> => {
    try {
      const query = supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      const { data, error } = await Promise.race([
        query,
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("checkAdmin timeout")), ADMIN_CHECK_TIMEOUT_MS);
        }),
      ]);

      if (error) {
        console.error("checkAdmin error:", error);
        return false;
      }
      return !!data;
    } catch (err) {
      if (err instanceof Error && err.message === "checkAdmin timeout") {
        console.warn("checkAdmin timed out; retrying admin status check");
        return null;
      }
      console.error("checkAdmin exception:", err);
      return false;
    }
  }, []);

  const resolveAdmin = useCallback(async (userId: string): Promise<boolean | null> => {
    const firstTry = await checkAdmin(userId);
    if (firstTry !== null) {
      return firstTry;
    }

    await new Promise((resolve) => setTimeout(resolve, ADMIN_CHECK_RETRY_DELAY_MS));
    return checkAdmin(userId);
  }, [checkAdmin]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const admin = await resolveAdmin(currentUser.id);
          if (!mounted) return;
          setIsAdmin(admin);
          setLoading(false);
          return;
        }

        setIsAdmin(false);
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (!mounted) return;
        setLoading(true);

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const admin = await resolveAdmin(currentUser.id);
          if (!mounted) return;
          setIsAdmin(admin);
          setLoading(false);
          return;
        }

        setIsAdmin(false);
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [resolveAdmin]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return { user, isAdmin, loading, signIn, signUp, signOut };
};
