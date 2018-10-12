import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
const config = {
    apiKey: "AIzaSyDHa2E9E4xuExZFqdoxX-4Ehwh7qMzTPew",
    authDomain: "rails-students.firebaseapp.com",
    databaseURL: "https://rails-students.firebaseio.com",
    projectId: "rails-students",
    storageBucket: "rails-students.appspot.com",
    messagingSenderId: "927373339672"
};
firebase.initializeApp(config);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
