import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { DashboardHome, Profile } from '..';
import { Layout, message } from 'antd';
import firebase from 'firebase/app';
import 'firebase/auth';
import { DashboardHeader, CreateEventDrawer, ViewEventDrawer } from '../../components';
import { WithProtectedView } from '../../hoc';
import './Dashboard.css';

class DashboardRouter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      teacher: false,
      userData: {},
      eventData: null,
      eventVisible: false,
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      if (firebase.auth().currentUser !== undefined) {
        firebase.auth().currentUser.getIdToken(true)
          .then((idToken) => {
            const { uid } = firebase.auth().currentUser;
            const reqData = { uid, idToken };
            fetch(
              'https://us-central1-rails-students.cloudfunctions.net/getprofile',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData),
              },
            )
              .then(res => res.json())
              .then((data) => {
                localStorage.setItem('DashboardRouter-teacher', (data.userData.type === 'teacher').toString());
                localStorage.setItem('DashboardRouter-userData', JSON.stringify(data.userData));
                this.setState({
                  teacher: data.userData.type === 'teacher',
                  userData: data.userData ? data.userData : {},
                });
              })
              .catch((err) => {
                console.log(err);
              });
          });
      }
    } else {
      this.setState({
        teacher: localStorage.getItem('DashboardRouter-teacher') === 'true',
        userData: JSON.parse(localStorage.getItem('DashboardRouter-userData')),
      });
    }
  }

  showDrawer = () => {
    this.setState({
      visible: true,
      eventData: null,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  viewEvent = (eventData) => {
    if (navigator.onLine) {
      message.info('Getting event...');
      const { userData } = this.state;
      const { eventUid, classUid, university } = eventData;
      const { uid } = firebase.auth().currentUser;
      const reqData = { eventUid, classUid, uid };
      fetch(
        'https://us-central1-rails-students.cloudfunctions.net/geteventdetails',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        },
      )
        .then(res => res.json())
        .then((result) => {
          message.info(result.message);
          console.log(result);
          if (result.message === 'Found event') {
            result.eventData.university = university;
            result.eventData.classUid = classUid;
            result.eventData.eventUid = eventUid;
            if (userData.type === 'teacher' && (result.eventData.instructorUid === uid)) {
              this.setState({
                visible: true,
                eventData: result.eventData,
              });
            } else {
              this.setState({
                eventVisible: true,
                eventData: result.eventData,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          message.error(err.message);
        });
    } else {
      message.error('Can\'t get event when offline');
    }
  }

  closeEvent = () => {
    this.setState({
      eventVisible: false,
      eventData: null,
    });
  }

  render() {
    const {
      visible, teacher, userData, eventData, eventVisible,
    } = this.state;
    return (
      <Layout className="Container" style={{ height: '100%' }}>
        <DashboardHeader teacher={teacher} showDrawer={this.showDrawer} />
        <Layout style={{ height: '100%' }}>
          <Router>
            <div>
              <Route exact path="/dashboard" render={props => <DashboardHome viewEvent={this.viewEvent} {...props} userData={userData} />} />
              <Route exact path="/dashboard/profile" render={props => <Profile {...props} userData={userData} />} />
            </div>
          </Router>
        </Layout>
        <CreateEventDrawer
          userData={userData}
          visible={visible}
          eventData={eventData}
          onClose={this.onClose}
        />
        <ViewEventDrawer
          visible={eventVisible}
          eventData={eventData}
          onClose={this.closeEvent}
        />
      </Layout>
    );
  }
}
const ProtectedDashboardRouter = WithProtectedView(DashboardRouter);
export { ProtectedDashboardRouter, DashboardRouter };
