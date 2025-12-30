// Debug utility for Firebase Auth

import { getCurrentUser } from '../firebase/auth';
import { getUser } from '../firebase/firestore';

export const debugFirebaseAuth = async () => {
  console.log('=== FIREBASE AUTH DEBUG ===');
  
  // Check current Firebase Auth user
  const currentUser = getCurrentUser();
  console.log('🔥 Current Firebase Auth user:', currentUser);
  
  if (currentUser) {
    console.log('📧 User email:', currentUser.email);
    console.log('🆔 User UID:', currentUser.uid);
    console.log('✅ Email verified:', currentUser.emailVerified);
    console.log('📅 Created at:', currentUser.metadata.creationTime);
    
    // Try to get user data from Firestore
    try {
      const firestoreResult = await getUser(currentUser.uid);
      if (firestoreResult.success) {
        console.log('📝 Firestore user data:', firestoreResult.data);
      } else {
        console.log('❌ Firestore user data not found:', firestoreResult.error);
      }
    } catch (error) {
      console.log('❌ Error fetching Firestore data:', error);
    }
  } else {
    console.log('❌ No Firebase Auth user logged in');
  }
  
  // Check localStorage session
  const sessionData = {
    token: localStorage.getItem('userToken'),
    email: localStorage.getItem('userEmail'),
    name: localStorage.getItem('userName'),
    role: localStorage.getItem('userRole'),
    id: localStorage.getItem('userId')
  };
  console.log('🔑 LocalStorage session:', sessionData);
  
  return { currentUser, sessionData };
};

export const clearFirebaseSession = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  console.log('🧹 Firebase session cleared from localStorage');
};
