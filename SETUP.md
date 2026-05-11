# সঠিক বাংলা ক্যালেন্ডার — Setup & Installation Guide

**A full Bengali Calendar web app with astronomical calculations, Panchang, Shubha Muhurta, Rahu Kalam, and daily day details.**

---

## ✨ Features

✅ **Complete Panchang** (পঞ্চাঙ্গ)  
- Tithi (তিথি), Vara (বার), Nakshatra (নক্ষত্র), Yoga (যোগ), Karana (করণ)

✅ **Lunar Phases**  
- Purnima (পূর্ণিমা) & Amavasya (অমাবস্যা) badges on calendar

✅ **Auspicious Times Calculator** (শুভ মুহূর্ত)  
- 8 activity types: যাত্রা, বিবাহ, ব্যবসা, গৃহপ্রবেশ, নামকরণ, শিক্ষারম্ভ, অন্নপ্রাশন, শস্য ক্রয়বিক্রয়  
- 10-day forecast with star ratings

✅ **Inauspicious Times** (অশুভ সময়)  
- Rahu Kalam, Gulika Kalam, Yamaganda with visual timeline

✅ **Date Details Modal**  
- Click any calendar date to see full Panchang, festivals, and celestial times

✅ **Mobile Optimized**  
- Responsive design for phones, tablets, desktop

✅ **Firebase Authentication** (Optional)  
- User login/signup with email & password  
- Works without Firebase (bypasses auth)

✅ **Dark/Light Mode**  
- Toggle in header

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd sothik-bangla-calendar
pnpm install
# or: npm install
```

### 2. Run Development Server

```bash
pnpm run dev
# or: npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Build for Production

```bash
pnpm run build
# or: npm run build
```

Output: `dist/` folder ready to deploy.

---

## 🔐 Firebase Authentication (Optional)

The app works **without** Firebase. To enable user authentication:

### Step 1: Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Create Project**
3. Name it (e.g., "Bangla Calendar")
4. Enable Firebase

### Step 2: Set Up Authentication

1. In Firebase Console → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. (Optional) Enable **Google Sign-In**

### Step 3: Get Your Config

1. Go to **Project Settings** → **General** tab
2. Scroll down to "Your apps" section
3. Click **Web** app (or create one)
4. Copy the Firebase config values

### Step 4: Add Environment Variables

Create `.env.local` in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 5: Test Login

```bash
pnpm run dev
```

- Click **"সাইন ইন করুন"** button in top-right
- Sign up with any email & password
- You're logged in! ✅

---

## 📁 Project Structure

```
sothik-bangla-calendar/
├── src/
│   ├── lib/
│   │   ├── panjika.ts              ← Tithi, Nakshatra, Yoga, Karana calculations
│   │   ├── bengali-calendar.ts     ← Bengali date conversions
│   │   ├── muhurta.ts              ← Shubha Muhurta scoring
│   │   ├── festivals.ts            ← Bengali festivals database
│   │   ├── ephemeris.ts            ← Moon & Sun longitude (Meeus VSOP87)
│   │   ├── firebase.ts             ← Firebase initialization
│   │   └── firebase-auth.ts        ← Sign up/in/out functions
│   ├── components/
│   │   ├── LiveClock.tsx           ← Today's Panchang display + WhatsApp share
│   │   ├── CalendarGrid.tsx        ← Calendar with Purnima/Amavasya badges
│   │   ├── DayCell.tsx             ← Individual calendar day cell (clickable)
│   │   ├── DayDetailsModal.tsx     ← Full Panchang modal when you click a date
│   │   ├── MuhurtaCalc.tsx         ← Shubha Muhurta calculator
│   │   ├── RahuKalamCard.tsx       ← Rahu/Gulika/Yamaganda with timeline
│   │   ├── LoginPage.tsx           ← Login/signup form
│   │   ├── Header.tsx              ← Login button + logout button
│   │   ├── AuthContext.tsx         ← Firebase auth provider
│   │   ├── ProtectedRoute.tsx      ← Route protection (requires login if Firebase enabled)
│   │   └── ... (other components)
│   ├── hooks/
│   │   ├── useAuth.ts              ← Get current user
│   │   ├── useCalendar.ts          ← Month/year state
│   │   └── useTodayInfo.ts         ← Today's Panchang
│   ├── App.tsx                     ← Main app component with modals
│   └── index.tsx                   ← Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.local (create this for Firebase)
```

---

## 🔍 How It Works

### Astronomical Calculations

All calculations use **Kolkata, India** (22.5726°N, 88.3639°E, UTC+5:30):

- **Meeus VSOP87** — Moon & Sun tropical longitude
- **Lahiri Ayanamsa** — Indian standard precession: `23.8517 + 1.39689 * T`
- **SunCalc.js** — Sunrise/sunset times
- **Tithi** — Lunar day (1-30, each 12° of Moon-Sun elongation)
- **Nakshatra** — Lunar mansion (27 nakshatra, each 13.33° of Moon's sidereal longitude)

### Shubha Muhurta Scoring

Each day scored 1-5 stars based on:
- **Vara** (weekday) — 0-5 points
- **Tithi** — 0-5 points
- **Nakshatra** — 0-5 points
- **Yoga** — 0-2 bonus points
- **Karana** — 0-1 bonus point

**Total: 0-18 → 1-5 stars**

---

## 📱 Using the App

### Calendar View
- **Desktop**: Full month grid
- **Mobile**: Responsive, tap-friendly cells
- **Click any date** → Full day details modal
- **Purnima/Amavasya** → Special badges

### Find Auspicious Days
1. Scroll to **"শুভ মুহূর্ত"** section
2. Pick an activity (যাত্রা, বিবাহ, etc.)
3. See 10 best days with ⭐ star ratings
4. Click a date to see full Panchang

### Check Inauspicious Times
- **"অশুভ সময়"** card shows:
  - Rahu Kalam, Gulika Kalam, Yamaganda
  - Visual day timeline (sunrise to sunset)
  - Which times are "live" now (pulsing badge)

### Convert Dates
- **"দারিজ্ঞ রূপান্তর"** (Date Converter):
  - Bengali ↔ English date conversion
  - Click to see day details

---

## 🎨 Customization

### Change Header Color
Edit `src/components/LiveClock.tsx`:
```typescript
<div className="bg-orange-600 ...">  // Change to your color
```

### Add More Festivals
Edit `src/lib/festivals.ts`:
```typescript
new Date(Date.UTC(2026, 3, 15)) // April 15, 2026
  { nameBn: "আমার উৎসব", nameEn: "My Festival", icon: "🎉" }
```

### Change Timezone
Edit `src/lib/bengali-calendar.ts`:
```typescript
const KOLKATA_LAT = 22.5726;   // Change latitude
const KOLKATA_LNG = 88.3639;   // Change longitude
const KOLKATA_UTC_OFFSET = 330; // Change UTC offset (minutes)
```

---

## 🌐 Deploy to Production

### Vercel (Easiest)

```bash
npm i -g vercel
vercel
```

Follow prompts → app live on `.vercel.app` ✅

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🐛 Troubleshooting

**"Module not found: firebase/auth"**
→ Run `pnpm install` or `npm install`

**Login button not visible**
→ Add Firebase env vars to `.env.local` (or it auto-hides)

**"Invalid ayanamsa" error**
→ Verify `23.8517 + 1.39689 * T` formula in `src/lib/panjika.ts`

**Calendar shows wrong dates**
→ Check your system timezone is correct

**White screen on load**
→ Check browser console (F12) for errors

---

## 📊 Browser Support

- Chrome/Edge: ✅ Latest
- Firefox: ✅ Latest
- Safari: ✅ Latest (15+)
- Mobile: ✅ iOS Safari, Chrome Android

---

## 📝 License

Open source. Use freely.

---

## 🙏 Credits

- **Meeus VSOP87** — Astronomical algorithms
- **SunCalc** — Sunrise/sunset calculations
- **React + TypeScript** — Frontend framework
- **Tailwind CSS** — Styling
- **Firebase** — Optional authentication

---

## 💬 Support

Have questions? Read the code comments or file an issue on GitHub.

**Enjoy your Bengali calendar! 🗓️✨**
