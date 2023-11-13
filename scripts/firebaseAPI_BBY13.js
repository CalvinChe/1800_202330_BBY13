//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyDaxI5n1MqalbyFazW5UCz4LMfI3nQZgc0",
    authDomain: "comp1800-bby13-2023.firebaseapp.com",
    projectId: "comp1800-bby13-2023",
    storageBucket: "comp1800-bby13-2023.appspot.com",
    messagingSenderId: "607209074714",
    appId: "1:607209074714:web:63325703f59096915a61a3"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();