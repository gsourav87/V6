import { useState } from "react";
import { LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase-auth";

interface HeaderProps {
  onLoginClick?: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle (if you have it) */}
      {/* <ThemeToggle /> */}

      {/* Login or Logout button */}
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">
            {user.email}
          </span>
          <Button
            onClick={handleLogout}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            লগ আউট
          </Button>
        </div>
      ) : (
        <Button
          onClick={onLoginClick}
          size="sm"
          className="gap-2"
        >
          <LogIn className="h-4 w-4" />
          সাইন ইন
        </Button>
      )}
    </div>
  );
}
