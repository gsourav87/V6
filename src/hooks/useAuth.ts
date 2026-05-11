import { useContext, createContext } from "react";

// Minimal user shape — no Firebase SDK import needed here.
export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export function useAuthContext() {
  return useContext(AuthContext);
}
