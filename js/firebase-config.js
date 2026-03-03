// js/firebase-config.js

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCYbsxJO2aK2w9q7h1RfPPF4XHHCxWgFSg",
    authDomain: "fks-bondowoso.firebaseapp.com",
    databaseURL: "https://fks-bondowoso-default-rtdb.firebaseio.com",
    projectId: "fks-bondowoso",
    storageBucket: "fks-bondowoso.firebasestorage.app",
    messagingSenderId: "969039021236",
    appId: "1:969039021236:web:4307b05222ee13b68343e1"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Inisialisasi Database
const database = firebase.database();

// Simpan ke window global
window.database = database;

console.log('Firebase initialized:', database ? '✅' : '❌');