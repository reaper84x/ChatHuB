// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKyoFaGcziNQC82u3x4Rh2LvLTw_zfOBI",
    authDomain: "chathub-2d1c0.firebaseapp.com",
    projectId: "chathub-2d1c0",
    storageBucket: "chathub-2d1c0.appspot.com",
    messagingSenderId: "517159369714",
    appId: "1:517159369714:web:e217999e849bbbcaed096b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sign in anonymously
signInAnonymously(auth)
    .catch((error) => {
        console.error("Error signing in: ", error);
    });

// Send message function
document.getElementById('send-button').addEventListener('click', async function() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const user = auth.currentUser ; // Get the currently logged-in user

    if (message && user) {
        try {
            await addDoc(collection(db, 'messages'), {
                message: message,
                uid: user.uid, // Store user ID with the message
                timestamp: new Date() // Use current date as timestamp
            });
            messageInput.value = ''; // Clear input after sending
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
});

// Listen for new messages
const messagesRef = query(collection(db, 'messages'), orderBy('timestamp'));
onSnapshot(messagesRef, (snapshot) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear previous messages
    snapshot.forEach(doc => {
        const messageData = doc.data();
        const message = messageData.message;
        const userId = messageData.uid;
        messagesDiv.innerHTML += `<div>${userId}: ${message}</div>`; // Display user ID with message
    });
});