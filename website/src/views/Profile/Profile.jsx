import React, { PureComponent } from 'react';
import {
  Button, Icon, Input, message, Card, Collapse, List, Alert, Progress, Modal, Breadcrumb, Checkbox,
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
      showModal: false,
      modalData: {},
      loading: false,
      showTeacherModal: false,
    };
    this.changePassword = this.changePassword.bind(this);
    this.passwordInputHandler = this.passwordInputHandler.bind(this);
    this.dropClass = this.dropClass.bind(this);
    this.viewClass = this.viewClass.bind(this);
  }

  componentWillReceiveProps(nxtPrps) {
    if (nxtPrps.userData) this.setState({ userData: nxtPrps.userData });
  }

  changePassword() {
    const {
      userData, oldPass, newPass, strengthColor,
    } = this.state;
    if (oldPass.length < 6 || newPass.length < 6) {
      if (oldPass.length < 6) message.error('Wrong old password.', 3);
      else if (newPass.length < 6) message.error('New password should be atleast 6 characters long', 2);
      return;
    }
    if (strengthColor === 'green') {
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
    } else {
      message.info('Password not strong enough.');
    }
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

  dropClass(classData, university, type) {
    this.setState({ loading: true });
    if (window.confirm('Are you sure you want to drop this class?')) {
      const { classUid } = classData;
      const { uid, email } = firebase.auth().currentUser;
      const reqData = {
        university,
        classUid,
        email,
        type,
        uid,
      };
      fetch('https://us-central1-rails-students.cloudfunctions.net/dropclass',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify(reqData),
        })
        .then(res => res.json())
        .then((result) => {
          this.setState({ loading: false });
          message.info(result.message);
          window.location.reload();
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
          message.error(err.message);
        });
    } else this.setState({ loading: false });
  }

  viewClass(cd, university, type) {
    const classData = cd;
    const { userData } = this.state;
    const { classUid } = classData;

    if (userData.type === 'teacher' && navigator.onLine) {
      window.location.pathname = `/class/edit/${university}/${classUid}`;
    } else {
      classData.time = `${classData.meetingTimes.from} to ${classData.meetingTimes.to}`;
      const daysArr = [];
      Object.keys(classData.meetingDays).forEach((day) => {
        if (classData.meetingDays[day] === true) daysArr.push(day.substr(0, 2));
      });
      classData.days = daysArr.join('-');
      if (daysArr.length === 0) classData.days = 'N/A';
      classData.isApproved = (type === 'approved');
      classData.university = university;
      classData.eventsSource = [];
      if (classData.events) {
        Object.keys(classData.events).forEach((event) => {
          classData.eventsSource.push({
            title: classData.events[event].title,
            dueDate: new Date(classData.events[event].dueDate).toDateString(),
          });
        });
      }
      this.setState({
        modalData: classData,
        showModal: true,
      });
    }
  }

  render() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const {
      oldPass, newPass, userData, strengthColor, modalData, showModal, loading, showTeacherModal,
    } = this.state;
    return (
      <div className="profile-page">
        <Modal
          title={`Edit ${modalData.name}`}
          visible={showTeacherModal}
          className="class-modal"
          centered
          footer={[
            <Button
              key="join-button"
              type="primary"
              onClick={() => this.setState({ showTeacherModal: false, modalData: {} })}
            >
              OK
            </Button>,
          ]}
        >
          <Input
            className="select-input"
            value={modalData.name}
            onChange={(e) => {
              modalData.name = e.target.value;
              this.setState({ modalData });
            }}
          />
          <Input
            className="select-input"
            value={modalData.description}
            onChange={(e) => {
              const md = modalData;
              md.description = e.target.value;
              this.setState({ modalData: md });
            }}
          />
          <h4>Meeting Days</h4>
          <Checkbox.Group
            className="create-class-days create-class-input"
            options={days}
            value={modalData.days}
            onChange={(dr) => {
              Object.keys(modalData.meetingDays).forEach((d) => {
                modalData.meetingDays[d] = (dr.indexOf(d) !== -1);
              });
              modalData.days = dr;
              this.setState({ modalData });
            }}
          />
        </Modal>
        <Modal
          title={modalData.description}
          visible={showModal}
          className="class-modal"
          centered
          footer={[
            <Button
              key="join-button"
              type="primary"
              onClick={() => this.setState({ showModal: false, modalData: {} })}
            >
              OK
            </Button>,
          ]}
        >
          {
          modalData.isApproved
            ? <Alert message="Enrolled in this class" type="success" showIcon />
            : <Alert message="Awaiting approval for this class" type="info" showIcon />
        }
          <Breadcrumb style={{ margin: '10px auto' }}>
            <Breadcrumb.Item>{modalData.university}</Breadcrumb.Item>
            <Breadcrumb.Item>{modalData.name}</Breadcrumb.Item>
          </Breadcrumb>
          <p className="join-class-label">
            <span>Section Code: </span>
            {modalData.name}
          </p>
          <p className="join-class-label">
            <span>Instructor: </span>
            {modalData.instructorName}
          </p>
          <p className="join-class-label">
            <span>Time: </span>
            {modalData.time}
          </p>
          <p className="join-class-label">
            <span>Day(s): </span>
            {modalData.days}
          </p>
          <List
            header="Class Events"
            dataSource={modalData.eventsSource}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={`Due on ${item.dueDate}`}
                />
              </List.Item>
            )}
          />
        </Modal>
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
                    ? <Button style={{ marginBottom: 10 }} href="/class/join" type="primary" block>Join Class</Button>
                    : <Button style={{ marginBottom: 10 }} href="/class/create" type="primary" block>Create Class</Button>
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
                              classList.push({
                                ...userData.universities[university][classUid],
                                classUid,
                              });
                            });
                            return (
                              <Collapse.Panel header={university} key={university}>
                                <List
                                  dataSource={classList}
                                  renderItem={item => (
                                    <List.Item
                                      actions={[
                                        <Button loading={loading} onClick={() => { this.viewClass(item, university, 'approved'); }} icon="eye" size="small" shape="circle" />,
                                        <Button loading={loading} onClick={() => { this.dropClass(item, university, 'approved'); }} icon="close" size="small" shape="circle" type="danger" />,
                                      ]}
                                    >
                                      {`${item.name} - ${item.description}`}
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
                                classList.push({
                                  ...userData.requested[university][classUid],
                                  classUid,
                                });
                              });
                              return (
                                <Collapse.Panel header={university} key={`requested${university}`}>
                                  <List
                                    dataSource={classList}
                                    renderItem={item => (
                                      <List.Item
                                        actions={[
                                          <Button onClick={() => { this.viewClass(item, university, 'requested'); }} icon="eye" size="small" shape="circle" />,
                                          <Button onClick={() => { this.dropClass(item, university, 'requested'); }} icon="close" size="small" shape="circle" type="danger" />,
                                        ]}
                                      >
                                        {`${item.name} - ${item.description}`}
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
