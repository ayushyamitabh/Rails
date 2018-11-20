import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function requestclass (req, res) {
    /*
        input = {
        universityName: 'CUNY City College',
        classUid: 'someclass-uid',
        studentEmail: 'student@email.com'
        }
    */
    function updatePendingList(query, pendingList) {
        const { universityName, classUid } = query;
        admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
        .set(pendingList)
        .then(()=>{
        return res.status(200).send({message: 'Requested permission.'});
        }).catch((err) => {
        res.status(400).send({message: 'Something went wrong updating to pending list.', error: err});
        });
    }

    function addToPendingList(query) {
        const { universityName, classUid, studentEmail } = query;
        admin.database().ref(`universities/${universityName}/${classUid}/pendingEmails`)
        .once('value')
        .then((snap) => {
        let pendingEmails = snap.val();
        if (pendingEmails) {
            pendingEmails.push(studentEmail);
        } else {
            pendingEmails = [studentEmail];
        }
        updatePendingList(query, pendingEmails);
        }).catch((err) => {
        res.status(400).send({message: 'Something went wrong adding to pending list.', error: err});
        });
    }

    return cors(req, res, () => {
        const { universityName, classUid, studentEmail } = req.body;
        if (!(universityName && classUid && studentEmail )) {
        res.status(400).send({message: 'Missing Fields'});
        } else {
        admin.database().ref(`universities/${universityName}/${classUid}`)
        .once('value')
        .then((snap) => {
            const classData = snap.val();
            if (classData) {
            if ( classData.approvedEmails && (classData.approvedEmails.indexOf(studentEmail) !== -1)) {
                return res.status(400).send({message: 'Already approved for class, try joining instead.'});
            } else if ( classData.pendingEmails && (classData.pendingEmails.indexOf(studentEmail) !== -1)) {
                return res.status(400).send({message: 'Already requested permission for this class.'});
            } else {
                addToPendingList(req.body);
            }
            } else {
            return res.status(400).send({message: 'Class is no longer available'});
            }
        })
        .catch((err) => {
            res.status(400).send({message: 'Something went wrong.', error: err});
        });
        }
    });
};
