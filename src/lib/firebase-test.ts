// Firebase configuration test
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_pFI7xd8Ui0u4NXVBJdvF2Ok1PpCBRsk",
  authDomain: "kadircloudcom.firebaseapp.com",
  projectId: "kadircloudcom",
  storageBucket: "kadircloudcom.firebasestorage.app",
  messagingSenderId: "836361866580",
  appId: "1:836361866580:web:204e684d070ae16eac4cc1",
  measurementId: "G-TM4S1KMHYG"
};

// Test Firebase initialization
export const testFirebaseConfig = () => {
  try {
    console.log("Testing Firebase configuration...");
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log("✅ Firebase app initialized successfully");
    
    // Test Auth
    const auth = getAuth(app);
    console.log("✅ Firebase Auth initialized successfully");
    console.log("Auth domain:", auth.config.authDomain);
    
    // Test Firestore
    const db = getFirestore(app);
    console.log("✅ Firestore initialized successfully");
    
    return { success: true, app, auth, db };
  } catch (error) {
    console.error("❌ Firebase configuration error:", error);
    return { success: false, error };
  }
};
