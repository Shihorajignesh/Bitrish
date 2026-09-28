import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {


  apiKey: "AIzaSyDT6oYxs7Io4XHJh1PUVRDZA9Nd-Ar0rOc",
  authDomain: "biterush-web.firebaseapp.com",
  projectId: "biterush-web",
  storageBucket: "biterush-web.firebasestorage.app",
  messagingSenderId: "721497427795",
  appId: "1:721497427795:web:622ffcde7de632631b1ba6",
  measurementId: "G-V0D5M6C34J"
};
  // Firebase Consoleમાંથી COPY કરેલું exact config

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;