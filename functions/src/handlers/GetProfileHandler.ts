import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function getprofile (req, res) {
    /*
    =======
    REQUEST
    =======
    {
        "uid": "users=uid=alkdfja",
        "idToken": "lakfsjlkafjsdlakfjsd" -- https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
    }
    ========
    RESPONSE
    ========
    {
        "message" : "User profile found",
        "userData" : {
            "displayName": "Full Name",
            "email": "fullname@email.com",
            "type": "student", -- student or teacher
            "universities": {
                "CUNY City College" : {
                    "classUid1" : {
                        "name": "CSC 59939 (L)",
                        "description" : "Topics In Software Engineering",
                        "instructorName" : "Teacher Name",
                        "meetingTimes" : {
                            "from": "18:30",
                            "to": "21:00"
                        },
                        "meetingDays" : {
                            "Monday": false,
                            "Tuesday": false,
                            "Wednesday": true,
                            "Thursday": false,
                            "Friday": false,
                            "Saturday": false,
                            "Sunday": false,
                        },
                        "events" : {
                            "eventUid" : {
                                "postedDate" : "2018-11-06T23:37:04.888Z",
                                "dueDate" : "2018-12-06T23:37:04.888Z",
                                "title" : "First Release",
                                "description" : "asdfkaljsdfas",
                                "priority" : 2,  -- 0 = low, 1 = normal, 2 = high
                            }
                        }
                    }
                }
            }
        }
    }
    */

    function getClassEvents(userData, classList) {
        admin.database().ref('events')
        .once('value')
        .then((snap) => {
            const eventsData = snap.val();
            if (eventsData) {
                Object.keys(classList).forEach((university) => {
                    classList[university].forEach((classUid) => {
                        userData.universities[university][classUid]['events'] = {};
                        userData.universities[university][classUid]['events'] = eventsData[classUid];
                    });
                });
                return res.status(200).send({message: 'Got user profile.', userData: userData});
            } else {
                return res.status(404).send({message: 'Error getting events'});
            }
        }).catch((err) => {
            err.whereInApi = 'GotProfileHandler/getClassEvents';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function getClassDetails(userData, classList) {
        admin.database().ref('universities')
        .once('value')
        .then((snap) => {
            const universitiesData = snap.val();
            userData.universities = {};
            if (universitiesData) {
                Object.keys(classList).forEach((university) => {
                    userData.universities[university] = {};
                    classList[university].forEach((classUid) => {
                        const { name, description, instructorName, meetingDays, meetingTimes } = universitiesData[university][classUid];
                        userData.universities[university][classUid] = { name, description, instructorName, meetingDays, meetingTimes };
                    });
                });
                getClassEvents(userData, classList);
            } else {
                return res.status(404).send({message: 'Error getting universities'});
            }
        }).catch((err) => {
            err.whereInApi = 'GotProfileHandler/getClassDetails';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function getUserFromDatabase(query, userData) {
        const { uid } = query;
        admin.database().ref(`users/${uid}`)
        .once('value')
        .then((snap) => {
            const userSnapData = snap.val();
            if (userSnapData) {
                userData['type'] = userSnapData.type;
                if (userSnapData.universities) {
                    getClassDetails(userData, userSnapData.universities);
                } else {
                    userData['universities'] = {};
                    return res.status(200).send({message: 'Got user profile.', userData: userData});
                }
            } else {
                return res.status(404).send({message: 'User not found.'});
            }
        }).catch((err) => {
            err.whereInApi = 'GetProfileHandler/getUserFromDatabase';
            res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function getUserData(query) {
        const { uid } = query;
        admin.auth().getUser(uid)
        .then((user)=>{
            const { displayName, email } = user;
            const userData = { displayName, email };
            getUserFromDatabase(query, userData);
        }).catch((err) => {
            err.whereInApi = 'GetProfileHandler/getUserData';
            res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    return cors(req, res, () => {
        const { idToken, uid } = req.body;
        admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            if (decodedToken.uid === uid) {
                getUserData(req.body);
            } else {
                return res.status(401).send({message: 'User authorization error'});
            }
        }).catch((err) => {
            err.whereInApi = 'GetProfileHandler/cors';
            res.status(406).send({message: 'Something went wrong', error: err});
        });
    });
}
