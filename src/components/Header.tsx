import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuth";
import { LogoutButton } from "@/components/LogoutButton";

interface HeaderProps {
  onLoginClick?: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const { user } = useAuthContext();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="h-7 w-7 rounded-full"
          />
        )}
        <span className="hidden sm:inline text-sm text-muted-foreground font-medium max-w-[10rem] truncate">
          {user.displayName || user.email}
        </span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <Button onClick={onLoginClick} size="sm" className="gap-2">
      <LogIn className="h-4 w-4" />
      সাইন ইন
    </Button>
  );
}
