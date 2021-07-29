import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import 'firebase/storage';



const config = {
    apiKey: "xxx",
    authDomain: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx",
    measurementId: "xxx",
  }


const firebase = Firebase.initializeApp(config);
  
const  {FieldValue}  = Firebase.firestore;


const auth = Firebase.auth()

const storage= Firebase.storage()





export { firebase, FieldValue, auth, storage };