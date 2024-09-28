import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { defaultUserData } from './data/Types';

const firebaseConfig = {
    apiKey: "AIzaSyDHdT7OiEvVw2Y0hwRlQzAXzJaXrhp9Bjg",
    authDomain: "howdy-hack-24.firebaseapp.com",
    projectId: "howdy-hack-24",
    storageBucket: "howdy-hack-24.appspot.com",
    messagingSenderId: "156193936528",
    appId: "1:156193936528:web:975c565fdd1f65daec3415"
}; //this is where your firebase app values you copied will go

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const db = firebase.firestore();

export const createUserDB = (uid: string) => {

  for (const key in defaultUserData) {
    const topic = defaultUserData[key];
    const docref = db.collection(uid).doc(key);
    docref.set(topic);
  }

}