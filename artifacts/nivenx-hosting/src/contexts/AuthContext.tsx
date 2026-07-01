import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setToken, clearToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nivenx_token");
    if (!token) { setLoading(false); return; }
    api.get<{ user: User }>("/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.post<{ token: string; user: User }>("/auth/login", { email, password });
    setToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await api.post<{ token: string; user: User }>("/auth/register", { name, email, password });
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    api.post("/auth/logout", {}).catch(() => {});
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
