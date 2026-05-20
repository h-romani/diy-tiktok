import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5pHoafPz7GIccjQZ2tRV_gyAQlpZ_gN4",
  authDomain: "tiktok-diy.firebaseapp.com",
  projectId: "tiktok-diy",
  storageBucket: "tiktok-diy.firebasestorage.app",
  messagingSenderId: "827863952737",
  appId: "1:827863952737:web:8bbe61433d8d6c2dd82920"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);