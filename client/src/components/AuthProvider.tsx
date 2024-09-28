import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../FirebaseClient";
import firebase from 'firebase/compat/app';
import  'firebase/compat/auth';
import 'firebase/compat/firestore';

export const AuthProvider = ({ children }: { children: React.ReactNode; }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};