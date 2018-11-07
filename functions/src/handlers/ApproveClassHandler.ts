import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function approveclass (req, res) {
    /*
    {
      universityName: 'CUNY City College',
      classUid: 'someclass-uid',
      studentEmail: 'student@email.com',
      uid: 'instructor=uid'
    }
    */
    function updateStudentProfile(query, uid, classList) {
        const { universityName } = query;
        admin.database().ref(`users/${uid}/universities/${universityName}`)
        .set(classList)
        .then(() => {
        return res.status(200).send({message: 'Approved and added student to class.'})
        })
        .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    function addToStudentProfile(query, uid) {
        const { universityName, classUid } = query;
        admin.database().ref(`users/${uid}/universities/${universityName}`)
        .once('value')
        .then((snap) => {
        let classList = snap.val();
        if (classList) {
            classList.push(classUid);
        } else {
            classList = [classUid];
        }
        updateStudentProfile(query, uid, classList);
        })
        .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    function getStudentProfile(query) {
        const { studentEmail } = query;
        admin.auth().getUserByEmail(studentEmail)
        .then((user) => {
        if (user) {
            addToStudentProfile(query, user.uid);
        } else {
            return res.status(400).send({message: 'Student account not found.'});
        }
        })
        .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    function updateApprovedList(query, emailList) {
        const { universityName, classUid } = query;
        admin.database().ref(`universities/${universityName}/${classUid}/approvedEmails`)
        .set(emailList)
        .then(()=>{
        getStudentProfile(query);
        })
        .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    function addToApprovedList(query) {
        const { universityName, classUid, studentEmail } = query;
        admin.database().ref(`universities/${universityName}/${classUid}/approvedEmails`)
        .once('value')
        .then((snap)=>{
        let approvedEmails = snap.val();
        if (approvedEmails) {
            approvedEmails.push(studentEmail);
        } else {
            approvedEmails = [studentEmail];
        }
        updateApprovedList(query, approvedEmails);
        })
        .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    function updatePendingList(query, emailList) {
        const { universityName, classUid } = query;
        admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
        .set(emailList)
        .then(()=>{
        addToApprovedList(query);
        })
        .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
        });
    }

    function addToPendingList(query) {
        const { universityName, classUid, studentEmail } = query;
        admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
        .once('value')
        .then((snap) => {
        const pendingEmails = snap.val();
        if (pendingEmails) {
            const emailIndex = pendingEmails.indexOf(studentEmail);
            if ( emailIndex !== -1) {
            pendingEmails.splice(emailIndex, 1);
            updatePendingList(req.body, pendingEmails);
            } else {
            return res.status(400).send({message: 'Student email not found.'});
            }
        } else {
            return res.status(400).send({message: 'Couldn\'t get class details.'});
        }
        })
        .catch((err) => {
        return res.status(400).send({message: 'Something went wrong', error: err});
        });
    }
    
    return cors(req, res, () => {
        const { universityName, classUid, studentEmail, uid } = req.body;
        if (!(universityName && classUid && studentEmail && uid)) {
        return res.status(400).send({message: 'Missing fields'});
        } else {
        admin.database().ref(`users/${uid}/type`)
        .once('value')
        .then((snap) => {
            const userType = snap.val();
            if (userType) {
            if (userType === 'teacher') {
                addToPendingList(req.body);
            } else {
                return res.status(400).send({message: 'User can\'t approve emails (not teacher).'})
            }
            } else {
            return res.status(400).send({message: 'User not found - UID may be wrong.'});
            }
        })
        .catch((err) => {
            return res.status(400).send({message: 'Something went wrong', error: err});
        });
        }    
    });
}