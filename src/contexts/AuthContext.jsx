import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ✅ Check if user's email is allowed
        const allowedRef = doc(db, "allowed_users", firebaseUser.email);
        const allowedSnap = await getDoc(allowedRef);

        if (allowedSnap.exists()) {
          setUser(firebaseUser);
        } else {
          // ❌ Not allowed
          alert("Sorry, you are not authorized to access this app.");
          await firebaseSignOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut: logout }}>
      {children}
    </AuthContext.Provider>
  );
}