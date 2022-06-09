// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configurationnpm install firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1zRPN--WuqjTPdmaVFZNfAPhu5iS6OX0",
  authDomain: "social-media-d0b2b.firebaseapp.com",
  projectId: "social-media-d0b2b",
  storageBucket: "social-media-d0b2b.appspot.com",
  messagingSenderId: "451093713751",
  appId: "1:451093713751:web:172954faec7d4147586412",
  measurementId: "G-ESC2THQR2Z",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
 
