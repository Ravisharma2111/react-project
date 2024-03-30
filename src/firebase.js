import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA7xV7_j6SZQZkyqXJ2scSigXeCi8NOifE",
    authDomain: "react-demo-e85fe.firebaseapp.com",
    databaseURL: 'https://react-demo-e85fe-default-rtdb.firebaseio.com',
    projectId: "react-demo-e85fe",
    storageBucket: "react-demo-e85fe.appspot.com",
    messagingSenderId: "559381023987",
    appId: "1:559381023987:web:41dd7b33fb29666a023b86"
}

firebase.initializeApp(config)
export default firebase;
