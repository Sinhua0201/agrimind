// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ 引入 Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeIu-Gd5lMzlSjtIrEnp5LgRpTR-1H5UI",
  authDomain: "agrimind-df754.firebaseapp.com",
  projectId: "agrimind-df754",
  storageBucket: "agrimind-df754.firebasestorage.app",
  messagingSenderId: "1003099915740",
  appId: "1:1003099915740:web:77592b71f2809c28b47b19",
  measurementId: "G-B2RGB1C62C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ✅ 初始化 Auth

// ✅ 导出 auth
export { auth };
