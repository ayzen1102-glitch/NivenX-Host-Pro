import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useUser, useClerk } from "@clerk/react";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clerkLoaded) return;
    if (!clerkUser) {
      // Not signed in — try legacy Bearer token
      const token = localStorage.getItem("nivenx_token");
      if (token) {
        api.get<User>("/auth/me")
          .then((u) => setDbUser(u))
          .catch(() => localStorage.removeItem("nivenx_token"))
          .finally(() => setLoading(false));
      } else {
        setDbUser(null);
        setLoading(false);
      }
      return;
    }
    // Clerk user is loaded — sync/provision DB user
    api.get<User>("/auth/me")
      .then((u) => setDbUser(u))
      .catch(() => {
        // Provision from Clerk profile
        setDbUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          name: clerkUser.fullName ?? clerkUser.firstName ?? "User",
          role: "user",
          avatarUrl: clerkUser.imageUrl,
        });
      })
      .finally(() => setLoading(false));
  }, [clerkLoaded, clerkUser]);

  const logout = () => {
    localStorage.removeItem("nivenx_token");
    setDbUser(null);
    signOut();
  };

  const user: User | null = dbUser ?? (clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
    name: clerkUser.fullName ?? "User",
    role: "user",
    avatarUrl: clerkUser.imageUrl,
  } : null);

  return (
    <AuthContext.Provider value={{ user, loading: !clerkLoaded || loading, isAdmin: user?.role === "admin", logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
