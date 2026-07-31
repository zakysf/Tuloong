"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout as apiLogout } from "@/lib/services/auth.service";
import { getToken } from "@/lib/axios";
import type { User } from "@/types/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return;
      }
      const currentUser = await getMe();
      setUser(currentUser);
    } catch (error) {
      console.error("Auth session expired or invalid", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    setIsLoading(true);
    await apiLogout();
    setUser(null);
    setIsLoading(false);
    router.push("/login");
  };

  // Helper to wait until loading finishes to avoid flashes
  if (isLoading && (pathname.startsWith("/pelanggan") || pathname.startsWith("/mitra") || pathname.startsWith("/admin"))) {
      // Optional: return a full screen loading here if needed, but doing nothing for smooth transition
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
