import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types/admin';
import { api } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: AdminUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for an existing Supabase session on load (survives page refresh)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        api.getMe()
          .then(({ user }) => setUser(user))
          .catch(() => setUser(null))
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Keep in sync with auth state changes (e.g. token refresh, sign out
    // in another tab)
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await api.login(email, password);
    setUser(user);
  };

  const logout = () => {
    api.logoutSupabase();
    setUser(null);
  };

  const updateUser = (updatedUser: AdminUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
