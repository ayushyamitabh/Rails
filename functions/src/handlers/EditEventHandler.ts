import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function editevent (req, res) {
    /*
        {
            eventUid: 'someeventuid',
            classUid: 'someclassuid',
            uid: '0wRfHGZTvPe6Vpfzcl1eHwIvE9v2',
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

    function updateEvent(classUid, eventUid, eventData) {
        admin.database().ref(`events/${classUid}/${eventUid}`)
        .update(eventData)
        .then(() => {
            return res.status(200).send({message: 'Updated event.'});
        })
        .catch((err) => {
            err.whereInApi = 'EditEventHandler/updateEvent';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function verifyEvent(classUid, eventUid, eventData) {
        admin.database().ref(`events/${classUid}/${eventUid}`)
        .once('value')
        .then((eventSnap) => {
            const snapData = eventSnap.val();
            if (snapData) {
                if (snapData.instructorUid === eventData.instructorUid) {
                    delete snapData.instructorUid;
                    delete snapData.instructorName;
                    if (snapData === eventData) return res.status(202).send({message: 'No changed data.'});
                    else updateEvent(classUid, eventUid, eventData);
                } else {
                    return res.status(403).send({message: 'Not authorized.'});
                }
            } else {
                return res.status(404).send({message: 'Event not found.'});
            }
        })
        .catch((err) => {
            err.whereInApi = 'EditEventHandler/verifyEvent';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    return cors(req, res, () => {
    const { eventUid, classUid, uid, eventData } = req.body;
    admin.database().ref(`users/${uid}`)
    .once('value')
    .then((userSnap) => {
        const userData = userSnap.val();
        if (userData) {
            if (userData.type === 'teacher') {
                if (eventUid && classUid && validateData(eventData)) {
                    eventData.instructorUid = uid;
                    verifyEvent(classUid, eventUid, eventData);
                } else {
                    return res.status(400).send({message: 'Missing data.'});
                }
            } else {
                return res.status(403).send({message: 'Not authorized.'});
            }
        } else {
            return res.status(404).send({message: 'User not found'});
        }
    })
    .catch((err) => {
        err.whereInApi = 'EditEventHandler/cors';
        return res.status(406).send({message: 'Something went wrong', error: err});
    });
    });
}
