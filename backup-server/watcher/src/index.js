import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import App from "./App";
import "./Google-Sans/stylesheet.css";

const config = {
  apiKey: "AIzaSyDHa2E9E4xuExZFqdoxX-4Ehwh7qMzTPew",
  authDomain: "rails-students.firebaseapp.com",
  databaseURL: "https://rails-students.firebaseio.com",
  projectId: "rails-students",
  storageBucket: "rails-students.appspot.com",
  messagingSenderId: "927373339672"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));
