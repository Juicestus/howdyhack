import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { defaultUserData } from './data/Types';

// require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FB_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FB_MESSAGE_SENDER_ID,
    appId: process.env.REACT_APP_FB_APP_ID,
};

console.log(firebaseConfig)

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

export const updateTopic = async (uid: string, topicName: string, updatedTopic: any) => {
  await db.collection(uid).doc(topicName).update(updatedTopic);
}

// export const updateSubtopic = async (uid: string, topicName: string, subtopicName: string, updatedSubtopic: any) => {
//   await db.collection(uid).doc(topicName).update({
//     subtopics: {
//       ...subtopics,
//       [subtopicName]: updatedSubtopic
//     }
//   });
// }