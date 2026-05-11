# Firebase Authentication Setup Guide

This guide shows you exactly where to add all the new authentication files to your project.

## 📁 File Structure & Where to Add Them

```
src/
├── lib/
│   ├── firebase.ts                 ← CREATED (Firebase initialization)
│   └── firebase-auth.ts            ← CREATED (Auth functions)
├── hooks/
│   └── useAuth.ts                  ← CREATED (Auth hook)
├── components/
│   ├── AuthContext.tsx             ← CREATED (Auth provider)
│   ├── LoginPage.tsx               ← CREATED (Login UI)
│   ├── ProtectedRoute.tsx          ← CREATED (Route protection)
│   ├── LogoutButton.tsx            ← CREATED (Logout button)
│   └── ... (other components)
├── App.tsx                         ← MODIFIED (Added auth wrapper & ProtectedRoute)
└── index.html                      ← (No changes needed)
```

## 🔧 Step-by-Step Setup

### 1. **Copy All New Files**

Copy these 6 files into your project:

```
✅ src/lib/firebase.ts
✅ src/lib/firebase-auth.ts
✅ src/hooks/useAuth.ts
✅ src/components/AuthContext.tsx
✅ src/components/LoginPage.tsx
✅ src/components/ProtectedRoute.tsx
✅ src/components/LogoutButton.tsx
```

### 2. **Replace App.tsx**

Replace your current `src/App.tsx` with the new version that includes:
- `AuthProvider` wrapper
- `ProtectedRoute` component
- `LogoutButton` import

### 3. **Update Environment Variables**

Add these to your `.env.local` (or `.env` during development):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get these values from: Firebase Console → Project Settings → General

### 4. **Firebase Console Setup**

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project
3. Click **Authentication** (left sidebar)
4. Click **Get Started**
5. Enable **Email/Password** sign-in method
6. (Optional) Enable **Google Sign-In** for easy login

### 5. **Install Firebase Package** (if not already installed)

```bash
npm install firebase
# or
pnpm add firebase
```

## 🎯 How It Works

**User Flow:**
```
Visit App
  ↓
AuthProvider loads user from Firebase
  ↓
Is user logged in?
  ├─ YES → Show Calendar (Home)
  └─ NO → Show LoginPage
```

**Files Explained:**

| File | Purpose |
|------|---------|
| `firebase.ts` | Initializes Firebase with your config |
| `firebase-auth.ts` | Sign up, sign in, sign out functions |
| `useAuth.ts` | Hook to get current user & loading state |
| `AuthContext.tsx` | Wraps app with auth provider |
| `LoginPage.tsx` | Email/password login & signup form |
| `ProtectedRoute.tsx` | Hides calendar until user logs in |
| `LogoutButton.tsx` | "লগ আউট" button in top-right |
| `App.tsx` | UPDATED to use auth everywhere |

## 🚀 Testing Locally

1. Start dev server: `npm run dev`
2. You should see the login screen
3. Click "Don't have an account? Sign up"
4. Enter any email & password (8+ chars)
5. You'll be logged in automatically
6. Calendar appears
7. Click "লগ আউট" to log out

## 🔑 Important Notes

- **User data persists** in Firebase (linked by email)
- **Passwords are hashed** automatically by Firebase
- **Login state persists** across browser refreshes
- **No backend needed** — Firebase handles everything
- **Free tier covers** thousands of users per month

## 🐛 Troubleshooting

**"Failed to get user" error?**
→ Check your `.env.local` has correct Firebase config values

**Login button does nothing?**
→ Check browser console (F12) for error messages

**"User created but not logged in"?**
→ This shouldn't happen; file an issue if it does

**"Authentication not available in emulator"?**
→ This is normal in development; it works in production

## 📝 What Users Will See

**Before Login:**
- Full-page login form
- Option to sign up or sign in
- Error messages if credentials fail

**After Login:**
- Calendar appears
- "লগ আউট" button in top-right
- All features work normally
- Logout removes them from app

---

**That's it!** Your calendar now has full Firebase authentication. 🎉

