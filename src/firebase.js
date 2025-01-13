// // firebase.js
// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, getDoc , setDoc } from 'firebase/firestore';

// const firebaseConfig = {
//   // Your Firebase config
//   apiKey: process.env.APIKEY,
//   authDomain: process.env.AUTHDOMAIN,
//   projectId: process.env.PROJECTID,
//   storageBucket: process.env.STORAGEBUCKET,
//   messagingSenderId: process.env.MESSAGINGSENDERID,
//   appId: process.env.APPID
// };

// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
// const firestore = getFirestore(app);

// export { auth, firestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, getDoc, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged , setDoc};

// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, getDoc, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged, setDoc };
