import { getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getStorage ,ref} from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyDd5oEn5aOQoartNT0ZHZ2r3Q1u9mOzV30",
    authDomain: "todolist-76b81.firebaseapp.com",
    projectId: "todolist-76b81",
    storageBucket: "todolist-76b81.appspot.com",
    messagingSenderId: "9086912651",
    appId: "1:9086912651:web:7de30a32c87e73d636ac8e",
    measurementId: "G-8Q7SC219HT"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  
  export { db, storage,ref };