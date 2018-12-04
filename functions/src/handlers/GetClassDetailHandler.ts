import * as admin from "firebase-admin";
import * as _cors from "cors";

const cors = _cors({ origin: true });

export function getclassdetails(req, res) {
  /*
        {
            university: 'CUNY City College', 
            classUid: 'someclassuid',
            uid: 'some user uid'
        }
    */

  function validateData(query) {
    const { university, classUid, uid } = query;
    return university && classUid && uid;
  }

  function verifyUserType(query, classData) {
    const { uid, university, classUid } = query;
    admin
      .database()
      .ref(`users/${uid}`)
      .once("value")
      .then(userSnap => {
        const userData = userSnap.val();
        if (userData) {
          if (userData.type === "teacher") {
            if (
              userData.universities &&
              userData.universities[university] &&
              userData.universities[university].indexOf(classUid) !== -1 //-1 meaning not in array
            ) {
              return res
                .status(200)
                .send({ message: "Found class.", classData });
            } else {
              const {
                description,
                instructorName,
                meetingDays,
                meetingTimes,
                name
              } = classData;
              const studentClassData = {
                description,
                instructorName,
                meetingDays,
                meetingTimes,
                name
              };
              return res
                .status(200)
                .send({ message: "Found class.", classData: studentClassData });
            }
          } else if (userData.type === "student") {
            const {
              description,
              instructorName,
              meetingDays,
              meetingTimes,
              name
            } = classData;
            const studentClassData = {
              description,
              instructorName,
              meetingDays,
              meetingTimes,
              name
            };
            return res
              .status(200)
              .send({ message: "Found class.", classData: studentClassData });
          } else {
            res.status(403).send({ message: "Unable to verify user type" });
          }
        } else {
          return res.status(404).send({ message: "User not found." });
        }
      })
      .catch(err => {
        err.whereInApi = "GetClassDetailHandler/cors";
        return res
          .status(406)
          .send({ message: "Something went wrong", error: err });
      });
  }

  return cors(req, res, () => {
    if (validateData(req.body)) {
      const { university, classUid } = req.body;
      admin
        .database()
        .ref(`universities/${university}/${classUid}`)
        .once("value")
        .then(classSnap => {
          const classData = classSnap.val();
          if (classData) {
            verifyUserType(req.body, classData);
          } else {
            return res.status(404).send({ message: "Class not found." });
          }
        })
        .catch(err => {
          err.whereInApi = "GetClassDetailHandler/cors";
          return res
            .status(406)
            .send({ message: "Something went wrong", error: err });
        });
    } else {
      return res.status(400).send({ message: "Missing data." });
    }
  });
}
