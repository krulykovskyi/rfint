# React Firebase App Setup Guide

This React application provides a complete authentication and database management system using Firebase with role-based access control.

## Features

- **Authentication**: Firebase Authentication with email/password
- **Role-based Access**: Admin and regular user roles
- **Search Page**: All authenticated users can search and view database items
- **Admin Page**: Only admin users can create, update, and delete database items
- **State Management**: Redux Toolkit for global state management
- **UI**: Material-UI for modern, responsive design

## Prerequisites

1. Node.js (v14 or higher)
2. npm or yarn
3. Firebase project

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider

### 3. Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location

### 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add a web app
4. Register your app
5. Copy the Firebase configuration object

### 5. Update Firebase Configuration

Edit `src/config/firebase.js` and replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: 'your-actual-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'your-app-id',
};
```

## Database Structure

The app expects a collection called `items` with documents containing:

```javascript
{
  name: string,
  description: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## User Management

### Creating Users with Roles

1. **Create User Documents**: After users sign up through Firebase Auth, you need to create user documents in Firestore to assign roles.

2. **User Collection Structure**: Create a `users` collection with documents using the user's UID as the document ID:

```javascript
// Document ID: user's Firebase Auth UID
{
  email: "user@example.com",
  role: "admin" // or "user"
}
```

### Setting Up Admin Users

1. Create a user through the app's login form or Firebase Console
2. In Firestore, create a document in the `users` collection:
   - Document ID: The user's Firebase Auth UID
   - Data: `{ email: "admin@example.com", role: "admin" }`

## Installation and Running

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Update Firebase configuration** in `src/config/firebase.js`

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Open your browser** to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Fixes auto-fixable ESLint issues
- `npm run format` - Formats code with Prettier
- `npm run format:check` - Checks if code is properly formatted

## Usage

### For Regular Users

1. **Login**: Use email/password to authenticate
2. **Search**: Access the search page to find items in the database
3. **Browse**: View all items or search by name

### For Admin Users

1. **Login**: Use admin credentials
2. **Search**: Access to the search page like regular users
3. **Admin Panel**: Click the "Admin" button in the navigation to access the admin dashboard
4. **Manage Items**: Create, read, update, and delete database items

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── Login.js         # Login form component
│   └── ProtectedRoute.js # Route protection wrapper
├── config/              # Configuration files
│   └── firebase.js      # Firebase configuration
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication context
├── pages/               # Main page components
│   ├── AdminPage.js     # Admin dashboard
│   └── SearchPage.js    # Search interface
├── services/            # External service integrations
│   └── firestoreService.js # Firestore database operations
├── store/               # Redux store configuration
│   ├── store.js         # Store setup
│   └── slices/          # Redux slices
│       ├── authSlice.js # Authentication state
│       └── dataSlice.js # Data management state
├── App.js               # Main app component
└── index.js             # App entry point
```

## Security Considerations

1. **Firestore Rules**: Update your Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Items collection - read for all authenticated users, write for admins only
    match /items/{itemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

2. **Environment Variables**: For production, use environment variables for Firebase config
3. **Authentication Rules**: Implement proper email verification if needed

## Troubleshooting

### Common Issues

1. **Firebase Config Error**: Make sure all Firebase configuration values are correct
2. **Permission Denied**: Check Firestore security rules
3. **Role Not Working**: Ensure user documents exist in the `users` collection with proper role field
4. **Login Issues**: Verify Firebase Authentication is enabled for email/password

### Development Tips

1. Use Firebase emulators for local development
2. Check browser console for detailed error messages
3. Verify network requests in browser dev tools
4. Test with different user roles

## Next Steps

- Implement email verification
- Add password reset functionality
- Enhance search capabilities with multiple fields
- Add user profile management
- Implement real-time updates with Firestore listeners
- Add file upload capabilities
- Implement pagination for large datasets
