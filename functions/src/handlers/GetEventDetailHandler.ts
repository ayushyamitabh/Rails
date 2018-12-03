import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function geteventdetails(req, res) {

    /*
        {
            uid: 'useruid',
            eventUid: 'someeventuid',
            classUid: 'someclassuid',
        }
    */

    function validateData(query) {
        const { uid, eventUid, classUid } = query;
        return uid && eventUid && classUid;
    }

    function getEventDiscussion(query, userType, eventData) {
        const { eventUid, classUid, uid }  = query;
        admin.database().ref(`discussions/${classUid}/${eventUid}`)
        .once('value')
        .then((discussionSnap) => {
            const d = discussionSnap.val();
            eventData.discussions = [];
            if (d) {
                d.forEach((msg) => {
                    const { fromName, message } = msg;
                    eventData.discussions.push({fromName, message});
                });
            }
            if (userType === 'teacher' && (eventData.instructorUid === uid) ) {
                res.status(200).send({message: 'Found event', eventData});
            } else if (userType === 'student' || (userType === 'teacher' && (eventData.instructorUid !== uid))) {
                const { allowSubmission, allowDiscussion, description, dueDate, postedDate, priority, title, instructorName, discussions } = eventData;
                const ed = { allowSubmission, allowDiscussion, description, dueDate, postedDate, priority, title, instructorName, discussions };
                res.status(200).send({message: 'Found event', eventData: ed});
            } else {
                res.status(403).send({message: 'Unable to verify user type'});
            }
        })
        .catch((err) => {
            err.whereInApi = 'GetEventDetailHandler/getEventDiscussion';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function getEventData(query, userType) {
        const { classUid, eventUid } = query;
        admin.database().ref(`events/${classUid}/${eventUid}`)
        .once('value')
        .then((eventSnap) => {
            const eventData = eventSnap.val();
            if (eventData) {
                if (eventData.allowDiscussion) getEventDiscussion(query, userType, eventData);
                else {
                    eventData.discussions = [];
                    res.status(200).send({message: 'Found event', eventData});
                }
            } else return res.status(404).send({message: 'Event not found.'});
        })
        .catch((err) => {
            err.whereInApi = 'GetEventDetailHandler/getEventData';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    return cors(req, res, () => {
        if (validateData(req.body)) {
            const { uid } = req.body;
            admin.database().ref(`users/${uid}`)
            .once('value')
            .then((userSnap) => {
                const userData = userSnap.val();
                if (userData) {
                    getEventData(req.body, userData.type);
                } else {
                    res.status(404).send({message: 'User not found'});
                }
            })
            .catch((err) => {
                err.whereInApi = 'GetEventDetailHandler/cors';
                return res.status(406).send({message: 'Something went wrong', error: err});
            });
        } else {
            return res.status(400).send({message: 'Missing data.'});
        }
    });
}
