const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyAmE9Dj46JCombegJgTM1rZ7uPARjgmois",
  authDomain: "final-project-hacitv8.firebaseapp.com",
  databaseURL: "https://final-project-hacitv8.firebaseio.com",
  projectId: "final-project-hacitv8",
  storageBucket: "final-project-hacitv8.appspot.com",
  messagingSenderId: "1013314158402"
};

firebase.initializeApp(config);

module.exports = firebase;