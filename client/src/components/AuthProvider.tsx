import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../FirebaseClient";
import firebase from 'firebase/compat/app';
import  'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode; }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        navigate('/signin');
      }
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};