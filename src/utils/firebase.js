import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyBTX_VcbcI0nLallzIAmlCOLMtZTLtik-8",
    authDomain: "prowashgo-firebase.firebaseapp.com",
    databaseURL: "https://prowashgo-firebase.firebaseio.com",
    projectId: "prowashgo-firebase",
    storageBucket: "prowashgo-firebase.appspot.com",
    messagingSenderId: "828220119316",
    appId: "1:828220119316:web:32cb867bf3f604ab5e0a01",
    measurementId: "G-K5L50QQHP9"
};

firebase.initializeApp(config);

export default firebase;