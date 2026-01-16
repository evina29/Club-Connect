# Club Connect: Student Organization Hub

A mobile application for managing school clubs and organizations, built with React Native and Firebase.

## 🎯 Project Overview

**Club Connect** is a comprehensive mobile solution that helps students discover, join, and actively participate in school clubs and organizations. The app provides a centralized platform for club management, event tracking, and communication between students and club leaders.

### Target Event
**BPA (Business Professionals of America) - Mobile Application Development Competition**

---

## ✨ Features

### Required Features (Competition Requirements)
- ✅ **External Backend Database**: Firebase Firestore for secure, scalable data storage
- ✅ **User Authentication**: Complete registration, login, and account recovery system
- ✅ **Club Management**: Browse, search, and join clubs
- ✅ **Event System**: View upcoming meetings and events with calendar integration
- ✅ **Attendance Tracking**: Track participation in club activities
- ✅ **Admin Panel**: Full dashboard for club leaders to manage members and post updates
- ✅ **Multiple Views**: Login/Register/Recovery, Club Listings, Club Details
- ✅ **API Integration**: Calendar API for event synchronization

### Additional Features
- 🏠 **Home Dashboard**: Personalized welcome screen with quick actions and upcoming events
- 🔍 **Search Functionality**: Find clubs by name or description
- 📢 **Announcements**: Club leaders can post updates to members
- 👥 **Member Management**: Admins can view and manage club members
- 📊 **Statistics**: View club membership counts and engagement metrics
- 🎨 **Modern UI/UX**: Clean, intuitive interface with Material Design icons

---

## 🛠 Technology Stack

### Frontend
- **React Native 0.73**: Cross-platform mobile framework (iOS & Android)
- **React Navigation 6**: Navigation system with stack and tab navigators
- **React Native Vector Icons**: Material Design icon library

### Backend
- **Firebase Authentication**: User management and security
- **Firebase Firestore**: NoSQL cloud database
- **Firebase Storage**: Cloud storage for media files

### Additional Services
- **Calendar API**: External API integration for event management
- **Axios**: HTTP client for API requests
- **React Context API**: Global state management

---

## 📁 Project Structure

```
club-connect/
├── src/
│   ├── config/
│   │   └── firebase.js              # Firebase configuration
│   ├── context/
│   │   └── AuthContext.js           # Authentication state management
│   ├── navigation/
│   │   └── AppNavigator.js          # App navigation setup
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js       # User login
│   │   │   ├── RegisterScreen.js    # New user registration
│   │   │   └── ForgotPasswordScreen.js  # Password recovery
│   │   ├── main/
│   │   │   └── HomeScreen.js        # Dashboard/home page
│   │   ├── clubs/
│   │   │   ├── ClubListScreen.js    # Browse all clubs
│   │   │   ├── ClubDetailScreen.js  # Club details and actions
│   │   │   └── MyClubsScreen.js     # User's joined clubs
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.js      # Admin control panel
│   │   │   ├── ManageMembersScreen.js       # Member management
│   │   │   ├── CreateAnnouncementScreen.js  # Post announcements
│   │   │   └── CreateEventScreen.js         # Create events
│   │   └── profile/
│   │       └── ProfileScreen.js     # User profile and settings
│   ├── services/
│   │   ├── AuthService.js           # Authentication operations
│   │   ├── ClubService.js           # Club CRUD operations
│   │   ├── EventService.js          # Event management
│   │   ├── AnnouncementService.js   # Announcement operations
│   │   └── CalendarAPIService.js    # External calendar API
│   └── utils/
│       └── constants.js             # App constants and helpers
├── App.js                           # Root component
├── index.js                         # App entry point
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)
- Firebase account

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "c:\Users\mutha\OneDrive\Desktop\bpa mobile applications 2026"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Enable Storage
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Update `src/config/firebase.js` with your Firebase credentials

4. **iOS Setup** (Mac only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **Calendar API Setup** (Optional)
   - Obtain API credentials from your calendar service provider
   - Update `src/services/CalendarAPIService.js` with your API endpoint and key

### Running the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Start Metro Bundler:**
```bash
npm start
```

---

## 🔐 Firebase Configuration

### Firestore Collections Structure

**users**
```javascript
{
  email: string,
  name: string,
  role: 'student' | 'admin',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**clubs**
```javascript
{
  name: string,
  description: string,
  category: string,
  adminId: string,
  memberCount: number,
  imageUrl: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**events**
```javascript
{
  clubId: string,
  title: string,
  description: string,
  location: string,
  startDate: timestamp,
  endDate: timestamp,
  creatorId: string,
  attendeeCount: number,
  createdAt: timestamp
}
```

**announcements**
```javascript
{
  clubId: string,
  title: string,
  content: string,
  creatorId: string,
  createdAt: timestamp
}
```

**memberships**
```javascript
{
  clubId: string,
  userId: string,
  joinedAt: timestamp,
  status: 'active' | 'inactive'
}
```

**attendance**
```javascript
{
  eventId: string,
  userId: string,
  markedAt: timestamp
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Clubs collection
    match /clubs/{clubId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.adminId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Events, Announcements, Memberships, Attendance
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 👥 User Roles

### Student (Default)
- Browse and search clubs
- Join/leave clubs
- View club events and announcements
- Mark attendance at events
- View personal profile and activity

### Admin (Club Leader)
- All student permissions
- Create and manage clubs
- Add/remove members
- Post announcements
- Create events
- Access admin dashboard
- View club statistics

---

## 📱 Key Screens

### Authentication Flow
1. **Login Screen**: Email/password authentication
2. **Register Screen**: New user account creation
3. **Forgot Password**: Email-based password recovery

### Main App Flow
1. **Home Dashboard**: Personalized overview with quick actions
2. **Club List**: Browse all available clubs with search
3. **Club Details**: View club info, events, announcements, join/leave
4. **My Clubs**: Quick access to joined clubs
5. **Profile**: User settings and account management

### Admin Flow
1. **Admin Dashboard**: Management overview with statistics
2. **Manage Members**: View and remove club members
3. **Create Announcement**: Post updates to club members
4. **Create Event**: Schedule meetings with calendar sync

---

## 🔌 API Integration

The app integrates with a **Calendar API** for event synchronization. The implementation in `CalendarAPIService.js` provides a template that can be adapted for:

- Google Calendar API
- Microsoft Outlook Calendar
- Apple Calendar
- Custom calendar services

**Features:**
- Add events to external calendar
- Retrieve calendar events
- Update event details
- Delete events

---

## 📝 Competition Compliance Checklist

✅ **External backend database**: Firebase Firestore
✅ **User registration and account recovery**: Complete auth system
✅ **Browse and join clubs**: Club listing and join functionality
✅ **View club events and announcements**: Event and announcement displays
✅ **Track attendance/participation**: Attendance marking system
✅ **Admin panel for club leaders**: Full admin dashboard
✅ **Login/register/recovery views**: All auth screens implemented
✅ **Club listings and details views**: Multiple club screens
✅ **API integration**: Calendar API service

---

## 🚧 Future Enhancements (Optional Features)

- 📄 **PDF Export**: Export club schedules and participation logs
- 🔔 **Push Notifications**: Real-time event reminders
- 📱 **Social Media Sharing**: Share club promotions
- 🏆 **Digital Badges**: Gamification for active participation
- 💬 **Comments & Q&A**: Discussion section for each club
- 📊 **Analytics Dashboard**: Advanced engagement metrics
- 🌐 **Multi-language Support**: Internationalization

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with email validation
- [ ] Login with valid/invalid credentials
- [ ] Password recovery email
- [ ] Browse clubs list
- [ ] Search clubs
- [ ] Join/leave clubs
- [ ] View club details
- [ ] Create events (admin)
- [ ] Create announcements (admin)
- [ ] Mark attendance
- [ ] Profile management

---

## 🐛 Troubleshooting

### Common Issues

**Metro Bundler won't start:**
```bash
npx react-native start --reset-cache
```

**Android build fails:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**iOS build fails:**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**Firebase connection issues:**
- Verify Firebase config in `src/config/firebase.js`
- Check Firebase console for enabled services
- Ensure google-services.json/GoogleService-Info.plist are properly placed

---

## 📄 License

This project is developed for educational purposes as part of the BPA Mobile Application Development competition.

---

## 👨‍💻 Development

**Author**: BPA Competition Entry
**Version**: 1.0.0
**Last Updated**: November 2025

---

## 📞 Support

For questions or issues:
- Check Firebase documentation: https://firebase.google.com/docs
- React Native documentation: https://reactnative.dev/docs/getting-started
- Open an issue in the project repository

---

## 🎓 Educational Use

This application is designed for the BPA Mobile Application Development competition and demonstrates:
- Mobile app architecture
- Firebase backend integration
- User authentication and authorization
- CRUD operations
- External API integration
- Modern UI/UX design principles
- State management patterns

**Good luck with your BPA competition! 🏆**
