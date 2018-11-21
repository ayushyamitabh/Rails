import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function createclass (req, res) {
    /*
    {
    "uid": "XCRZgzLysNOaI9pN8neyU5AQxiT2",
    "universityName": "CUNY City College",
    "classData": {
        "name": "CSC 59939 (L)",
        "description": "Topics in Software Engineering",
        "instructorUid": "XCRZgzLysNOaI9pN8neyU5AQxiT2",
        "instructorName": "Full Test Name",
        "approvedEmails": ["1@email.com", "2@email.com"],
        "meetingTimes": {
        "from": "18:30",
        "to": "21:00"
        },
        "meetingDays" : {
            "Monday": "false",
            "Tuesday": "false",
            "Wednesday": "true",
            "Thursday": "false",
            "Friday": "false",
            "Saturday": "false",
            "Sunday": "false"
        }
    }
    }
    */
  function setTeacherProfile(query, classList) {
    const { uid, universityName, classData } = query;
    admin.database().ref(`users/${uid}/universities/${universityName}`)
    .set(classList)
    .then(()=>{
      return res.status(200).send({message: `Created class ${classData.name}`});
    }).catch((err)=>{
      err.whereInApi = 'CreateClassHandler/setTeacherProfile';
      return res.status(406).send({message: 'Something went wrong updating teacher profile.', error: err});
    });
  }

  function addToTeacherProfile(query, pushKey) {
    const { uid, universityName } = query;
    admin.database().ref(`users/${uid}/universities/${universityName}`)
    .once('value')
    .then((snap)=>{
      let existingClasses = snap.val();
      if (existingClasses) {
        existingClasses.push(pushKey);
      } else {
        existingClasses = [pushKey];
      }
      setTeacherProfile(query, existingClasses);
    }).catch((err)=>{
      err.whereInApi = 'CreateClassHandler/addToTeacherProfile';
      res.status(406).send({message: 'Something went wrong adding to teacher profile.', error: err});
    });
  }

  function createClass(query) {
    const { universityName, classData } = query;
    admin.database().ref(`universities/${universityName}`)
    .push(classData)
    .then((pushData)=>{
      addToTeacherProfile(query, pushData.key);
    },(err)=>{
      err.whereInApi = 'CreateClassHandler/createClass';
      res.status(406).send({message: 'Something went wrong creating class.', error: err});
    });
  }

  return cors(req, res, () => {
    const { uid, universityName, classData } = req.body;
    if (!(uid && universityName && classData && classData.name && classData.description && classData.instructorName && classData.instructorUid && classData.meetingTimes && classData.meetingDays)) {
      res.status(400).send({message: 'Missing fields'});
    } else {
      admin.database().ref(`users/${uid}/type`)
      .once('value')
      .then((snap) => {
        const type = snap.val();
        if (type && (type === 'teacher')) {
          createClass(req.body);
        } else if (type && (type === 'student')) {
          return res.status(403).send({message: 'Not authorized to create class'});
        } else {
          return res.status(401).send({message: 'Can\'t authorize user.'});
        }
      }).catch((err)=>{
        err.whereInApi = 'CreateClassHandler/cors';
        res.status(406).send({message: 'Something went wrong.', error: err});
      });
    }
  });
}
