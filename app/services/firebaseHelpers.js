import * as firebase from 'firebase';
import config from './firebaseConfig';

export const initializeFirebase = () => {
  firebase.initializeApp(config);
};

export const getFirebaseDBRef = childName => {
  const childData = childName || 'test';
  return firebase.database().ref().child(childData);
};

export const getFirebaseAuth = childName => {
  return firebase.auth();
};
