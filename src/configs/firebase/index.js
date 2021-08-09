const firebase = require("firebase-admin");
const firebaseConfig = require("./mythical-mason-145813-firebase-adminsdk-zeppi-c178a3803e.json");
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL:
    "https://mythical-mason-145813-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const db = firebase.firestore();

module.exports = {
  db,
};
