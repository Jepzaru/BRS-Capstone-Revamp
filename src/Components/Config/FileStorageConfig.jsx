import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCXVcPG1qRRa6Y6AeVlwFz1rI1ijVlBUJg",
    authDomain: "brs-capstone1-95836.firebaseapp.com",
    projectId: "brs-capstone1-95836",
    storageBucket: "brs-capstone1-95836.appspot.com",
    messagingSenderId: "158496660825",
    appId: "1:158496660825:web:e6875bd616906e8a788048",
    measurementId: "G-ZV3LW9L7G7"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
