import * as admin from "firebase-admin";
import * as _cors from "cors";

const cors = _cors({ origin: true });

export function editclass(req, res) {
  /*
        {
            university: 'CUNY City College',
            classUid: 'someclassuid',
            uid: 'someuseruid',
            classData: {
                approvedEmail: [],
                description: "name of class",
                meetingDays: {},
                meetingTimes: {},
                name: "course code",
                pendingEmails: []
            }
        }
    */

  function validateData(classData) {
    const { description, meetingDays, meetingTimes, name } = classData;
    return description && meetingDays && meetingTimes && name;
  }

  function updateClassDetails(query) {
    const { university, classUid, classData } = query;
    admin
      .database()
      .ref(`universities/${university}/${classUid}`)
      .update(classData)
      .then(() => {
        return res.status(200).send({ message: "Updated class details." });
      })
      .catch(err => {
        err.whereInApi = "EditClassHandler/updateClassDetails";
        return res
          .status(406)
          .send({ message: "Something went wrong", error: err });
      });
  }

  return cors(req, res, () => {
    const { university, classUid, uid, classData } = req.body;
    if (university && classUid && uid && validateData(classData)) {
      admin
        .database()
        .ref(`universities/${university}/${classUid}`)
        .once("value")
        .then(classSnap => {
          const classSnapData = classSnap.val();
          if (classSnapData) {
            if (classSnapData.instructorUid === uid) {
              delete classSnapData.instructorUid; //delete instrutorUid, and instrutorname data because it's not used to compare.
              delete classSnapData.instructorName;
              if (classSnapData === classData)
                return res.status(202).send({ message: "No changed data" });
              else updateClassDetails(req.body);
            } else {
              return res.status(403).send({ message: "Not authorized" });
            }
          } else {
            return res.status(404).send({ message: "Class not found." });
          }
        })
        .catch(err => {
          err.whereInApi = "EditClassHandler/cors";
          return res
            .status(406)
            .send({ message: "Something went wrong", error: err });
        });
    } else {
      return res.status(400).send({ message: "Missing data." });
    }
  });
}
