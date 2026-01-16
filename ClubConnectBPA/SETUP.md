# Club Connect - Setup Guide

## Quick Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Enable Authentication (Email/Password)
4. Create Firestore Database (Start in test mode)
5. Enable Storage

6. For Android:
   - Download `google-services.json`
   - Place in `android/app/` directory

7. For iOS:
   - Download `GoogleService-Info.plist`
   - Place in `ios/` directory

8. Copy your Firebase config to `src/config/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the App

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
cd ios && pod install && cd ..
npm run ios
```

### 4. Test Accounts

Create test accounts with different roles:
- Student: `student@test.com` / `password123`
- Admin: `admin@test.com` / `password123`

### 5. Seed Test Data (Optional)

You can manually create test clubs in Firebase Console or use the app's admin panel.

---

## Development Commands

- `npm start` - Start Metro Bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run lint` - Check code quality

---

## Troubleshooting

**Build fails?**
- Clean build: `cd android && ./gradlew clean && cd ..`
- Reset cache: `npx react-native start --reset-cache`

**Firebase errors?**
- Verify config in `src/config/firebase.js`
- Check Firebase console for enabled services

---

For complete documentation, see [README.md](./README.md)
