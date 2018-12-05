import * as admin from 'firebase-admin';
import * as _cors from 'cors';

const cors = _cors({origin: true});

export function signup (req, res) {
  /*
  {
    email: '1@email.com',
    name: 'Full Name',
    password: 'topsecret',
    type: 'student // EITHER 'student' or 'teacher' -- ALL SMALL CASE
    test: true // will delete user after creation if true
  }
  */

  function removeFromDatabase(uid) {
    admin.database().ref(`users/${uid}`)
    .remove()
    .then(() => {
      return res.status(200).send({message: 'Signed up and deleted user successfully'});
    }).catch((err) => {
      err.whereInApi = 'SingupHandler/removeUser';
      res.status(406).send({message: 'Something went wrong.', error: err});
    });
  }

  function removeUser(uid) {
    admin.auth().deleteUser(uid).then(() => {
      removeFromDatabase(uid);
    }).catch((err) => {
      err.whereInApi = 'SingupHandler/removeUser';
      res.status(406).send({message: 'Something went wrong.', error: err});
    });
  }

  function addToDatabase(uid, type, query) {
    const { test } = query;
    admin.database().ref(`users/${uid}`).set({type: type})
    .then(()=> {
      if (test || test === 'true' || test === true) {
        removeUser(uid);
      } else return res.status(200).send({message: 'Signed up successfully'});
    }).catch((err) => {
      err.whereInApi = 'SingupHandler/addToDatabase';
      res.status(406).send({message: 'Something went wrong.', error: err});
    });
  }

  return cors(req, res, () => {
    const { name, email, password, type } = req.body;
    if (!(name && email && password && type)) {
      res.status(400).send({message: 'Missing fields.'});
    } else {
      admin.auth().createUser({
        email: email,
        displayName: name,
        password: password
      }).then((user) => {
        if (user) {
          addToDatabase(user.uid, type, req.body);
        } else {
          return res.status(409).send({message: 'User created, but couldn\'t be fetched.'});
        }
      }).catch((err) => {
        err.whereInApi = 'SingupHandler/cors';
        res.status(406).send({message: 'Something went wrong.', error: err});
      });
    }
  });
}
