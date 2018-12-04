import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function getclasses (req, res) {
    /*
    =======
    REQUEST
    =======
    {
      universityName: 'College Name',
      userEmail: 'user@email.com',
    }
    ========
    RESPONSE
    ========
    {
      classUniqueId : {
        name: 'CSC 59939(L)',
        instructorName: 'John Doe',
        approvedEmails: [ '1@email.com', '2@email.com' ]
      },
      classUniqueId2 : {
        name: 'CSC 30100 (GH)',
        instructorName: 'Jim Halpert',
        approvedEmails: [ '3@email.com', '4@email.com' ]
      },
    }
  */
  return cors(req, res, () => {
    const {universityName, userEmail} = req.body;
    if (!universityName || !userEmail) {
      res.status(400).send({message: 'Missing fields'});
    } else {
      admin.database().ref(`universities/${universityName}`)
      .once('value')
      .then((snap) => {
        if (snap.val()) {
          const uniData = snap.val();
          const processedData = {};
          Object.keys(uniData).forEach((key)=>{
            const { description, instructorName, meetingTimes, name, meetingDays } = uniData[key];
            let approved = false;
            if (uniData[key].approvedEmails) {
              if (uniData[key].approvedEmails.indexOf(userEmail) !== -1) approved = true;
            }
            const temp = { approved, description, instructorName, meetingTimes, name, meetingDays };
            processedData[key] = temp;
          });
          return res.status(200).send({message: 'Classes found.', classList: processedData});
        } else {
          return res.status(404).send({message: `No classes found for ${universityName}`});
        }
      }).catch((err) => {
        err.whereInApi = 'GetClassesHandler/cors';
        res.status(406).send({message: 'Something went wrong', error: err});
      });
    }
  });
}
