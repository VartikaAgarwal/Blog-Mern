import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API, 
  authDomain: "blog-mern-ab090.firebaseapp.com",
  projectId: "blog-mern-ab090",
  storageBucket: "blog-mern-ab090.appspot.com",  
  messagingSenderId: "986250772523",
  appId: "1:986250772523:web:e764912534c72e3720ea6e",
  measurementId: "G-N3PNN13HTW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
auth.useDeviceLanguage(); 

const provider = new GoogleAuthProvider();

export { auth, provider };
