import { useState } from "react";
import { AlertCircle, Loader2, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/firebase-auth";

interface LoginPageProps {
  onSuccess?: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      localStorage.setItem("auth:hasSignedIn", "1");
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold font-bengali text-card-foreground mb-2">
          সঠিক বাংলা ক্যালেন্ডার
        </h1>
        <p className="text-sm text-muted-foreground">
          আপনার Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full gap-2 font-medium bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="h-4 w-4" />
        )}
        Google দিয়ে সাইন ইন করুন
      </Button>
    </div>
  );
}
