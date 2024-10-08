import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// onAuthStateChanged
import { onAuthStateChanged } from 'firebase/auth';
// init createUserWithEmailAndPassword 
import { createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSwC4aRogXPA9_NUkFdCB4tUZ5BtAMpyw",
  authDomain: "healbot-f0da2.firebaseapp.com",
  projectId: "healbot-f0da2",
  storageBucket: "healbot-f0da2.appspot.com",
  messagingSenderId: "209302563551",
  appId: "1:209302563551:web:54b61ac26e4291a72dd76a"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const realTimeDb = getDatabase(app);
const firestoreDb = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const onAuthState = onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in');
    console.log(user.email)
  } else {
    console.log('User is signed out');
  }
}
);

export { realTimeDb, firestoreDb, storage, auth, createUserWithEmailAndPassword, onAuthState};