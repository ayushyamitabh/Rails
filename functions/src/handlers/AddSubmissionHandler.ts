import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function addsubmission(req, res) {
    /*
        {
            university: 'CUNY City College',
            classUid: 'some class uid',
            eventUid: 'some event uid',
            uid: 'user uid',
            name: 'user name',
            email: 'user email',
            fileName: 'adslkf.pdf',
            fileUrl: 'dlkfajlkfj',
        }
    */

    function validateData(query) {
        const { university, classUid, email, uid, name, eventUid, fileName, fileUrl } = query;
        return university &&
            classUid &&
            email &&
            uid &&
            name &&
            fileName &&
            fileUrl &&
            eventUid;
    }

    function updateEvent(query, eventData) {
        const { classUid, eventUid } = query;
        admin.database().ref(`events/${classUid}/${eventUid}`)
        .update(eventData)
        .then(() => {
            return res.status(200).send({message: 'Added submission.'})
        })
        .catch((err) => {
            err.whereInApi = 'AddMessageHandler/updateEvent';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }
    
    function getEvent(query) {
        const { classUid, eventUid, fileName, fileUrl } = query;
        admin.database().ref(`events/${classUid}/${eventUid}`)
        .once('value')
        .then((eventSnap) => {
            const eventData = eventSnap.val();
            if (eventData) {
                if (eventData.submissions) {
                    let found = false;
                    eventData.submissions.forEach((sub, i) => {
                        if (sub.fileName === fileName) {
                            found = true;
                            eventData.submissions[i] = { fileName, fileUrl };
                        }
                    });
                    if (!found) eventData.submissions.push({ fileName, fileUrl });
                } else {
                    eventData.submissions = [{ fileName, fileUrl }];
                }
                updateEvent(query, eventData);
            } else {
                return res.status(404).send({message: 'Event not found'});
            }
        })
        .catch((err) => {
            err.whereInApi = 'AddMessageHandler/getEvent';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function verifyPermission(query) {
        const { university, classUid, email, uid } = query;
        admin.database().ref(`universities/${university}/${classUid}/`)
        .once('value')
        .then((classSnap) => {
            const classData = classSnap.val();
            const emails = classData.approvedEmails;
            if (classData && emails) {
                if ((emails.indexOf(email) !== -1)) getEvent(query);
                else return res.status(403).send({message: 'Not authorized to comment on this event.'})
            } else if (classData.instructorUid === uid) {
                return res.status(404).send({message: 'Instructors can\'t submit response to their own event.'});
            } else {
                return res.status(404).send({message: 'Class not found'});
            }
        })
        .catch((err) => {
            err.whereInApi = 'AddMessageHandler/verifyPermission';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    return cors (req, res, () => {
        const { classUid, eventUid } = req.body;
        if (validateData(req.body)) {
            admin.database().ref(`events/${classUid}/${eventUid}`)
            .once('value')
            .then((eventSnap) => {
                const eventData = eventSnap.val();
                if (eventData) {
                    if (eventData.allowSubmission) verifyPermission(req.body);
                    else return res.status(403).send({message: 'Submission disabled for this event.'});
                } else {
                    return res.status(404).send({message: 'Event not found'});
                }
            })
            .catch((err) => {
                err.whereInApi = 'AddSubmissionHandler/cors';
                return res.status(406).send({message: 'Something went wrong', error: err});
            });
        } else {
            return res.status(400).send({message: 'Missing data.'});
        }
    });

}
