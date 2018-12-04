import * as admin from "firebase-admin";
import * as _cors from "cors";

const cors = _cors({ origin: true });

export function dropclass(req, res) {

    /*
        {
            uid: 'useruid',
            email: 'useremail',
            classUid: 'classUid',
            university: 'CUNY City College',
            type: 'approved' // 'approved' or 'requested'
        }
    */

    function validateData(query) {
        const { uid, type, university, classUid } = query;
        return uid && type && university && classUid && (type === 'approved' || type === 'requested');
    }

    function updateClassData(query, classData) {
        const { university, classUid } = query;
        admin.database().ref(`universities/${university}/${classUid}`)
        .update(classData)
        .then(() => { 
            return res.status(200).send({message: 'Dropped class.'});
        })
        .catch((err) => {
            err.whereInApi = 'DropClassHandler/updateClassData';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function getClassData(query) {
        const { university, classUid, type, email } = query;
        admin.database().ref(`universities/${university}/${classUid}`)
        .once('value')
        .then((classSnap) => {
            const classData = classSnap.val();
            if (classData) {
                if (type === 'approved' && classData.approvedEmails) {
                    const classIndex = classData.approvedEmails.indexOf(email);
                    if (classIndex !== -1) {
                        classData.approvedEmails.splice(classIndex, 1);
                        updateClassData(query, classData);
                    } else {
                        return res.status(200).send({message: 'Dropped class.'});
                    }
                } else if (type === 'requested' && classData.pendingEmails) {
                    const classIndex = classData.pendingEmails.indexOf(email);
                    if (classIndex !== -1) {
                        classData.pendingEmails.splice(classIndex, 1);
                        updateClassData(query, classData);
                    } else {
                        return res.status(200).send({message: 'Dropped class.'});
                    }
                } else {
                    return res.status(200).send({message: 'Dropped class.'});
                }
            } else {
                return res.status(404).send({message: 'Class not found.'});
            }
        })
        .catch((err) => {
            err.whereInApi = 'DropClassHandler/getClassData';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    function updateUserData(query, userData) {
        const { uid } = query;        
        admin.database().ref(`users/${uid}`)
        .update(userData)
        .then(() => {
            getClassData(query);
        })
        .catch((err) => {
            err.whereInApi = 'DropClassHandler/updateUserData';
            return res.status(406).send({message: 'Something went wrong', error: err});
        });
    }

    return cors(req, res, ()=>{
        const { uid, type, university, classUid } = req.body;
        if (validateData(req.body)) {
            admin.database().ref(`users/${uid}`)
            .once('value')
            .then((userSnap) => {
                const userData = userSnap.val();
                if (userData) {
                    if (userData.type && userData.type === 'teacher') return res.status('406').send({message: 'To delete class please contact support.'})
                    else if (userData.type && userData.type === 'student') {
                        if (type === 'approved') {
                            const classIndex = userData.universities[university].indexOf(classUid);
                            if (classIndex !== -1) {
                                userData.universities[university].splice(classIndex, 1);
                                updateUserData(req.body, userData);
                            } else return res.status(404).send({message: 'Class not joined yet.'});
                        } else if (type === 'requested') {
                            const classIndex = userData.requested[university].indexOf(classUid);
                            if (classIndex !== -1) {
                                userData.requested[university].splice(classIndex, 1);
                                updateUserData(req.body, userData);
                            } else return res.status(404).send({message: 'Class not requested yet.'});
                        }
                    }
                } else {
                    return res.status(404).send({message: 'User not found.'});
                }
            })
            .catch((err) => {
                err.whereInApi = 'DropClassHandler/cors';
                return res.status(406).send({message: 'Something went wrong', error: err});
            });
        } else {
            return res.status(400).send({message: 'Missing data'});
        }
    });

}
