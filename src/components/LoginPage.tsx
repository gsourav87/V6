import { useState } from "react";
import { Mail, Lock, AlertCircle, Loader2, Phone, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  signIn,
  signUp,
  signInWithGoogle,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  formatPhoneNumber,
  validatePhoneNumber,
  validateEmail,
} from "@/lib/firebase-auth";

interface LoginPageProps {
  onSuccess?: () => void;
}

type AuthMethod = "email" | "google" | "phone";

export function LoginPage({ onSuccess }: LoginPageProps) {
  // Email/Password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  // UI state
  const [activeMethod, setActiveMethod] = useState<AuthMethod>("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== EMAIL & PASSWORD =====
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== GOOGLE SIGN-IN =====
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== PHONE VERIFICATION =====
  const handleSendPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number (10 digits)");
      return;
    }

    setLoading(true);
    try {
      const formatted = formatPhoneNumber(phoneNumber);
      await sendPhoneVerificationCode(formatted);
      setPhoneCodeSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneCode(verificationCode);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Verification failed");
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
          আপনার পছন্দের পদ্ধতিতে সাইন ইন করুন
        </p>
      </div>

      {/* Method tabs */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => {
            setActiveMethod("email");
            setError("");
          }}
          className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
            activeMethod === "email"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          <Mail className="h-4 w-4 mx-auto mb-1" />
          ইমেইল
        </button>
        <button
          onClick={() => {
            setActiveMethod("google");
            setError("");
          }}
          className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
            activeMethod === "google"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          <Chrome className="h-4 w-4 mx-auto mb-1" />
          Google
        </button>
        <button
          onClick={() => {
            setActiveMethod("phone");
            setError("");
          }}
          className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
            activeMethod === "phone"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          <Phone className="h-4 w-4 mx-auto mb-1" />
          ফোন
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ===== EMAIL METHOD ===== */}
      {activeMethod === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="আপনার ইমেইল"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 font-bengali font-medium"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSignUp ? "সাইন আপ করুন" : "সাইন ইন করুন"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-sm text-primary hover:underline font-medium"
            >
              {isSignUp
                ? "ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন"
                : "অ্যাকাউন্ট নেই? সাইন আপ করুন"}
            </button>
          </div>
        </form>
      )}

      {/* ===== GOOGLE METHOD ===== */}
      {activeMethod === "google" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-6">
            আপনার Google অ্যাকাউন্ট দিয়ে দ্রুত সাইন ইন করুন
          </p>
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
      )}

      {/* ===== PHONE METHOD ===== */}
      {activeMethod === "phone" && (
        <form
          onSubmit={phoneCodeSent ? handleVerifyPhoneCode : handleSendPhoneCode}
          className="space-y-4"
        >
          {!phoneCodeSent ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                আপনার মোবাইল নম্বর প্রবেश করুন (১০ সংখ্যা)
              </p>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  maxLength={10}
                  required
                />
              </div>

              <div id="recaptcha-container" className="mb-4" />

              <Button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="w-full gap-2 font-bengali font-medium"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                কোড পাঠান
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                আপনার মোবাইলে পাঠানো ৬-সংখ্যার কোড প্রবেश করুন
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-center tracking-widest font-mono"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full gap-2 font-bengali font-medium"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                যাচাই করুন
              </Button>

              <button
                type="button"
                onClick={() => {
                  setPhoneCodeSent(false);
                  setPhoneNumber("");
                  setVerificationCode("");
                  setError("");
                }}
                className="w-full text-sm text-primary hover:underline font-medium"
              >
                ফিরে যান
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
