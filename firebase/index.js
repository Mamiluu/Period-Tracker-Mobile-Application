// Import Firebase and related modules
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  sendEmailVerification,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, setDoc, doc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration - replace with your Firebase project's settings
const firebaseConfig = {
  apiKey: "AIzaSyDCyXIxCTVUg47CnbH-L7sceZ9lPG8oKVA",
  authDomain: "tracker-eed94.firebaseapp.com",
  projectId: "tracker-eed94",
  storageBucket: "tracker-eed94.appspot.com",
  messagingSenderId: "1082875479231",
  appId: "1:1082875479231:web:e8f72d1a300bd925e5f20a",
  measurementId: "G-JTTCJGC69C"
};

// Initialize Firebase app if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firestore
const firestore = getFirestore();

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(firebase.app(), {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Function to create a new user account, store user data in Firestore, and send verification email
export const registerUser = async ({ name, email, password, type, ...additionalData }) => {
  try {
    // Register user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
      name,
      email,
      type,
      ...additionalData,
      createdAt: serverTimestamp(),
    });

    // Send verification email
    await sendEmailVerification(user);
    return { success: true, user };
  } catch (error) {
    console.error('Error registering user:', error.message);
    return { success: false, message: error.message };
  }
};

// Function to log in an existing user with email verification check
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error('Email not verified. Please check your email to verify your account.');
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error logging in user:', error.message);
    return { success: false, message: error.message };
  }
};

// Function to get the current user info
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Function to log out the current user
export const logoutUser = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error.message);
    return { success: false, message: error.message };
  }
};

// Function to resend verification email if needed
export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    try {
      await sendEmailVerification(user);
      return { success: true, message: 'Verification email resent. Please check your inbox.' };
    } catch (error) {
      console.error('Error resending verification email:', error.message);
      return { success: false, message: error.message };
    }
  } else {
    return { success: false, message: 'User is either not logged in or already verified.' };
  }
};

// Export auth and firestore for use in other parts of the app
export { auth, firestore };
