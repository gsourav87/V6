import {
  initializeApp,
  getApps,
} from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

// Check if Firebase config is available
export const firebaseReady = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

let auth: ReturnType<typeof getAuth> | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

if (firebaseReady) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  auth = getAuth();
}

// ===== EMAIL & PASSWORD =====
export async function signUp(email: string, password: string): Promise<User> {
  if (!auth) throw new Error("Firebase not configured");
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signIn(email: string, password: string): Promise<User> {
  if (!auth) throw new Error("Firebase not configured");
  
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// ===== GOOGLE SIGN-IN =====
export async function signInWithGoogle(): Promise<User> {
  if (!auth) throw new Error("Firebase not configured");
  
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// ===== PHONE NUMBER AUTHENTICATION =====
export async function setupRecaptcha(
  containerId: string = "recaptcha-container"
): Promise<void> {
  if (!auth) throw new Error("Firebase not configured");
  
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("Recaptcha verified");
    },
  });
}

export async function sendPhoneVerificationCode(
  phoneNumber: string
): Promise<ConfirmationResult> {
  if (!auth) throw new Error("Firebase not configured");
  if (!recaptchaVerifier) {
    await setupRecaptcha();
  }

  if (!recaptchaVerifier) {
    throw new Error("Failed to initialize reCAPTCHA");
  }

  confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    recaptchaVerifier
  );
  
  return confirmationResult;
}

export async function verifyPhoneCode(code: string): Promise<User> {
  if (!confirmationResult) {
    throw new Error("No verification code sent. Please send code first.");
  }

  const result = await confirmationResult.confirm(code);
  return result.user;
}

// ===== SIGN OUT =====
export async function signOut(): Promise<void> {
  if (!auth) throw new Error("Firebase not configured");
  await firebaseSignOut(auth);
}

// ===== AUTH STATE LISTENER =====
export function onAuthChanged(
  callback: (user: User | null) => void
): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

// ===== HELPER FUNCTIONS =====
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  
  // If starts with country code, keep it
  if (cleaned.startsWith("91")) {
    return "+" + cleaned;
  }
  
  // Otherwise assume India (+91)
  return "+91" + cleaned;
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  
  // India: 10 digits (or 12 with +91)
  if (cleaned.length === 10 || cleaned.length === 12) return true;
  
  // US: 10 digits (or 11 with +1)
  if (cleaned.length === 10 || cleaned.length === 11) return true;
  
  return false;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
