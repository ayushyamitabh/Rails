import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function addmessage(req, res) {
    /*
        {
            university: 'CUNY City College',
            classUid: 'some class uid',
            eventUid: 'some event uid',
            uid: 'user uid',
            name: 'user name',
            email: 'user email',
            message: 'lasdkjfla'
        }
    */

    function validateData(query) {
        const { university, classUid, email, uid, name, eventUid, message } = query;
        return university &&
            classUid &&
            email &&
            uid &&
            name &&
            message &&
            eventUid;
    }

    function updateDiscussion(query, discussionData) {
        const { classUid, eventUid } = query;
        admin.database().ref(`discussions/${classUid}/${eventUid}`)
        .update(discussionData)
        .then(() => {
            return res.status(200).send({message: 'Added comment.'})
        })
        .catch((err) => {
            err.whereInApi = 'AddMessageHandler/updateDiscussion';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }
    
    function getDiscussions(query) {
        const { classUid, eventUid, name, uid, message } = query;
        admin.database().ref(`discussions/${classUid}/${eventUid}`)
        .once('value')
        .then((discussionSnap) => {
            let discussionData = discussionSnap.val();
            if (discussionData) {
                discussionData.push({
                    message,
                    fromName: name,
                    fromUid: uid
                });
            } else {
                discussionData = [{
                    message,
                    fromName: name,
                    fromUid: uid
                }];
            }
            updateDiscussion(query, discussionData);
        })
        .catch((err) => {
            err.whereInApi = 'AddMessageHandler/getDiscussions';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function verifyPermission(query) {
        const { university, classUid, email } = query;
        admin.database().ref(`universities/${university}/${classUid}/approvedEmails`)
        .once('value')
        .then((emailSnap) => {
            const emails = emailSnap.val();
            if (emails) {
                if (emails.indexOf(email) !== -1) getDiscussions(query);
                else return res.status(403).send({message: 'Not authorized to comment on this event.'})
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
                    if (eventData.allowDiscussion) verifyPermission(req.body);
                    else return res.status(403).send({message: 'Discussion disabled for this event.'});
                } else {
                    return res.status(404).send({message: 'Event not found'});
                }
            })
            .catch((err) => {
                err.whereInApi = 'AddMessageHandler/cors';
                return res.status(406).send({message: 'Something went wrong', error: err});
            });
        } else {
            return res.status(400).send({message: 'Missing data.'});
        }
    });

}
