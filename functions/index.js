// =========================================================
// DON'T CHANGE IMPORTS / INITIALIZER
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const handlers = require('./Handlers');
var serviceAccount = require("./rails-private-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rails-students.firebaseio.com"
});
// ==========================================================

exports.signup = functions.https.onRequest((req, res) => {
  handlers.signup(req, res);
});

exports.createclass = functions.https.onRequest((req, res) => {
  handlers.createclass(req, res)
});

exports.joinclass = functions.https.onRequest((req, res) => {
  handlers.joinclass(req, res);
});

exports.getclasses = functions.https.onRequest((req, res) => {
  handlers.getclasses(req, res);
});

exports.requestclass = functions.https.onRequest((req, res) => {
  handlers.requestclass(req, res);
});

exports.approveclass = functions.https.onRequest((req, res) => {
  handlers.approveclass(req, res);
});
