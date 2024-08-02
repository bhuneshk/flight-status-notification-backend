// Import the functions you need from the SDKs you need
const firebase = require('firebase-admin');
const { getMessaging } = require('firebase-admin/messaging');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var serviceAccount=require('./firebase-adminsdk.json');

// Initialize Firebase
const app=firebase.initializeApp({credential: firebase.credential.cert(serviceAccount)});
const messaging=getMessaging(app);
module.exports={messaging};