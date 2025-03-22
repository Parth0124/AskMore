import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1D5QAmeVWBjIww1IG80CXSFUHnowVZ14",
  authDomain: "chatbot-dd0a9.firebaseapp.com",
  projectId: "chatbot-dd0a9",
  storageBucket: "chatbot-dd0a9.firebasestorage.app",
  messagingSenderId: "171534064155",
  appId: "1:171534064155:web:eb6f0a073750c2fe7fb6be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);