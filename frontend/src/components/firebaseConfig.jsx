// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9T-ngQn5fC61FewPpxDpQ3Z8ABhcWIuw",
  // apiKey: process.env.,
  
  authDomain: process.env.REACT_AUTHDOMAIN,
  projectId: process.env.REACT_PROJECTID,
  storageBucket: process.env.REACT_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_MESSAGINGSENDERID,
  appId: process.env.REACT_APPID,
  measurementId: process.env.REACT_MEASUREMENTID,

};

// Initialize Firebase
console.log(firebaseConfig.authDomain)
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);

export default app;