import React, { PureComponent } from 'react';
import {
  Button, Icon, Input, message, Card, Collapse, List,
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
      oldPass: '',
      newPass: '',
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
          return null;
        }).catch((err) => {
          console.log(err);
        });
        profileData.then((data) => {
          message.success(data.message);
          this.setState({ userData: data.userData, gotUserProfile: true });
        });
      });
  }

  changePassword() {
    const { userData, oldPass, newPass } = this.state;
    if (oldPass.length < 6 || newPass.length < 6) {
      if (oldPass.length < 6) message.error('Wrong old password.', 3);
      else if (newPass.length < 6) message.error('New password should be atleast 6 characters long', 2);
      return;
    }
    firebase.auth().signInWithEmailAndPassword(userData.email, oldPass)
      .then((user) => {
        if (user) {
          firebase.auth().currentUser.updatePassword(newPass).then(() => {
            message.success('Changed Password, please sign in again.', 1.5, () => { window.location = '/signout'; });
          }).catch((err) => {
            console.log(err);
          });
        }
      }).catch((err) => {
        if (err.code === 'auth/wrong-password') message.error('Wrong old password.', 3);
        else message.error(err.message, 3);
      });
  }

  render() {
    const {
      oldPass, newPass, userData, gotUserProfile,
    } = this.state;
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
                <Input disabled className="cust-input" placeholder="Full Name" value={userData ? userData.displayName : ''} />
                <Input disabled className="cust-input" placeholder="E-Mail" value={userData ? userData.email : ''} />
                <Input onChange={(e) => { this.setState({ oldPass: e.target.value }); }} className="cust-input" placeholder="Old Password" value={oldPass} />
                <Input onChange={(e) => { this.setState({ newPass: e.target.value }); }} className="cust-input" placeholder="New Password" value={newPass} />
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
                      <p>{'You haven\'t joined any universities/classes yet.'}</p>
                    )
                    : (
                      <Collapse>
                        {
                          Object.keys(userData.universities).map((university) => {
                            const classList = [];
                            Object.keys(userData.universities[university]).forEach((classUid) => {
                              classList.push(`${userData.universities[university][classUid].name} - ${userData.universities[university][classUid].description}`);
                            });
                            return (
                              <Collapse.Panel header={university} key={university}>
                                <List
                                  dataSource={classList}
                                  renderItem={item => (
                                    <List.Item
                                      actions={[
                                        <Button icon="eye" size="small" shape="circle" />,
                                        <Button icon="close" size="small" shape="circle" type="danger" />,
                                      ]}
                                    >
                                      {item}
                                    </List.Item>
                                  )}
                                />
                              </Collapse.Panel>
                            );
                          })
                        }
                      </Collapse>
                    )
                  }
              </Card>
            </div>
          )
          : (
            <Icon className="profile-loading" type="loading" theme="outlined" />
          )
      }
      </div>
    );
  }
}

const ProtectedProfile = WithProtectedView(Profile);
export { Profile, ProtectedProfile };
