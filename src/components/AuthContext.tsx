import { ReactNode, useState, useEffect } from "react";
import { AuthContext, AuthUser } from "@/hooks/useAuth";
import { firebaseReady, onAuthChanged } from "@/lib/firebase-auth";

const HAS_SIGNED_IN_KEY = "auth:hasSignedIn";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!firebaseReady) return;

    // Skip subscribing to Firebase on load if the user has never signed in.
    // This prevents the Firebase SDK (90 KiB + auth iframe) from loading on
    // every page visit for users who don't use the login feature.
    const hasSignedIn = localStorage.getItem(HAS_SIGNED_IN_KEY);
    if (!hasSignedIn) return;

    setLoading(true);
    let unsubscribe: (() => void) | undefined;

    onAuthChanged((authUser) => {
      if (authUser) {
        setUser({
          uid:         authUser.uid,
          email:       authUser.email,
          displayName: authUser.displayName,
          photoURL:    authUser.photoURL,
        });
        localStorage.setItem(HAS_SIGNED_IN_KEY, "1");
      } else {
        setUser(null);
        localStorage.removeItem(HAS_SIGNED_IN_KEY);
      }
      setLoading(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => { unsubscribe?.(); };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
