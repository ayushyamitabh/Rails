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
    function populateEventsList(userData, universities) {
        admin.database().ref(`events`)
        .once('value')
        .then((eventsDataSnap) => {
            const eventsData = eventsDataSnap.val();
            if (eventsData) {
                Object.keys(universities).forEach((uni) => {
                    universities[uni].forEach((cuid) => {
                        userData.universities[uni][cuid].events = {}
                        if (eventsData[cuid]) {
                            Object.keys(eventsData[cuid]).forEach((ev) => {
                                delete eventsData[cuid][ev].instructorUid;
                            });
                            userData.universities[uni][cuid].events = eventsData[cuid];
                        }
                    });
                });
                res.status(200).send({message: 'Got user profile.', userData})
            } else {
                Object.keys(universities).forEach((uni) => {
                    universities[uni].forEach((cuid) => {
                        userData.universities[uni][cuid].events = {};
                    });
                });
                res.status(200).send({message: 'Got user profile.', userData});
            }
        })
        .catch((err) => {
            err.whereInApi = 'GetProfileHandler/populateEventsList';
            res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function populateUniversityData (userData, universities, requested) {
        admin.database().ref('universities')
        .once('value')
        .then((universitiesDataSnap) => {
            const universitiesData = universitiesDataSnap.val();
            if (universitiesData) {
                userData.universities = {};
                Object.keys(universities).forEach((uni) => {
                    userData.universities[uni] = {};
                    universities[uni].forEach((cuid) => {
                        if (universitiesData[uni] && universitiesData[uni][cuid]) {
                            userData.universities[uni][cuid] = {};
                            const { meetingDays, meetingTimes, instructorName, name, description } = universitiesData[uni][cuid];
                            userData.universities[uni][cuid] = { meetingDays, meetingTimes, instructorName, name, description };
                        }
                    });
                });
                userData.requested = {};
                Object.keys(requested).forEach((uni) => {
                    userData.requested[uni] = {};
                    requested[uni].forEach((cuid) => {
                        userData.requested[uni][cuid] = {};
                        if (universitiesData[uni] && universitiesData[uni][cuid]) {
                            const { meetingDays, meetingTimes, instructorName, name, description } = universitiesData[uni][cuid];
                            userData.requested[uni][cuid] = { meetingDays, meetingTimes, instructorName, name, description };
                        }
                    });
                });
                populateEventsList(userData, universities);
            } else {
                res.status(404).send({message: 'University data couldn\'t be found.'})
            }
        })
        .catch((err) => {
            err.whereInApi = 'GetProfileHandler/populateUniversityData';
            res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function getUserFromDatabase (query, userData) {
        const { uid } = query;
        admin.database().ref(`users/${uid}`)
        .once('value')
        .then((userDataSnap) => {
            const snapData = userDataSnap.val();
            if (snapData) {
                userData.type = snapData.type;
                populateUniversityData(userData, snapData.universities ? snapData.universities : {}, snapData.requested ? snapData.requested : {});
            }
            else return res.status(404).send({message: 'User not found in database.'});
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
