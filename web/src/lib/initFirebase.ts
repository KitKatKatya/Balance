import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  signInWithRedirect,
  type User,
} from "firebase/auth";

export function initFirebase() {
  const firebaseConfig = {
  apiKey: "AIzaSyAdg24vyh37b8k7Odw1lm537H823T5b7j8",
  authDomain: "feelings-b4f50.firebaseapp.com",
  projectId: "feelings-b4f50",
  storageBucket: "feelings-b4f50.appspot.com",
  messagingSenderId: "163419273883"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function loginWithGoogle(): Promise<User | undefined> {
  const auth = getAuth();
  return setPersistence(auth, browserLocalPersistence)
    .then(async () => {
      if (auth.currentUser !== null) return auth.currentUser;

      const redirectResult = await getRedirectResult(auth);
      if (redirectResult !== null) return redirectResult.user;

      await signInWithRedirect(auth, new GoogleAuthProvider());
    });
}
