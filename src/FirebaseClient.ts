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

export const getUserDB = async (uid: string) => {
  const data: any = {};
  await db.collection(uid).get().then(q => {
    q.forEach(doc => data[doc.id] = doc.data());
  });
  return data;
}

export const getTopic = async (uid: string, topicName: string) => {
  return (await db.collection(uid).doc(topicName).get()).data();
}

export const updateSubtopic = async (uid: string, topicName: string, subtopicName: string, updatedSubtopic: any) => {
  await db.collection(uid).doc(topicName).update({
    subtopics: {
      [subtopicName]: updatedSubtopic
    }
  });
}