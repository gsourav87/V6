import { initializeApp, FirebaseApp } from "firebase/app";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Only initialize Firebase if credentials are present
export let app: FirebaseApp | null = null;
export let firebaseReady = false;

if (apiKey) {
  try {
    app = initializeApp({
      apiKey,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    });
    firebaseReady = true;
  } catch (e) {
    console.warn("Firebase init failed:", e);
  }
}
