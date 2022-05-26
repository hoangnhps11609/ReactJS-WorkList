import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDLtmDvYQsj1WqJ2nTrqtVgIZUTsjDCvjA",
    authDomain: "react-worklist.firebaseapp.com",
    databaseURL: "https://react-worklist-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "react-worklist",
    storageBucket: "react-worklist.appspot.com",
    messagingSenderId: "532978782014",
    appId: "1:532978782014:web:4f8e7d88b7212f8568a66f"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;