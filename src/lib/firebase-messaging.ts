// Client-side Firebase Cloud Messaging — lazy-loaded so the SDK stays out of
// the main bundle. Handles permission, token retrieval, and subscription.

export const messagingReady = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_VAPID_KEY
);

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

const STORAGE_KEY = "sbc-push-enabled";

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window &&
    "PushManager" in window &&
    messagingReady
  );
}

export function pushEnabledLocally(): boolean {
  return typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1";
}

/**
 * Asks permission (if needed), gets an FCM token, and registers it with the
 * backend. Returns the token on success, or null if blocked/unsupported.
 */
export async function enablePush(): Promise<string | null> {
  if (!pushSupported()) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const [{ initializeApp, getApps }, { getMessaging, getToken }] = await Promise.all([
    import("firebase/app"),
    import("firebase/messaging"),
  ]);
  if (!getApps().length) initializeApp(firebaseConfig);
  const messaging = getMessaging();

  // FCM auto-registers /firebase-messaging-sw.js at its own scope (no clash with /sw.js)
  const token = await getToken(messaging, { vapidKey: VAPID_KEY });
  if (!token) return null;

  await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ua: navigator.userAgent }),
  }).catch(() => {});

  localStorage.setItem(STORAGE_KEY, "1");
  return token;
}

export function markPushDisabled() {
  localStorage.setItem(STORAGE_KEY, "0");
}
