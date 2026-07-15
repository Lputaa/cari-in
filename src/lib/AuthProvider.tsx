"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { ensureUserExists } from "./db";

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  anonymousId: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadOrCreateUser(session.user);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) await loadOrCreateUser(session.user);
        else {
          setAnonymousId(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadOrCreateUser(supabaseUser: SupabaseUser) {
    try {
      const dbUser = await ensureUserExists(supabaseUser.id, supabaseUser.email!);
      setAnonymousId(dbUser.anonymous_id);
    } catch (err) {
      console.error("Failed to load/create user:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAnonymousId(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        anonymousId,
        loading,
        signInWithGoogle: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
