// No top-level Firebase SDK imports — everything is loaded lazily via dynamic import.
// This keeps Firebase out of the main JS bundle entirely.

export const firebaseReady = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

const firebaseConfig = firebaseReady
  ? {
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    }
  : null;

// Single shared promise so Firebase is initialized at most once.
let _authPromise: Promise<import("firebase/auth").Auth> | null = null;

async function getAuth(): Promise<import("firebase/auth").Auth> {
  if (!firebaseReady || !firebaseConfig) throw new Error("Firebase not configured");
  if (_authPromise) return _authPromise;

  _authPromise = (async () => {
    const [{ initializeApp, getApps }, { getAuth: _getAuth }] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
    ]);
    if (!getApps().length) initializeApp(firebaseConfig!);
    return _getAuth();
  })();

  return _authPromise;
}

// ===== EMAIL & PASSWORD =====
export async function signUp(email: string, password: string) {
  const auth = await getAuth();
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signIn(email: string, password: string) {
  const auth = await getAuth();
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// ===== GOOGLE SIGN-IN =====
export async function signInWithGoogle() {
  const auth = await getAuth();
  const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// ===== PHONE NUMBER AUTHENTICATION =====
let _recaptchaVerifier: import("firebase/auth").RecaptchaVerifier | null = null;
let _confirmationResult: import("firebase/auth").ConfirmationResult | null = null;

export async function setupRecaptcha(containerId = "recaptcha-container"): Promise<void> {
  const auth = await getAuth();
  const { RecaptchaVerifier } = await import("firebase/auth");
  _recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}

export async function sendPhoneVerificationCode(phoneNumber: string) {
  const auth = await getAuth();
  if (!_recaptchaVerifier) await setupRecaptcha();
  if (!_recaptchaVerifier) throw new Error("Failed to initialize reCAPTCHA");
  const { signInWithPhoneNumber } = await import("firebase/auth");
  _confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, _recaptchaVerifier);
  return _confirmationResult;
}

export async function verifyPhoneCode(code: string) {
  if (!_confirmationResult) throw new Error("No verification code sent. Please send code first.");
  const result = await _confirmationResult.confirm(code);
  return result.user;
}

// ===== SIGN OUT =====
export async function signOut(): Promise<void> {
  const auth = await getAuth();
  const { signOut: _signOut } = await import("firebase/auth");
  await _signOut(auth);
}

// ===== AUTH STATE LISTENER =====
// Returns a Promise<unsubscribe> because Firebase is loaded asynchronously.
export async function onAuthChanged(
  callback: (user: import("firebase/auth").User | null) => void
): Promise<() => void> {
  if (!firebaseReady) {
    callback(null);
    return () => {};
  }
  const auth = await getAuth();
  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(auth, callback);
}

// ===== HELPERS (sync — no Firebase import needed) =====
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("91")) return "+" + cleaned;
  return "+91" + cleaned;
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 12 || cleaned.length === 11;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
