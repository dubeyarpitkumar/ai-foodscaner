import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration.
export const firebaseConfig = {
  apiKey: "AIzaSyDu_qF5quY5tEIt02O2syFonCrV04I_mgY",
  authDomain: "aicaloryscan.firebaseapp.com",
  projectId: "aicaloryscan",
  storageBucket: "aicaloryscan.appspot.com",
  messagingSenderId: "280336752661",
  appId: "1:280336752661:web:5e4f953b55436701ec2e1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized services.
export { app, auth, db };