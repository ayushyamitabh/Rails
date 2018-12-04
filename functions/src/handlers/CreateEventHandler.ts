import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function createevent (req, res) {
    /*
        {
            university: 'CUNY City College',
            classUid: '-LQ_3KhLHrb54nT_MvMB', // class uid
            uid: '0wRfHGZTvPe6Vpfzcl1eHwIvE9v2', // user uid
            eventData: {
                allowDiscussion: true, // true or false
                allowSubmission: false, // true of false
                description: 'Do this and this ... for the assignment..... ',
                dueDate: '2018-12-06T23:37:04.888Z', // iso string of date time
                postedDate: '2018-12-06T23:37:04.888Z', // iso string of date time
                priority: 1, // 0 - low, 1 - normal, 2 - high
                title: 'Essay Thing'
            }
        }
    */

    function validateData(eventData) {
        const { 
            allowDiscussion,
            allowSubmission,
            description,
            dueDate,
            postedDate,
            priority,
            title, 
            hasFile
        } = eventData;
        return (allowDiscussion !== null) &&
            (allowSubmission !== null) &&
            description &&
            dueDate &&
            postedDate &&
            (priority !== null) &&
            (hasFile !== null) &&
            title;
    }

    function addEvent (classUid, eventData) {
        admin.database().ref(`events/${classUid}`)
        .push(eventData)
        .then((snap) => {
            return res.status(200).send({message: 'Created event.', eventUid: snap.key});
        }, (err) => {
            err.whereInApi = 'CreateEventHandler/addEvent';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function verifyClass (classUid, eventData) {
        admin.database().ref(`universities/${req.body.university}/${classUid}`)
        .once('value')
        .then((classSnap) => {
            const classData = classSnap.val();
            if (classData) addEvent(classUid, eventData);
            else return res.status(404).send({message: 'Class not found.'})
        })
        .catch((err) => {
            err.whereInApi = 'CreateEventHandler/verifyClass';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function getInstructorName(classUid, eventData) {
        const { instructorUid } = eventData;
        admin.auth().getUser(instructorUid)
        .then((user) => {
            if (user) {
                eventData.instructorName = user.displayName;
                verifyClass(classUid, eventData);
            } else return res.status(404).send({message: 'Couldn\'t get user data.'});
        })
        .catch((err) => {
            err.whereInApi = 'CreateEventHandler/getInstructorName';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    return cors(req, res, () => {
        const { university, classUid, uid, eventData } = req.body;
        if (university && classUid && uid) {
            admin.database().ref(`users/${uid}`)
            .once('value')
            .then((userSnap) => {
                const userData = userSnap.val();
                if (userData) {
                    if (userData.type === 'teacher' && (userData.universities && (userData.universities[university].indexOf(classUid) !== -1)) ) {
                        if (validateData(eventData)) {
                            eventData.instructorUid = '';
                            eventData.instructorUid = uid;
                            getInstructorName(classUid, eventData);
                        } else {
                            return res.status(400).send({message: 'Missing event data'});
                        }
                    } else {
                        return res.status(403).send({message: 'Not authorized.'});
                    }
                } else {
                    return res.status(404).send({message: 'User not found'});
                }
            })
            .catch((err) => {
                err.whereInApi = 'CreateEventHandler/cors';
                return res.status(406).send({message: 'Something went wrong', error: err});
            });
        } else {
            return res.status(400).send({message: 'Missing data'});
        }
    });
}