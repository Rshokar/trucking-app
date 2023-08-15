// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBw_orl37OX48-9bmzkItQ-DH-l-66CK2E",
    authDomain: "tare-ticketing.firebaseapp.com",
    projectId: "tare-ticketing",
    storageBucket: "tare-ticketing.appspot.com",
    messagingSenderId: "86124734373",
    appId: "1:86124734373:web:e3efcd2ea9816214852a4c"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

