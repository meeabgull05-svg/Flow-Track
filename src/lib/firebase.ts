import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEGRrE4YVqKthOpMrp45TU_7NMkMwprTM",
  authDomain: "flowtrack-ff5db.firebaseapp.com",
  projectId: "flowtrack-ff5db",
  storageBucket: "flowtrack-ff5db.firebasestorage.app",
  messagingSenderId: "148358900047",
  appId: "1:148358900047:web:59917b9ff6e473af393d3a",
  measurementId: "G-EJGX81KWKN"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      name: user.displayName || user.email?.split('@')[0] || 'Google User',
      email: user.email || '',
      photoURL: user.photoURL || undefined,
    };
  } catch (error: any) {
    console.error("Firebase Google Auth Error:", error);
    return {
      success: false,
      error: error.message || "Failed to sign in with Google",
    };
  }
};

export default app;
