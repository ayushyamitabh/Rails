import React, { PureComponent } from 'react';
import {
  Button, Icon, Input, message, Card, Collapse,
} from 'antd';
import './Profile.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import { WithProtectedView } from '../../hoc';

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gotUserProfile: false,
      userData: null,
    };
    this.changePassword = this.changePassword.bind(this);
  }

  componentDidMount() {
    firebase.auth().currentUser
      .getIdToken(true)
      .then((idToken) => {
        const { uid } = firebase.auth().currentUser;
        const reqData = { uid, idToken };
        const profileData = fetch('https://us-central1-rails-students.cloudfunctions.net/getprofile', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        }).then((result) => {
          if (result.status === 200) {
            return result.json();
          }
          message.error(result.message);
        }).catch((err) => {
          console.log(err);
        });
        profileData.then((data) => {
          message.success(data.message);
          console.log(data.userData);
          this.setState({ userData: data.userData, gotUserProfile: true });
        });
      });
  }

  changePassword() {
    const { userData } = this.state;
    const oldPassword = document.getElementById('oldPasswordInput').value;
    const newPassword = document.getElementById('newPasswordInput').value;
    firebase.auth().signInWithEmailAndPassword(userData.email, oldPassword)
      .then((user) => {
        if (user) {
          firebase.auth().currentUser.updatePassword(newPassword).then(() => {
            message.success('Changed Password, please sign in again.', 1.5, () => { window.location = '/signout'; });
          }).catch((err) => {
            console.log(err);
          });
        }
      });
  }

  render() {
    const { userData, gotUserProfile } = this.state;
    return (
      <div className="profile-page">
        {
        gotUserProfile
          ? (
            <div className="profile-page">

              <Card
                className="profile-card"
                title="About You"
              >
                <Input className="cust-input" placeholder="Full Name" value={userData ? userData.displayName : ''} />
                <Input className="cust-input" placeholder="E-Mail" value={userData ? userData.email : ''} />
                <Input className="cust-input" placeholder="Old Password" id="oldPasswordInput" />
                <Input className="cust-input" placeholder="New Password" id="newPasswordInput" />
                <Button className="cust-button" type="primary" onClick={this.changePassword} block>Change Password</Button>
              </Card>
              <Card
                className="profile-card"
                title="Your Academics"
              >
                {
            userData.type === 'student'
              ? <Button style={{ marginBottom: 10 }} href="/join/class" type="primary" block>Join Class</Button>
              : <Button style={{ marginBottom: 10 }} href="/create/class" type="primary" block>Create Class</Button>
          }
                {
                Object.keys(userData.universities).length === 0
                  ? (
                    <p>You haven't joined any universities/classes yet.</p>
                  )
                  : (
                    <Collapse>
                      {
                    Object.keys(userData.universities).map(university => (
                      <Collapse.Panel header={university}>
                        {
                            Object.keys(userData.universities[university]).map(classUid => (
                              <Card
                                title={userData.universities[university][classUid].name}
                              >
                                <p>{userData.universities[university][classUid].description}</p>
                              </Card>
                            ))
                          }
                      </Collapse.Panel>
                    ))
                  }
                    </Collapse>
                  )
            }
              </Card>
            </div>
          )
          : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}
            >
              <Icon className="protected-view-loading" type="loading" theme="outlined" />
            </div>
          )
      }
      </div>
    );
  }
}

const ProtectedProfile = WithProtectedView(Profile);
export { Profile, ProtectedProfile };
