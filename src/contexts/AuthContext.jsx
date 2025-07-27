// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut as firebaseSignOut, } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (firebaseUser) => {
    const handleUser = async () => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        await setDoc(userRef, {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          lastLogin: new Date()
        }, { merge: true });
      } else {
        setUser(null);
      }
    };

    handleUser(); // ✅ call the async wrapper
  });

  return unsub;
}, []);
  
  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}