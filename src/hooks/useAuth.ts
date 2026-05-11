import { useState, useEffect, useContext, createContext } from "react";
import { User } from "firebase/auth";
import { onAuthChanged } from "@/lib/firebase-auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}

export function useAuthContext() {
  return useContext(AuthContext);
}
