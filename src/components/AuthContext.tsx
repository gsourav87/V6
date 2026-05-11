import { ReactNode, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { AuthContext } from "@/hooks/useAuth";
import { onAuthChanged, firebaseReady } from "@/lib/firebase-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  // If Firebase isn't configured, skip auth entirely — always show the app
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseReady);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }
    const unsub = onAuthChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
