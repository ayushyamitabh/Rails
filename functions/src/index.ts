import { handlers } from "./handlers";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as serviceAccount from "../rails-private-key.json";

admin.initializeApp({
  credential: admin.credential.cert(<any>serviceAccount),
  databaseURL: "https://rails-students.firebaseio.com"
});

export const signup = functions.https.onRequest((req, res) => {
  handlers.signup(req, res);
});

export const createclass = functions.https.onRequest((req, res) => {
  handlers.createclass(req, res);
});

export const joinclass = functions.https.onRequest((req, res) => {
  handlers.joinclass(req, res);
});

export const getclasses = functions.https.onRequest((req, res) => {
  handlers.getclasses(req, res);
});

export const requestclass = functions.https.onRequest((req, res) => {
  handlers.requestclass(req, res);
});

export const approveclass = functions.https.onRequest((req, res) => {
  handlers.approveclass(req, res);
});

export const getprofile = functions.https.onRequest((req, res) => {
  handlers.getprofile(req, res);
});

export const createevent = functions.https.onRequest((req, res) => {
  handlers.createevent(req, res);
});

export const editevent = functions.https.onRequest((req, res) => {
  handlers.editevent(req, res);
});

export const getclassdetails = functions.https.onRequest((req, res) => {
  handlers.getclassdetails(req, res);
});

export const geteventdetails = functions.https.onRequest((req, res) => {
  handlers.geteventdetails(req, res);
});

export const editclass = functions.https.onRequest((req, res) => {
  handlers.editclass(req, res);
});

export const dropclass = functions.https.onRequest((req, res) => {
  handlers.dropclass(req, res);
});

export const addmessage = functions.https.onRequest((req, res) => {
  handlers.addmessage(req, res);
});
