const cors = require('cors')({origin: true});
const admin = require('firebase-admin');

exports.handler = function (req, res) {
    /*
    =======
    REQUEST
    =======
    {
      universityName: 'College Name'
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
    const {universityName} = req.body;
    if (!universityName) {
      res.status(400).send({message: 'Missing fields'});
    } else {
      admin.database().ref(`universities/${universityName}`)
      .once('value')
      .then((snap) => {
        if (snap.val()) {
          const uniData = snap.val();
          var processedData = {};
          Object.keys(uniData).forEach((key)=>{
            const { approvedEmails, description, instructorName, meetingTimes, name } = uniData[key];
            processedData[key] = {approvedEmails, description, instructorName, meetingTimes, name};
          });
          return res.status(200).send({message: 'Classes found.', classList: processedData});
        } else {
          return res.status(300).send({message: `No classes found for ${universityName}`});
        }
      }).catch((err) => {
        res.status(400).send({message: 'Something went wrong', error: err});
      });
    }
  });
}
