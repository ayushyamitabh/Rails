import React, { PureComponent } from 'react';
import {
  Button, Icon, Input, message, Card, Collapse, List, Alert, Progress,
} from 'antd';
import './Profile.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import { WithProtectedView } from '../../hoc';

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      oldPass: '',
      newPass: '',
      strengthColor: 'red',
    };
    this.changePassword = this.changePassword.bind(this);
    this.passwordInputHandler = this.passwordInputHandler.bind(this);
  }

  componentWillReceiveProps(nxtPrps) {
    if (nxtPrps.userData) this.setState({ userData: nxtPrps.userData });
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

  passwordInputHandler(e) {
    const hasNumber = value => new RegExp(/[0-9]/).test(value);
    const hasMixed = value => new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
    const hasSpecial = value => new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
    let strength = 0;
    if (hasNumber(e.target.value)) strength += 1;
    if (hasSpecial(e.target.value)) strength += 1;
    if (hasMixed(e.target.value)) strength += 1;
    if (strength === 0) this.setState({ strengthColor: 'red', newPass: e.target.value });
    if (strength === 1) this.setState({ strengthColor: 'orange', newPass: e.target.value });
    if (strength === 2) this.setState({ strengthColor: 'yellow', newPass: e.target.value });
    if (e.target.value.length >= 6 && strength === 3) this.setState({ strengthColor: 'green', newPass: e.target.value });
    else if (e.target.value.length < 6 && strength === 3) this.setState({ strengthColor: 'lightgreen', newPass: e.target.value });
  }

  render() {
    const {
      oldPass, newPass, userData, strengthColor,
    } = this.state;
    return (
      <div className="profile-page">
        {
        userData !== null && userData !== undefined
          ? (
            <div className="profile-page">

              <Card
                className="profile-card"
                title="About You"
              >
                <Input disabled className="cust-input" placeholder="Full Name" value={userData ? userData.displayName : ''} />
                <Input disabled className="cust-input" placeholder="E-Mail" value={userData ? userData.email : ''} />
                <Input onChange={(e) => { this.setState({ oldPass: e.target.value }); }} className="cust-input" placeholder="Old Password" value={oldPass} />
                <Input onChange={this.passwordInputHandler} className="cust-input" placeholder="New Password" value={newPass} />
                <Progress
                  format={(p, sp) => `${Math.round((p / 100) * 6)}/6`}
                  percent={100 * (newPass.length / 6)}
                  strokeColor={strengthColor}
                />
                {strengthColor !== 'green' && newPass.length > 0 ? (
                  <Alert
                    message="New password must be 6 or more characters and contain: Uppercase letter (A-Z), Lowercase letter (a-z), Digit (0-9), Special character (~`!@#$%^&*()+=_-{}[]\ "
                    type="error"
                  />
                ) : null}
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
                      <div>
                        <p className="academics-subtitle">Joined classes</p>
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
                      </div>
                    )
                  }
                {
                    Object.keys(userData.requested).length === 0
                      ? (
                        <p>No other requested classes.</p>
                      )
                      : (
                        <div>
                          <p className="academics-subtitle">Requested classes</p>
                          <Collapse>
                            {
                            Object.keys(userData.requested).map((university) => {
                              const classList = [];
                              Object.keys(userData.requested[university]).forEach((classUid) => {
                                classList.push(`${userData.requested[university][classUid].name} - ${userData.requested[university][classUid].description}`);
                              });
                              return (
                                <Collapse.Panel header={university} key={`requested${university}`}>
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
                        </div>
                      )
                    }
              </Card>
            </div>
          )
          : (
            <div className="center-loading-icon">
              <Icon className="profile-loading" type="loading" theme="outlined" />
            </div>
          )
      }
      </div>
    );
  }
}

const ProtectedProfile = WithProtectedView(Profile);
export { Profile, ProtectedProfile };
