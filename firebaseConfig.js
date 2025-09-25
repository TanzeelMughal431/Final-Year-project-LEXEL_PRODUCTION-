import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyCYMZ9UB1-7VHb0S-4dljwCRyseez7pVAM",
  authDomain: "test-fa0bb.firebaseapp.com",
  databaseURL: "https://test-fa0bb-default-rtdb.firebaseio.com",
  projectId: "test-fa0bb",
  storageBucket: "test-fa0bb.appspot.com",
  messagingSenderId: "561498293587",
  appId: "1:561498293587:web:ea13657d619d56d4e90da6",
  measurementId: "G-X5L08VFC0R",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Realtime Database
const database = getDatabase(app);

export { auth, database };
