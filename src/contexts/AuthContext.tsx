import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, auth } from '../lib/supabase';
import { profileApi, walletApi } from '../lib/api';
import type { Profile, Wallet } from '../lib/database.types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  wallet: Wallet | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  addFunds: (amount: number, paymentMethod: string, bonus: number) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile and wallet
  const fetchUserData = async (userId: string) => {
    const [profileData, walletData] = await Promise.all([
      profileApi.get(userId),
      walletApi.get(userId)
    ]);
    setProfile(profileData);
    setWallet(walletData);
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Small delay to ensure database trigger has completed
          setTimeout(() => fetchUserData(session.user.id), 500);
        } else {
          setProfile(null);
          setWallet(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await auth.signUp(email, password, fullName);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await auth.signIn(email, password);
    return { error };
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    setProfile(null);
    setWallet(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await profileApi.get(user.id);
      setProfile(profileData);
    }
  };

  const refreshWallet = async () => {
    if (user) {
      const walletData = await walletApi.get(user.id);
      setWallet(walletData);
    }
  };

  const addFunds = async (amount: number, paymentMethod: string, bonus: number) => {
    if (!user) return { error: 'Not authenticated' };
    
    const { error } = await walletApi.addFunds(user.id, amount, paymentMethod, bonus);
    if (!error) {
      await refreshWallet();
    }
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      wallet,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      refreshWallet,
      addFunds
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
