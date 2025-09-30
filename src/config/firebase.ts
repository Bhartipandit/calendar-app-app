import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHXOaXr5XtnarORYiU9Jn7oUMoNm3MWAA",
  authDomain: "calendar-app-2ff18.firebaseapp.com",
  projectId: "calendar-app-2ff18",
  storageBucket: "calendar-app-2ff18.firebasestorage.app",
  messagingSenderId: "905775695185",
  appId: "1:905775695185:web:1cef0155811d1ff6ce7f70",
  measurementId: "G-WDRHBM2HVM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
