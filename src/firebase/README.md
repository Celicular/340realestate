# Firebase Configuration for 340 Real Estate

## 🔐 Environment Variables Setup

### 1. Create Environment File
Create a `.env` file in the root directory of your project:

```bash
# Copy the example file
cp env.example .env
```

### 2. Required Environment Variables
Your `.env` file should contain the following Firebase configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Application Configuration
REACT_APP_APP_NAME=340 Real Estate
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

### 3. Security Best Practices
- ✅ **Never commit `.env` files** to version control
- ✅ **Use different Firebase projects** for development and production
- ✅ **Set up Firebase Security Rules** for Firestore and Storage
- ✅ **Enable Authentication methods** you need in Firebase Console

### 4. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication, Firestore, and Storage
4. Get your configuration from Project Settings > General > Your Apps
5. Copy the config values to your `.env` file

### 5. Environment Validation
The app will automatically validate that all required environment variables are present on startup. If any are missing, you'll see an error message in the console.

This folder contains all Firebase-related configuration and utilities for the 340 Real Estate application.

## 📁 File Structure

```
firebase/
├── config.js          # Firebase app initialization and configuration
├── auth.js            # Authentication utilities (login, register, etc.)
├── firestore.js       # Firestore database operations
├── storage.js         # Firebase Storage utilities for file uploads
├── index.js           # Main export file for all Firebase utilities
└── README.md          # This documentation file
```

## 🚀 Setup Instructions

### 1. Install Firebase Dependencies

```bash
npm install firebase
```

### 2. Environment Variables

Create a `.env` file in your project root and add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Storage
6. Get your configuration from Project Settings

## 🔧 Usage Examples

### Authentication

```javascript
import { registerUser, loginUser, logoutUser } from '../firebase';

// Register a new user
const result = await registerUser('user@example.com', 'password123', 'John Doe');

// Login user
const loginResult = await loginUser('user@example.com', 'password123');

// Logout user
await logoutUser();
```

### Property Management

```javascript
import { addProperty, getProperties, updateProperty } from '../firebase';

// Add a new property
const propertyData = {
  title: 'Beautiful Home',
  price: 500000,
  type: 'house',
  status: 'for-sale',
  // ... other property details
};
const result = await addProperty(propertyData);

// Get properties with filters
const properties = await getProperties({
  type: 'house',
  minPrice: 300000,
  maxPrice: 700000
});

// Update property
await updateProperty('property_id', { price: 550000 });
```

### File Uploads

```javascript
import { uploadPropertyImage, uploadPropertyImages } from '../firebase';

// Upload single image
const file = event.target.files[0];
const result = await uploadPropertyImage(file, 'property_id', 'main');

// Upload multiple images
const files = event.target.files;
const result = await uploadPropertyImages(files, 'property_id');
```

### Real-time Data

```javascript
import { subscribeToProperties } from '../firebase';

// Subscribe to property updates
const unsubscribe = subscribeToProperties((properties) => {
  console.log('Properties updated:', properties);
}, { type: 'house' });

// Unsubscribe when component unmounts
unsubscribe();
```

## 📊 Database Collections

### Properties Collection
- `properties` - Property listings with details, images, and status

### Users Collection
- `users` - User profiles and preferences

### Blogs Collection
- `blogs` - Blog posts and articles

### Contacts Collection
- `contacts` - Contact form submissions

## 🔒 Security Rules

Make sure to set up proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties - readable by all, writable by authenticated users
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Blogs - readable by all, writable by admins
    match /blogs/{blogId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Contacts - readable by admins, writable by all
    match /contacts/{contactId} {
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if true;
    }
  }
}
```

## 🛠️ Error Handling

All Firebase functions return objects with `success` and optional `error` properties:

```javascript
const result = await addProperty(propertyData);

if (result.success) {
  console.log('Property added successfully:', result.id);
} else {
  console.error('Error adding property:', result.error);
}
```

## 📝 Notes

- All timestamps are automatically added to documents
- File uploads include timestamps in filenames to prevent conflicts
- Real-time listeners should be properly cleaned up to prevent memory leaks
- Environment variables must be prefixed with `REACT_APP_` for Create React App
