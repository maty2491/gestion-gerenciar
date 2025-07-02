// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfVYLreR4OZ_PBns6uiNEPwKeutJDFp0s",
  authDomain: "empleados-gerenciar.firebaseapp.com",
  projectId: "empleados-gerenciar",
  storageBucket: "empleados-gerenciar.appspot.com",
  messagingSenderId: "654552573055",
  appId: "1:654552573055:web:b5d50f5093da232eac8b4a",
  measurementId: "G-J2HLHLYKPS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };