import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD6j8HprfPrfdUDTm8hHnN-jtf76i1e5CM",
  authDomain: "blog-website-580fd.firebaseapp.com",
  projectId: "blog-website-580fd",
  storageBucket: "blog-website-580fd.appspot.com",
  messagingSenderId: "690662911458",
  appId: "1:690662911458:web:dc9c56b9936e56e6291dbb",
  measurementId: "G-VZGWGM5XTC"
};
let firebaseApp;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

export default firebaseApp;

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const firestore = firebase.firestore();
export const increment = firebase.firestore.FieldValue.increment;

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export async function getUserWithUsername(username) {
  let ref = firestore.collection('users');
  let query = ref.where('username', '==', username).limit(1);
  let doc = (await query.get()).docs[0];
  return doc;
}

export function postToJSON(doc) { // Some types like firebase timestamp are not JSON serializable
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}