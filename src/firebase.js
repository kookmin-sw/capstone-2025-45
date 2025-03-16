import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔹 Firebase 프로젝트 설정
const firebaseConfig = {
  apiKey: "AIzaSyBht47SshlP__odjhozDHvalDVNXt80Qlc",
  authDomain: "capstone-vote.firebaseapp.com",
  projectId: "capstone-vote",
  storageBucket: "capstone-vote.firebasestorage.app",
  messagingSenderId: "561426459243",
  appId: "1:561426459243:web:5e59cc7c2083e30260df2e",
};

// 🔹 Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
