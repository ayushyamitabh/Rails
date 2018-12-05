const cron = require("node-cron");
const firebase = require("firebase-admin");
const fs = require("fs");
const log = require("simple-node-logger").createSimpleFileLogger(
  "backup-logger.log"
);
const express = require("express");
const app = express();
const _cors = require("cors");
const cors = _cors({ origin: true });
const serviceAccount = require("./rails-private-key.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://rails-students.firebaseio.com"
});

function backup() {
  const start = Date.now();
  log.info("Started backup...");
  firebase
    .database()
    .ref("/")
    .once("value")
    .then(databaseSnap => {
      const data = databaseSnap.val();
      if (data) {
        const dataJson = JSON.stringify(data);
        if (fs.existsSync("database.json")) {
          log.info("Older copy of database exists");
          fs.unlinkSync("database.json");
          log.info("Older copy of database deleted");
        }
        fs.writeFileSync("database.json", dataJson, "utf8", err => {
          if (err) {
            log.error(
              "Failed to write to file\n" + JSON.stringify(err) + "\n"
            );
          } else log.info("Wrote latest copy to 'database.json'");
        });
      } else {
        log.warn("Got garbage value from Firebase.");
      }
      const duration = Date.now() - start;
      log.info(
        "Backup finished. Took " +
          duration +
          "ms\n============================================"
      );
    })
    .catch(err => {
      log.fatal(
        "Databse fetch failed with exception\n" + JSON.stringify(err) + "\n"
      );
      const duration = Date.now() - start;
      log.info(
        "Backup finished. Took " +
          duration +
          "ms\n============================================"
      );
    });
}

cron.schedule(
  "0 0-23 * * *",
  () => {
    log.info("AUTO BACKUP");
    backup();
  },
  {
    scheduled: true,
    timezone: "America/New_York"
  }
);

app.post("/", function(req, res) {
  return cors(req, res, () => {
    log.info("POST REQUEST at: '/'");
    res.send(
      'Server is up and running. Go here <a href="localhost:3000">to check server</a>'
    );
  });
});

app.post("/forcebackup", function(req, res) {
  log.info("MANUAL BACKUP");
  backup();
  res.status(200).send({ message: 'Started backup, check logs.'})
});

app.post("/logs", (req, res) => {
  return cors(req, res, () => {
    fs.readFile("backup-logger.log", (err, data) => {
      if (err) {
        log.warn("POST REQUEST at: '/logs' - Failed to read");
        res.status(400).send({ message: "Failed to read", err });
      } else {
        var arr = data.toString("utf8").split("\n");
        arr.forEach((item, index) => {
          arr[index] = item.replace("\r", "");
          arr[index] = item.trim();
        });
        log.info("POST REQUEST at: '/logs' - Got logs");
        res.status(200).send({ message: "Got logs.", logs: arr.reverse() });
      }
    });
  });
});

app.post("/backup", (req, res) => {
  return cors(req, res, () => {
    fs.readFile("database.json", (err, data) => {
      if (err) {
        log.warn("POST REQUEST at: '/backup' - Failed to read");
        res.status(400).send({ message: "Failed to read", err });
      } else {
        var arr = data.toString("utf8");
        arr = JSON.parse(arr);
        log.info("POST REQUEST at: '/backup' - Got backup data");
        res.status(200).send({ message: "Got backup data.", logs: arr });
      }
    });
  });
});

app.post("/verifyuser", (req, res) => {
  return cors(req, res, () => {
    const { idToken } = req.query;
    if (idToken) {
      firebase
        .auth()
        .verifyIdToken(idToken)
        .then(uid => {
          if (uid.uid === "OGocIfNVpdS51HzB56aYh29dyU23") {
            log.info("POST REQUEST at: '/verifyuser' - Logging in...");
            res.status(200).send({ message: "Logging in...", auth: true });
          } else {
            log.warn("POST REQUEST at: '/verifyuser' - Not authorized");
            res.status(403).send({ message: "Not authorized...", auth: false });
          }
        })
        .catch(err => {
          res
            .status(406)
            .send({ message: "Unable to verify user", auth: false });
        });
    } else {
      log.warn("POST REQUEST at: '/verifyuser' - Missing data");
      res.status(400).send({ message: "Missing data." });
    }
  });
});

app.listen(5000);
