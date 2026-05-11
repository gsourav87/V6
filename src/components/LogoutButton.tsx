import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, firebaseReady } from "@/lib/firebase-auth";
import { useAuthContext } from "@/hooks/useAuth";

export function LogoutButton() {
  const { user } = useAuthContext();

  // Only show when Firebase is active and user is logged in
  if (!firebaseReady || !user) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut()}
      className="gap-1.5"
      title={`Logged in as ${user.email}`}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline text-xs">লগ আউট</span>
    </Button>
  );
}
