// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_pFI7xd8Ui0u4NXVBJdvF2Ok1PpCBRsk",
  authDomain: "kadircloudcom.firebaseapp.com",
  projectId: "kadircloudcom",
  storageBucket: "kadircloudcom.firebasestorage.app",
  messagingSenderId: "836361866580",
  appId: "1:836361866580:web:204e684d070ae16eac4cc1",
  measurementId: "G-TM4S1KMHYG"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only on client side
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
  });
}

// Initialize Auth with error handling
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  // Configure Google provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  console.log('✅ Firebase Client SDK başarıyla başlatıldı');
} catch (error) {
  console.error('❌ Firebase Client SDK başlatma hatası:', error);
}

export { app, analytics, auth, db, googleProvider };
